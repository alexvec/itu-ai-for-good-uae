import { Quote } from "../../components/Quote.tsx";
import { docById, NOT_INGESTED } from "../../lib/data.ts";
import { dimensionName, nodeMapping, type Citation } from "../../lib/engine.ts";
import { nonDataRows, pipelineRows, supportingRows, useCase } from "../../lib/evidence.ts";
import { NOT_ADDRESSED, type NodeId } from "../../lib/types.ts";

export const metadata = { title: "Report evidence | Y.3172 Incident Counsel" };

function Policy({ c }: { c: Citation | null }) {
  if (!c) return <span className="not-addressed">{NOT_ADDRESSED}</span>;
  const d = docById.get(c.doc_id)!;
  return (
    <>
      <Quote quote={c.quote} chunkId={c.chunk_id} page={c.page} short={d.short} heading={c.section} />
      {d.analogy_note && <div><span className="tag analogy">by analogy</span><span className="cite">{d.analogy_note}</span></div>}
    </>
  );
}
const Dim = ({ id, node, why }: { id: number; node: NodeId; why?: string }) => (
  <>
    <span className="tag dim">D{id}</span>{dimensionName(id)}
    <div className="cite">Factor: {nodeMapping.node_to_factors[node]}. {why}</div>
  </>
);

export default function Page() {
  return (
    <>
      <h1>Report evidence</h1>
      <p className="lede">The table the template asks for, generated from the data files the app reads. One row per node, one Readiness dimension, one policy document. {useCase}</p>
      <div className="row"><a className="btn" href="/api/evidence.md" data-testid="evidence-md">Open full Markdown export</a></div>
      <div className="card cite">
        The KB has no binding telecom sector law. The four documents are a strategy, a charter, ethics guidance and government-services guidance.
        {NOT_INGESTED.slice(0, 2).map((n) => <span key={n.name}> {n.name}: exists and was not ingested.</span>)}
      </div>
      <h2>Y.3172 nodes</h2>
      <div className="table-wrap">
        <table data-testid="evidence-table">
          <thead><tr><th>Node</th><th>Use case</th><th>Readiness dimension</th><th style={{ width: "48%" }}>Policy document</th></tr></thead>
          <tbody>
            {pipelineRows.map((r) => (
              <tr key={r.node} data-testid={`row-${r.node}`}>
                <td><span className="tag node">{r.node}</span></td>
                <td>{r.use_case}</td>
                <td><Dim id={r.dimension_id} node={r.node} why={r.why_dimension} /></td>
                <td><Policy c={r.citation} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Supporting components</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Node</th><th>Use case</th><th>Readiness dimension</th><th style={{ width: "48%" }}>Policy document</th></tr></thead>
          <tbody>
            {supportingRows.map((r) => (
              <tr key={r.node}>
                <td><span className="tag node">{r.node}</span></td>
                <td>{r.use_case}</td>
                <td><Dim id={r.dimension_id} node={r.node} why={r.why_dimension} /></td>
                <td><Policy c={r.citation} /></td>
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
                <td><Dim id={r.dimension_id} node={r.node} /></td>
                <td><Policy c={r.citation} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cite">
        Dimensions and the node mapping are framework taxonomy from <a href={nodeMapping.source}>CrashingGuru/ITUAIReadiness</a> ({nodeMapping.license}). They are structure, not KB content.
      </p>
    </>
  );
}
