import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import scenario from "../data/scenarios/primary.json" with { type: "json" };
import { chunkById } from "../lib/data.ts";
import { allControlResults, allOutcomes, classify, emptyState, rules, runStep, type StepResult } from "../lib/engine.ts";
import { GENESIS } from "../lib/audit.ts";
import { stepToLines } from "../lib/step-log.ts";
import { verifyQuote } from "../lib/verify.ts";
import { evidenceMarkdown, nonDataRows, pipelineRows, supportingRows } from "../lib/evidence.ts";
import { discardReason, modelConfigured, modelNarrative } from "../lib/llm.ts";
import { CANDIDATE, NO_GLOBAL_EXAMPLE, NOT_ADDRESSED, PIPELINE } from "../lib/types.ts";
import { ROOT } from "../scripts/kb-io.ts";

function run(): StepResult[] {
  let state = emptyState();
  return scenario.events.map((e) => {
    const r = runStep(e.text, state);
    state = r.state;
    return r;
  });
}

function displayedQuotes(step: StepResult): { chunk_id: string; quote: string }[] {
  return [
    ...step.rule_findings.map((f) => ({ chunk_id: f.citation.chunk_id, quote: f.citation.quote })),
    ...step.retrieved.map((f) => ({ chunk_id: f.chunk_id, quote: f.quote })),
    ...step.controls.flatMap((c) => (c.nearest ? [{ chunk_id: c.nearest.chunk_id, quote: c.nearest.quote }] : [])),
    ...(step.decision?.actions.flatMap((a) => [{ chunk_id: a.citation.chunk_id, quote: a.citation.quote }, ...a.supporting.map((x) => ({ chunk_id: x.chunk_id, quote: x.quote }))]) ?? []),
    ...(step.decision?.conflicts.flatMap((c) => [c.winner, c.loser].map((x) => ({ chunk_id: x.chunk_id, quote: x.quote }))) ?? []),
    ...step.rule_findings.flatMap((f) => f.supporting.map((x) => ({ chunk_id: x.chunk_id, quote: x.quote }))),
    ...(step.decision?.outcomes.flatMap((o) => [...o.citations, ...o.nearest].map((c) => ({ chunk_id: c.citation.chunk_id, quote: c.citation.quote }))) ?? []),
  ];
}

