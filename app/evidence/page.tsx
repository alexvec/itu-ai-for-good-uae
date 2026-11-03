import { Quote } from "../../components/Quote.tsx";
import { docById } from "../../lib/data.ts";
import { allConflicts, allOutcomes, dimensionFactor, dimensionName, locator, precedence, readiness, resolveCitation, y3172Nodes, type Citation } from "../../lib/engine.ts";
import { nonDataRows, pipelineRows, supportingRows, useCase } from "../../lib/evidence.ts";
import { NOT_ADDRESSED, type NodeId } from "../../lib/types.ts";

export const metadata = { title: "Report evidence | Y.3172 Incident Counsel" };

function Policy({ c, note }: { c: Citation | null; note?: string }) {
  if (!c) return <span className="not-addressed">{NOT_ADDRESSED}</span>;
  const d = docById.get(c.doc_id)!;
  return (
    <>
      <Quote quote={c.quote} chunkId={c.chunk_id} where={locator(c)} short={d.short} heading={c.section} caveat={d.caveat} />
      {d.analogy_note && <div><span className="tag analogy">by analogy</span><span className="cite">{d.analogy_note}</span></div>}
      {note && <div className="cite" data-testid="row-note">{note}</div>}
    </>
  );
}
const Dim = ({ id, why }: { id: number; why?: string }) => (
  <>
    <span className="tag dim">D{id}</span>{dimensionName(id)}
    <div className="cite">Report 2.0: &quot;{dimensionFactor(id)}&quot; {why}</div>
  </>
);
const Definition = ({ node }: { node: NodeId }) => {
  const c = resolveCitation(y3172Nodes[node]);
  return <Quote quote={c.quote} chunkId={c.chunk_id} where={c.where} short="ITU-T Y.3172" />;
};

export default function Page() {
  return (
    <>
      <h1>Report evidence</h1>
      <p className="lede">The table the template asks for, generated from the data files the app reads. One row per node, one Readiness dimension, one policy document. {useCase}</p>
      <div className="row"><a className="btn" href="/api/evidence.md" data-testid="evidence-md">Open full Markdown export</a></div>
      <div className="card cite" data-testid="evidence-limits">
        Telecom text leads where it speaks to a node. Rows keep an AI document only where no retrieved telecom text applies, and say so. The Telecom Law quotes are English text from a secondary host, and the document says the Arabic version prevails. Y.3172 and the Readiness Report 2.0 were retrieved and read; they are framework documents, not UAE policy. The node-to-dimension table is the reference repo&apos;s, because the report does not give one per node; dimension names and factor statements are from the report.
      </div>
      <h2>Y.3172 nodes</h2>
      <div className="table-wrap">
        <table data-testid="evidence-table">
          <thead><tr><th>Node and Y.3172 definition</th><th>Use case</th><th>Readiness dimension</th><th style={{ width: "42%" }}>Policy document</th></tr></thead>
          <tbody>
            {pipelineRows.map((r) => (
              <tr key={r.node} data-testid={`row-${r.node}`}>
                <td><span className="tag node">{r.node}</span><Definition node={r.node} /></td>
                <td>{r.use_case}</td>
                <td><Dim id={r.dimension_id} why={r.why_dimension} /></td>
                <td><Policy c={r.citation} note={r.no_telecom_text} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Supporting components</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Node and Y.3172 definition</th><th>Use case</th><th>Readiness dimension</th><th style={{ width: "42%" }}>Policy document</th></tr></thead>
          <tbody>
            {supportingRows.map((r) => (
              <tr key={r.node}>
                <td><span className="tag node">{r.node}</span><Definition node={r.node} /></td>
                <td>{r.use_case}</td>
                <td><Dim id={r.dimension_id} why={r.why_dimension} /></td>
                <td><Policy c={r.citation} note={r.no_telecom_text} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Readiness beyond data and models</h2>
      <div className="table-wrap">
        <table data-testid="non-data-table">
          <thead><tr><th>Item</th><th>Node</th><th>Readiness dimension</th><th style={{ width: "48%" }}>Policy document</th></tr></thead>
          <tbody>
            {nonDataRows.map((r) => (
              <tr key={r.item}>
                <td><strong>{r.item}</strong><div className="cite">{r.note}</div></td>
                <td><span className="tag node">{r.node}</span></td>
                <td><Dim id={r.dimension_id} /></td>
                <td><Policy c={r.citation} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Pre-agreed precedence: {precedence.id}</h2>
      <div className="card" data-testid="precedence">
        <p>{precedence.text}</p>
        <p className="cite">{precedence.status}</p>
        <ul className="cite">
          {allConflicts().map((c) => <li key={c.id}>{c.id}: {c.winner.document} ({c.winner.rank_label}) outranks {c.loser.document} ({c.loser.rank_label}). {c.honesty}</li>)}
        </ul>
      </div>
      <h2>Template outcomes, read from the text</h2>
      <div className="table-wrap">
        <table data-testid="outcomes-table">
          <thead><tr><th>Template example</th><th>Result</th><th>What the text supports</th><th>What it does not</th></tr></thead>
          <tbody>
            {allOutcomes().map((o) => (
              <tr key={o.id}><td>{o.template_outcome}</td><td>{o.status}</td><td>{o.supported} {o.citations.map((c) => <span key={c.rule_id} className="tag" title={c.where}>{c.rule_id}</span>)}</td><td>{o.unsupported}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cite">
        Factors in Report 2.0: {readiness.factors.map((f) => f.name).join(", ")}. {readiness.dimensions.length} dimensions.
      </p>
    </>
  );
}
