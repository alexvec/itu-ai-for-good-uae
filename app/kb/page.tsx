import { chunks, chunksForDoc, countInKb, documents, sourceAttempts, selfDescriptionChunk } from "../../lib/data.ts";
import { locator } from "../../lib/engine.ts";
import { Quote } from "../../components/Quote.tsx";

export const metadata = { title: "Knowledge base | Y.3172 Incident Counsel" };

const TERMS = ["telecom", "subscriber", "interception", "consent", "purpose limitation", "sandbox", "emergency", "machine learning", "data protection law"];
const TELECOM = ["law", "cpr", "uec"];
const GUIDANCE = ["strategy", "charter", "ethics", "guideline"];
const FRAMEWORK = ["y3172", "readiness"];

export default function KbPage() {
  return (
    <>
      <h1>Knowledge base</h1>
      <p className="lede">
        Nine documents: the Telecom Law, two regulator texts, four UAE AI guidance documents and two ITU framework
        documents. {chunks.length} chunks, each a verbatim slice of stored text. Hashes are checked against{" "}
        <code>sources/README.md</code> at build time and the build fails on a mismatch.
      </p>
      <div className="card" data-testid="kb-limits">
        <strong>What this KB contains and does not.</strong> It contains the English text of Federal Law by Decree No. 3 of
        2003 from a secondary host, the TDRA Consumer Protection Regulations v2.0 without their annexes, and the 2009
        Unsolicited Electronic Communications policy. It does not contain the Arabic text as a read source, later amendments
        beyond the footnotes in the saved text, the CPR annexes, the Data Protection Law, the Emirates Data Office decree, any
        licence or any foreign law.
      </div>
      <div className="row">
        <a className="btn secondary" href="/api/kb.jsonl">Export KB as JSONL</a>
      </div>
      <div className="table-wrap">
        <table data-testid="kb-table">
          <thead>
            <tr>
              <th>Document</th><th>Publisher and language</th><th>Status</th><th>PA-01 rank</th><th>Extraction</th><th>Chunks</th><th>Retrieved</th><th>SHA-256</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => {
              const cs = chunksForDoc(d.id);
              const ocr = new Set(cs.filter((c) => c.extraction === "ocr").map((c) => c.page));
              return (
                <tr key={d.id} data-testid={`kb-row-${d.id}`}>
                  <td>
                    <a href={d.source_url}>{d.title}</a>
                    <div className="cite mono">{d.file}</div>
                    {d.source_note && <div className="cite">{d.source_note}</div>}
                  </td>
                  <td>{d.publisher}<div className="cite">{d.language}</div></td>
                  <td><span className={`tag${d.status === "secondary host" ? " analogy" : ""}`}>{d.status}</span></td>
                  <td>{d.rank_label}</td>
                  <td>
                    {d.extraction_method}
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
            {c && <Quote quote={d.self_description!.quote} chunkId={c.id} where={locator(c)} short={d.short} />}
            <ul className="cite">{d.reading_notes.map((n) => <li key={n}>{n}</li>)}</ul>
            {d.not_ingested_pages.map((p) => <div key={p.page} className="cite">Not ingested: page {p.page}. {p.reason}</div>)}
          </div>
        );
      })}

      <h2>Every source attempted</h2>
      <p className="lede">One ordinary request each, on 2026-11-03. Nothing was done to get past a block. A source that did not open is dropped, with every claim about its content.</p>
      <div className="table-wrap">
        <table data-testid="attempts">
          <thead><tr><th>Document</th><th>Result</th><th>Status</th><th>Note</th></tr></thead>
          <tbody>
            {sourceAttempts.map((a) => (
              <tr key={a.document}>
                <td><a href={a.url}>{a.document}</a></td>
                <td>{a.result}</td>
                <td><span className={`tag${a.status === "not retrieved" ? " gap" : a.status.startsWith("ingested") ? " ok" : ""}`}>{a.status}</span></td>
                <td>{a.note}</td>
              </tr>
            ))}
            <tr><td>Global examples</td><td>None retrieved</td><td><span className="tag gap">none</span></td><td>No foreign instrument opened, so the gap view shows &quot;no global example in KB&quot;. None is written from memory. The UAE documents mention some foreign practice in passing; those passages are not offered as global examples.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Where key terms occur</h2>
      <p className="lede">Pages holding each term, counted live from the stored chunks. Zero means these files do not use the word. It says nothing about UAE law outside them.</p>
      <div className="table-wrap">
        <table data-testid="term-counts">
          <thead><tr><th>Term</th><th>Telecom text</th><th>AI guidance</th><th>Framework</th></tr></thead>
          <tbody>{TERMS.map((t) => <tr key={t}><td>{t}</td><td>{countInKb(t, TELECOM)}</td><td>{countInKb(t, GUIDANCE)}</td><td>{countInKb(t, FRAMEWORK)}</td></tr>)}</tbody>
        </table>
      </div>

      <h2>Licence status of each file</h2>
      <div className="table-wrap">
        <table data-testid="licence-status">
          <thead><tr><th>Document</th><th>As stated in the file</th></tr></thead>
          <tbody>{documents.map((d) => <tr key={d.id}><td>{d.short}</td><td>{d.license_status}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="cite">No document here is covered by this project&apos;s MIT licence, and nothing here is endorsed by any UAE office, TDRA or ITU.</p>
    </>
  );
}
