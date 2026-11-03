import { describe, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import scenario from "../data/scenarios/primary.json" with { type: "json" };
import { GENESIS, makeLine, verifyLog } from "../lib/audit.ts";
import { emptyState, runStep } from "../lib/engine.ts";
import { stepToLines } from "../lib/step-log.ts";

function sessionLog(): { log: string; head: string } {
  let state = emptyState();
  let head = GENESIS;
  let seq = 0;
  const lines: string[] = [];
  for (const e of scenario.events) {
    const step = runStep(e.text, state);
    state = step.state;
    const out = stepToLines(step, { session: "t", seq, prevHash: head, eventId: e.id, scenarioId: scenario.id });
    lines.push(...out.lines);
    head = out.head;
    seq = out.seq;
  }
  return { log: lines.join("\n") + "\n", head };
}

describe("audit log", () => {
  it("verifies a complete session", () => {
    const { log, head } = sessionLog();
    const r = verifyLog(log, head);
    expect(r.ok).toBe(true);
    expect(r.head).toBe(head);
  });

  it("fails after any one-byte edit, at every position of a short log", () => {
    const a = makeLine(GENESIS, 1, "t", "input", { text: "héllo" });
    const b = makeLine(a.hash, 2, "t", "output", { ok: true });
    const log = Buffer.from(a.line + "\n" + b.line + "\n", "utf8");
    expect(verifyLog(log).ok).toBe(true);
    for (let i = 0; i < log.length; i++) {
      const copy = Buffer.from(log);
      copy[i] ^= 0x01;
      expect(verifyLog(copy).ok, `byte ${i}`).toBe(false);
    }
  });

  it("fails after a one-byte edit across a whole session log", () => {
    const log = Buffer.from(sessionLog().log, "utf8");
    for (let i = 0; i < log.length; i += 97) {
      const copy = Buffer.from(log);
      copy[i] = copy[i] === 0x41 ? 0x42 : 0x41;
      expect(verifyLog(copy).ok, `byte ${i}`).toBe(false);
    }
  });

  it("detects a removed line, and a truncated tail when the head is known", () => {
    const { log, head } = sessionLog();
    const lines = log.trimEnd().split("\n");
    const middleGone = lines.filter((_, i) => i !== 3).join("\n") + "\n";
    expect(verifyLog(middleGone).ok).toBe(false);
    const tailGone = lines.slice(0, -1).join("\n") + "\n";
    expect(verifyLog(tailGone, head).ok).toBe(false);
  });

  it("the verify script exits 0, then 1 after a one-byte edit", () => {
    const dir = mkdtempSync(join(tmpdir(), "audit-"));
    const { log } = sessionLog();
    const file = join(dir, "log.jsonl");
    writeFileSync(file, log);
    expect(execFileSync("node", ["scripts/verify-audit.ts", file], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })).toMatch(/VERIFIED/);
    const bytes = Buffer.from(log);
    bytes[100] ^= 0x01;
    writeFileSync(file, bytes);
    const res = spawnSync("node", ["scripts/verify-audit.ts", file], { encoding: "utf8" });
    expect(res.status).toBe(1);
    expect(res.stderr).toMatch(/FAILED/);
  });
});
