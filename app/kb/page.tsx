import { chunks, chunksForDoc, countInKb, documents, NOT_INGESTED, selfDescriptionChunk } from "../../lib/data.ts";
import { Quote } from "../../components/Quote.tsx";

export const metadata = { title: "Knowledge base | Y.3172 Incident Counsel" };

const ABSENT_TERMS = ["telecom", "subscriber", "interception", "breach", "purpose limitation", "sandbox", "emergency"];

export default function KbPage() {
  return (
    <>
      <h1>Knowledge base</h1>
      <p className="lede">
        Exactly four documents. {chunks.length} chunks, each a verbatim slice of the text stored per page, with page
        numbers. Hashes are checked against <code>sources/README.md</code> at build time and the build fails on a
        mismatch. No document here is binding telecom law.
      </p>
      <div className="row">
        <a className="btn secondary" href="/api/kb.jsonl">Export KB as JSONL</a>
      </div>
      <div className="table-wrap">
        <table data-testid="kb-table">
          <thead>
            <tr>
              <th>Document</th><th>What it is</th><th>Pages</th><th>Chunks</th><th>Retrieved</th><th>SHA-256</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => {
              const cs = chunksForDoc(d.id);
              const pages = new Set(cs.map((c) => c.page));
              const ocr = new Set(cs.filter((c) => c.extraction === "ocr").map((c) => c.page));
              return (
                <tr key={d.id}>
                  <td>
                    <a href={d.source_url}>{d.title}</a>
                    <div className="cite mono">{d.file}</div>
                    {d.source_note && <div className="cite">{d.source_note}</div>}
                  </td>
                  <td>{d.instrument_type}</td>
                  <td>
                    {pages.size - ocr.size} text layer
                    {ocr.size > 0 && <div><span className="tag ocr">OCR-derived</span>p. {[...ocr].join(", ")}</div>}
                    {d.not_ingested_pages.map((p) => <div key={p.page} className="cite">p. {p.page} not ingested</div>)}
                  </td>
                  <td>{cs.length}</td>
                  <td>{d.retrieved_on}</td>
                  <td className="mono" style={{ wordBreak: "break-all", minWidth: "14ch" }}>{cs[0].sha256}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>What each document is, and is not</h2>
      {documents.map((d) => {
        const c = selfDescriptionChunk(d);
        return (
          <div className="card" key={d.id}>
            <strong>{d.short}.</strong> {d.status_note}
            {d.analogy_note && <div><span className="tag analogy">by analogy</span>{d.analogy_note}</div>}
            {c && <Quote quote={d.self_description!.quote} chunkId={c.id} page={c.page} short={d.short} />}
            <ul className="cite">{d.reading_notes.map((n) => <li key={n}>{n}</li>)}</ul>
            {d.not_ingested_pages.map((p) => <div key={p.page} className="cite">Not ingested: page {p.page}. {p.reason}</div>)}
          </div>
        );
      })}

      <h2>Not in the KB</h2>
      <div className="table-wrap">
        <table data-testid="not-ingested">
          <thead><tr><th>Item</th><th>Status</th></tr></thead>
          <tbody>
            {NOT_INGESTED.map((n) => <tr key={n.name}><td>{n.name}</td><td>{n.note}</td></tr>)}
            <tr><td>Global examples</td><td>No foreign instrument is ingested, so the gap view shows &quot;no global example in KB&quot;. The UAE documents mention some foreign practice in passing; those passages are not offered as global examples, because no foreign source was ingested to check them against.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Terms that never occur in the ingested text</h2>
      <p className="lede">Counted live from the stored chunks. Zero here means the four documents do not use the word. It says nothing about UAE law.</p>
      <div className="table-wrap">
        <table data-testid="term-counts">
          <thead><tr><th>Term</th><th>Pages in KB containing it</th></tr></thead>
          <tbody>{ABSENT_TERMS.map((t) => <tr key={t}><td>{t}</td><td>{countInKb(t)}</td></tr>)}</tbody>
        </table>
      </div>

      <h2>Licence and attribution</h2>
      <p className="cite">
        The four documents remain the work of their publishers and are not covered by this project&apos;s MIT licence.
        The AI Ethics Principles and Guidelines are published under CC BY 4.0, owner the UAE AI and Blockchain Council.
        Nothing here is endorsed by any UAE office.
      </p>
    </>
  );
}
