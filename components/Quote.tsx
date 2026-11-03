"use client";
import { useState } from "react";

// data-testid and the raw text node let the e2e test compare displayed text with the chunk byte for byte.
export function Quote(p: { quote: string; chunkId: string; where: string; short: string; heading?: string; ocr?: boolean; caveat?: string | null }) {
  const [state, setState] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const verify = async () => {
    setState("Checking…");
    const res = await fetch("/api/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chunk_id: p.chunkId, quote: p.quote }) });
    const v = await res.json();
    setOk(Boolean(v.found));
    setState(v.found ? `Found: characters ${v.char_start} to ${v.char_end} of stored page ${v.page} of ${v.file}, SHA-256 ${v.sha256}.` : `Not found: ${v.reason}.`);
  };
  return (
    <figure style={{ margin: ".4rem 0" }}>
      <blockquote className="quote" data-testid="quote" data-chunk={p.chunkId}>{p.quote}</blockquote>
      <figcaption className="cite">
        {p.short}, {p.where}
        {p.heading && !/^(sub-article|Article) /.test(p.where) ? `, ${p.heading}` : ""} <span className="mono">{p.chunkId}</span>
        {p.ocr && <span className="tag ocr" style={{ marginLeft: 4 }}>OCR-derived</span>}{" "}
        <button type="button" className="linklike" onClick={verify} data-testid="quote-verify">verify</button>
        {state && <span data-testid="quote-verify-result" className={ok ? "pass" : ""}> {state}</span>}
        {p.caveat && <div data-testid="caveat">{p.caveat}</div>}
      </figcaption>
    </figure>
  );
}