describe("main scenario with the model variables unset", () => {
  const saved = { a: process.env.LLM_BASE_URL, b: process.env.LLM_API_KEY, c: process.env.LLM_MODEL };
  beforeEach(() => {
    delete process.env.LLM_BASE_URL;
    delete process.env.LLM_API_KEY;
    delete process.env.LLM_MODEL;
  });
  afterEach(() => {
    if (saved.a) process.env.LLM_BASE_URL = saved.a;
    if (saved.b) process.env.LLM_API_KEY = saved.b;
    if (saved.c) process.env.LLM_MODEL = saved.c;
  });

  it("completes every event and runs no model", async () => {
    expect(modelConfigured()).toBe(false);
    const steps = run();
    expect(steps).toHaveLength(scenario.events.length);
    for (const s of steps) expect(s.classes.length).toBeGreaterThan(0);
    expect(await modelNarrative(steps[0])).toBeUndefined();
    expect(scenario.synthetic).toBe(true);
  });

  it("follows the template: popular, controversy, then the KB decides, then the privacy escalation", () => {
    const beats = scenario.events.map((e) => e.beat);
    const pop = beats.indexOf("Popular");
    const con = beats.indexOf("Controversy");
    const dec = beats.indexOf("KB decides");
    const esc = beats.indexOf("Escalation");
    const dec2 = beats.lastIndexOf("KB decides");
    expect(pop).toBeGreaterThanOrEqual(0);
    expect(pop < con && con < dec && dec < esc && esc < dec2).toBe(true);
    const steps = run();
    expect(steps[pop].rule_findings.map((f) => f.rule_id)).toContain("PR-03");
    expect(steps[con].rule_findings.map((f) => f.rule_id)).toEqual(expect.arrayContaining(["TL-04", "TL-08", "TL-11"]));
    expect(steps[dec].decision!.actions.map((a) => a.rule_id)).toEqual(expect.arrayContaining(["TL-04", "TL-11", "PR-04"]));
    expect(steps[dec].decision!.outcomes).toHaveLength(0);
    expect(steps[dec2].decision!.actions.map((a) => a.rule_id)).toEqual(expect.arrayContaining(["TL-12", "TL-13", "TL-19", "PR-11", "PR-14"]));
    expect(steps[dec2].decision!.outcomes).toHaveLength(4);
  });

  it("the KB decides the controversy with PA-01 and shows both quotes", () => {
    const steps = run();
    const dec = steps[scenario.events.findIndex((e) => e.beat === "KB decides")].decision!;
    expect(dec.conflicts.map((c) => c.id)).toEqual(["C-01", "C-02"]);
    expect(dec.conflicts[0].winner.document).toContain("CPR");
    expect(dec.conflicts[0].loser.document).toContain("Strategy");
    expect(dec.conflicts[1].loser.document).toContain("Ethics");
    expect(dec.conflicts[1].loser.quote).toContain("should be used");
    expect(dec.conflicts[1].winner.quote).toContain("must obtain");
    expect(steps[scenario.events.findLastIndex((e) => e.beat === "KB decides")].decision!.conflicts).toHaveLength(0);
  });

  it("telecom provisions lead the decisions", () => {
    const steps = run();
    for (const s of steps) if (s.decision?.actions.length) expect(s.decision.actions.some((a) => a.rank <= 2)).toBe(true);
    const e6 = steps[5].decision!.actions;
    expect(e6[0].rule_id).toBe("TL-12");
  });

  it("records the template outcomes as read from the text, each with its limit", () => {
    const by = Object.fromEntries(allOutcomes().map((o) => [o.id, o]));
    expect(by.consent.verdict).toBe("supported");
    expect(by.prohibit.verdict).toBe("partly");
    expect(by.purpose_limitation.verdict).toBe("partly");
    expect(by.oversight_referral.verdict).toBe("partly");
    expect(by.oversight_referral.unsupported).toMatch(/duty on a Licensee to refer or report/);
    expect(by.consent.unsupported).toMatch(/Data Protection Law/);
    for (const o of allOutcomes()) expect(o.citations.length, o.id).toBeGreaterThan(0);
  });

  it("emergency traffic stays scoped to what the text says", () => {
    const e9 = run()[8];
    const tl = e9.rule_findings.find((f) => f.rule_id === "TL-28")!;
    expect(tl.analogy_note).toMatch(/non-payment/);
    expect(tl.action).toMatch(/does not speak to ML throttling/);
    expect(e9.controls.find((c) => c.id === "G-10")!.addressed).toBe(false);
  });

  it("every displayed quote is in its chunk, for every event and view", () => {
    let total = 0;
    const check = (q: { chunk_id: string; quote: string }) => {
      total++;
      expect(chunkById.get(q.chunk_id)?.text.includes(q.quote), `${q.chunk_id}: ${q.quote}`).toBe(true);
    };
    for (const s of run()) displayedQuotes(s).forEach(check);
    for (const t of ["A law enforcement request asks for stored communications metadata", "Our licence renewal asks about the ML function", "Customers complain about the vendor export of personal data"]) displayedQuotes(runStep(t)).forEach(check);
    for (const c of allControlResults()) if (c.nearest) check(c.nearest);
    for (const r of [...pipelineRows, ...supportingRows, ...nonDataRows]) if (r.citation) check({ chunk_id: r.citation.chunk_id, quote: r.citation.quote });
    expect(total).toBeGreaterThan(40);
  });

  it("the agent never reads the scenario's author notes", () => {
    expect(runStep.length).toBeLessThanOrEqual(2);
    expect(run()[0].nodes.sort()).toEqual(["C", "D", "M", "P", "PP", "SINK", "SRC"]);
  });

  it("free text with no matching class says so and fires nothing", () => {
    const r = runStep("The billing team likes the colour of the new logo");
    expect(r.classes).toHaveLength(0);
    expect(r.rule_findings).toHaveLength(0);
    expect(r.headline).toContain(NOT_ADDRESSED);
  });

  it("an interception event cites the law and still marks the ML pipeline question not addressed", () => {
    const r = runStep("A request arrives to intercept communications");
    expect(r.rule_findings.map((f) => f.rule_id)).toContain("TL-30");
    expect(r.controls.find((x) => x.id === "A-04")!.addressed).toBe(true);
    const c = r.controls.find((x) => x.id === "G-01")!;
    expect(c.status).toBe(NOT_ADDRESSED);
    expect(c.review_flag).toBe(CANDIDATE);
    expect(c.global_example).toBe(NO_GLOBAL_EXAMPLE);
  });

  it("does not classify 'licensed telecom operator' as a licensing event", () => {
    expect(classify("A licensed telecom operator deploys a model").map((c) => c.id)).not.toContain("licensing_authorization");
  });
});

