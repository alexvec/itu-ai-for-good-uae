"use client";
import { useMemo, useState } from "react";
import { useSession } from "./useSession.ts";

interface Verify { ok: boolean; lines: number; head: string | null; error?: string; at_line?: number }

async function verify(bytes: BlobPart): Promise<Verify> {
  const res = await fetch("/api/audit/verify", { method: "POST", body: new Blob([bytes]) });
  return res.json();
}

export function AuditView() {
  const { data } = useSession();
  const [result, setResult] = useState<{ label: string; v: Verify } | null>(null);
  const log = useMemo(() => (data?.lines.length ? data.lines.join("\n") + "\n" : ""), [data]);
  const parsed = useMemo(() => data?.lines.map((l) => JSON.parse(l) as { hash: string; body: { seq: number; ts: string; stage: string; payload: unknown } }) ?? [], [data]);

  const check = async (label: string, bytes: BlobPart) => setResult({ label, v: await verify(bytes) });
  const tamper = () => {
    const bytes = new TextEncoder().encode(log);
    const at = Math.floor(bytes.length / 2);
    bytes[at] = bytes[at] ^ 0x01;
    return check(`Copy with one byte changed, at byte ${at}`, bytes);
  };
  const upload = async (f: File | undefined) => { if (f) await check(`Uploaded file ${f.name}`, await f.arrayBuffer()); };
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([log], { type: "application/x-ndjson" }));
    a.download = `audit-${data?.session}.jsonl`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!data) return null;
  return (
    <>
      {!log && <div className="card">No events yet in this browser session. <a href="/">Run the scenario</a> first.</div>}
      {log && (
        <>
          <div className="row">
            <button onClick={download} data-testid="export">Export log as JSONL</button>
            <button className="secondary" onClick={() => check("Log as recorded", log)} data-testid="verify">Verify log</button>
            <button className="secondary" onClick={tamper} data-testid="tamper">Change one byte and verify</button>
            <label className="btn secondary">Verify a file<input type="file" accept=".jsonl,.txt" style={{ display: "none" }} onChange={(e) => upload(e.target.files?.[0])} data-testid="upload" /></label>
          </div>
          {result && (
            <div className="card" data-testid="verify-result">
              <div className="cite">{result.label}</div>
              {result.v.ok
                ? <span className="pass">VERIFIED: {result.v.lines} lines. Head <code>{result.v.head}</code></span>
                : <span className="fail">FAILED at line {result.v.at_line}: {result.v.error}</span>}
            </div>
          )}
          <p className="cite">Head hash now: <code data-testid="head">{data.head}</code>. Keep this value to detect lines removed from the end.</p>
          <div className="card cite">
            Offline: <code>node scripts/verify-audit.ts audit.jsonl</code>. The chain makes an edit evident. Someone who recomputes the whole chain could forge a new one, so compare the head hash with a copy kept elsewhere. The log lives in this browser session; there is no server-side store.
          </div>
          <h2>Trace</h2>
          <div className="table-wrap">
            <table data-testid="trace">
              <thead><tr><th>#</th><th>Stage</th><th>Hash</th><th>Payload</th></tr></thead>
              <tbody>
                {parsed.map((p) => (
                  <tr key={p.body.seq}>
                    <td>{p.body.seq}</td>
                    <td>{p.body.stage === "model-generated" ? <span className="tag model">model-generated</span> : <span className="tag">{p.body.stage}</span>}</td>
                    <td className="mono">{p.hash.slice(0, 12)}…</td>
                    <td><details><summary>view</summary><pre className="raw">{JSON.stringify(p.body.payload, null, 1)}</pre></details></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
