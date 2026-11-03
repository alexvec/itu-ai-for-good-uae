// Hash-chained, append-only log. Each line is {"hash":"<sha256>","body":<json>} and the hash covers
// the previous hash plus the exact bytes of the body, so editing any single byte breaks verification.
import { createHash } from "node:crypto";

export const GENESIS = "0".repeat(64);

export interface AuditBody {
  seq: number;
  ts: string;
  session: string;
  stage: string;
  prev_hash: string;
  payload: unknown;
}

const sha = (prev: string, body: Buffer | string) => createHash("sha256").update(prev).update(body).digest("hex");

export function makeLine(prevHash: string, seq: number, session: string, stage: string, payload: unknown, ts = new Date().toISOString()): { line: string; hash: string } {
  const body = JSON.stringify({ seq, ts, session, stage, prev_hash: prevHash, payload } satisfies AuditBody);
  const hash = sha(prevHash, body);
  return { line: `{"hash":"${hash}","body":${body}}`, hash };
}

export interface VerifyResult { ok: boolean; lines: number; head: string | null; error?: string; at_line?: number }

const PREFIX = Buffer.from('{"hash":"');
const MIDDLE = Buffer.from('","body":');

/** Verifies raw bytes. The file must end in exactly one newline. Pass expectedHead to also detect truncation. */
export function verifyLog(raw: Buffer | string, expectedHead?: string): VerifyResult {
  const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw, "utf8");
  const fail = (at_line: number, error: string, lines = at_line - 1): VerifyResult => ({ ok: false, lines, head: null, error, at_line });
  if (buf.length === 0) return fail(1, "empty log", 0);
  if (buf[buf.length - 1] !== 0x0a) return fail(1, "log must end with a newline", 0);
  let prev = GENESIS;
  let start = 0;
  let n = 0;
  while (start < buf.length) {
    const end = buf.indexOf(0x0a, start);
    const line = buf.subarray(start, end);
    n++;
    const hashEnd = PREFIX.length + 64;
    if (line.length < hashEnd + MIDDLE.length + 2 || !line.subarray(0, PREFIX.length).equals(PREFIX) || !line.subarray(hashEnd, hashEnd + MIDDLE.length).equals(MIDDLE) || line[line.length - 1] !== 0x7d) {
      return fail(n, "line is not in the audit format");
    }
    const claimed = line.subarray(PREFIX.length, hashEnd).toString("latin1");
    const body = line.subarray(hashEnd + MIDDLE.length, line.length - 1);
    if (sha(prev, body) !== claimed) return fail(n, "hash mismatch: this line or an earlier one was changed");
    let parsed: AuditBody;
    try {
      parsed = JSON.parse(body.toString("utf8"));
    } catch {
      return fail(n, "body is not valid JSON");
    }
    if (parsed.prev_hash !== prev) return fail(n, "prev_hash does not match the previous line");
    if (parsed.seq !== n) return fail(n, `seq is ${parsed.seq}, expected ${n}`);
    prev = claimed;
    start = end + 1;
  }
  if (expectedHead && expectedHead !== prev) return { ok: false, lines: n, head: prev, error: "head hash differs from the expected value: lines may be missing from the end", at_line: n };
  return { ok: true, lines: n, head: prev };
}