describe("evidence export", () => {
  it("has one row per node in template order, each with dimension and document", () => {
    expect(pipelineRows.map((r) => r.node)).toEqual(PIPELINE);
    for (const r of pipelineRows) {
      expect(r.use_case.length).toBeGreaterThan(0);
      expect(r.dimension_id).toBeGreaterThan(0);
      expect(r.citation?.chunk_id).toBeTruthy();
    }
  });

  it("includes strategy alignment, interface design and human collaboration", () => {
    expect(nonDataRows.map((r) => r.item)).toEqual(["Strategy alignment", "Interface design", "Collaboration between AI and a human"]);
  });

  it("states the KB's limits and marks analogy", () => {
    const md = evidenceMarkdown();
    expect(md).not.toContain("no binding telecom sector law");
    expect(md).toContain("the document says the Arabic version prevails");
    expect(md).toContain("PDPL");
    expect(md).toContain("HTTP 403");
    expect(md).toContain("applied by analogy");
    expect(md).toContain(NO_GLOBAL_EXAMPLE);
    expect(md).toContain("PA-01");
  });

  it("the audit log records the precedence decision", () => {
    let state = emptyState();
    let lines: string[] = [];
    for (const e of scenario.events.slice(0, 4)) {
      const r = runStep(e.text, state);
      state = r.state;
      lines = stepToLines(r, { session: "t", seq: 0, prevHash: GENESIS, eventId: e.id, scenarioId: scenario.id }).lines;
    }
    expect(lines.join("\n")).toContain("C-01");
    expect(lines.join("\n")).toContain("PA-01");
  });
});

describe("verify action", () => {
  it("re-finds a quote in its chunk and in the stored text of its file", () => {
    const r = rules.find((x) => x.id === "TL-12")!;
    const v = verifyQuote(r.citation.chunk_id, r.citation.quote);
    expect(v.found).toBe(true);
    expect(v.file).toBe("tdra-consumer-protection-regulations-v2.0-2023.pdf");
    expect(v.page).toBe(60);
    expect(v.sha256).toBe("7e8dad214b44d11b2cb4268ef883f51af24b90128240d44ecb9d52b3e6f7a4bc");
  });

  it("does not find an altered quote", () => {
    const r = rules.find((x) => x.id === "TL-12")!;
    expect(verifyQuote(r.citation.chunk_id, r.citation.quote.replace("must", "may")).found).toBe(false);
    expect(verifyQuote("no-such-chunk", "x").found).toBe(false);
  });
});

describe("optional model guard", () => {
  it("discards article numbers, foreign chunk ids and unknown quotations", () => {
    expect(discardReason("Under Article 14 this is banned.", [], [])).toMatch(/article/);
    expect(discardReason("See ethics-p99-c1.", [], ["ethics-p01-c1"])).toMatch(/chunk/);
    expect(discardReason('The text says "operators must always ask first".', ["other text"], [])).toMatch(/quotation/);
    expect(discardReason('The text says "should respect privacy".', ["AI systems should respect privacy and more"], [])).toBeNull();
  });

  it("marks model output separately, and falls back when the call fails or adds a citation", async () => {
    const env = { LLM_BASE_URL: "http://model.test", LLM_API_KEY: "k", LLM_MODEL: "m" } as unknown as NodeJS.ProcessEnv;
    const step = runStep("Subscribers complain about service");
    const reply = (content: string) => new Response(JSON.stringify({ choices: [{ message: { content } }] }));
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock.mockResolvedValueOnce(reply("Subscribers raised a complaint."));
    expect((await modelNarrative(step, env))?.status).toBe("used");
    fetchMock.mockResolvedValueOnce(reply("Article 9 applies."));
    expect((await modelNarrative(step, env))?.status).toBe("discarded");
    fetchMock.mockRejectedValueOnce(new Error("down"));
    expect((await modelNarrative(step, env))?.status).toBe("failed");
    fetchMock.mockRestore();
  });
});

describe("product text", () => {
  const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  const files = ["app", "components", "lib", "data"].flatMap((d) => walk(join(ROOT, d))).filter((f) => /\.(tsx?|json|css)$/.test(f));
  const text = files.map((f) => [f, readFileSync(f, "utf8")] as const);

  it("never says the text or the law is silent", () => {
    for (const [f, t] of [...text, ["README", readFileSync(join(ROOT, "README.md"), "utf8")] as const]) {
      expect(/text silent/i.test(t), f).toBe(false);
    }
  });

  it("no longer says the KB lacks telecom law, in the product or the README", () => {
    const stale = /no binding telecom sector law|KB has no (binding )?telecom|exactly four|four documents|four UAE documents|these four files|was not ingested|were not ingested/i;
    for (const [f, t] of [...text, ["README", readFileSync(join(ROOT, "README.md"), "utf8")] as const]) {
      if (/kb\/|extracted/.test(f)) continue;
      expect(stale.test(t), f).toBe(false);
    }
  });

  it("says nothing of the Data Protection Law's content beyond its name and the CPR's deference to it", () => {
    for (const [f, t] of text) {
      if (/kb\/|extracted/.test(f)) continue;
      expect(/(PDPL|Data Protection Law|DPL) (requires|prohibits|says that|obliges|mandates)/.test(t), f).toBe(false);
    }
  });

  it("reports no accuracy number", () => {
    for (const [f, t] of text) expect(/accuracy[^.\n]{0,20}\d+\s*%|\d+\s*%[^.\n]{0,20}accura/i.test(t) && !f.includes("chunks.json"), f).toBe(false);
  });
});
