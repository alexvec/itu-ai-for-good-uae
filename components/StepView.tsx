import type { StepResult, OutcomeResult, ControlResult, ConflictResult, DecisionAction } from "../lib/engine.ts";
import { NOT_ADDRESSED, PIPELINE } from "../lib/types.ts";
import { Quote } from "./Quote.tsx";

export function Pipeline({ on }: { on: string[] }) {
  return (
    <div className="pipeline" data-testid="pipeline" aria-label="ITU-T Y.3172 pipeline">
      {PIPELINE.map((n, i) => (
        <span key={n} style={{ display: "contents" }}>
          {i > 0 && <span className="arrow">→</span>}
          <span className={`step${on.includes(n) ? " on" : ""}`}>{n}</span>
        </span>
      ))}
      <span className="arrow">|</span>
      {["MLFO", "Sandbox"].map((n) => <span key={n} className={`step lane${on.includes(n) ? " on" : ""}`}>{n}</span>)}
    </div>
  );
}

export function ControlRow({ c }: { c: ControlResult }) {
  return (
    <div className="card" data-testid={c.addressed ? "control-addressed" : "control-gap"}>
      <div>
        <span className={`tag ${c.addressed ? "ok" : "gap"}`}>{c.id}</span>
        {c.nodes.map((n) => <span key={n} className="tag node">{n}</span>)}
        <span className="tag dim">D{c.dimension_id} {c.dimension}</span>
      </div>
      <p><strong>{c.question}</strong></p>
      {c.addressed ? <p className="pass">{c.status}</p> : (
        <p><span className="not-addressed" data-testid="not-addressed">{NOT_ADDRESSED}</span> · <em>{c.review_flag}</em> · {c.global_example}</p>
      )}
      <div className="cite">Searched: {c.searched.join("; ")}. Terms: {(c.addressed ? c.found_terms : c.terms).join(", ")}. Word search, not a legal reading.</div>
      {c.nearest && (
        <>
          <div className="cite">{c.addressed ? "Text found:" : "Nearest text found (it does not answer the question):"}</div>
          <Quote quote={c.nearest.quote} chunkId={c.nearest.chunk_id} where={c.nearest.where} short={c.nearest.document} ocr={c.nearest.ocr} caveat={c.nearest.caveat} />
          {c.nearest.analogy_note && <div><span className="tag analogy">by analogy</span><span className="cite">{c.nearest.analogy_note}</span></div>}
        </>
      )}
    </div>
  );
}

function Outcomes({ outcomes }: { outcomes: OutcomeResult[] }) {
  return (
    <>
      <h3>The template&apos;s example outcome, tested against the text</h3>
      <div className="table-wrap">
        <table data-testid="outcomes">
          <thead><tr><th>Template example</th><th>Result</th><th>What the text supports</th><th>What it does not</th></tr></thead>
          <tbody>
            {outcomes.map((o) => (
              <tr key={o.id}>
                <td>{o.template_outcome}</td>
                <td className={o.verdict === "not_addressed" ? "not-addressed" : ""}>{o.status}</td>
                <td>{o.supported || "Nothing stated."} {o.citations.map((c) => <span key={c.rule_id} className="tag" title={c.where}>{c.rule_id}</span>)}</td>
                <td><span className="not-addressed">{NOT_ADDRESSED}:</span> {o.unsupported} {o.nearest.map((c) => <span key={c.rule_id} className="tag">nearest {c.rule_id}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ConflictCard({ c }: { c: ConflictResult }) {
  return (
    <div className="card conflict" data-testid="conflict">
      <div><span className="tag">{c.id}</span><span className="tag rank">settled by {c.rule_id}</span></div>
      <p><strong>{c.title}.</strong> {c.tension}</p>
      <div className="side won">
        <span className="tag ok">outranks: {c.winner.rank_label}</span>
        <Quote quote={c.winner.quote} chunkId={c.winner.chunk_id} where={c.winner.where} short={c.winner.document} heading={c.winner.section} caveat={c.winner.caveat} />
      </div>
      <div className="side">
        <span className="tag">outranked: {c.loser.rank_label}</span>
        <Quote quote={c.loser.quote} chunkId={c.loser.chunk_id} where={c.loser.where} short={c.loser.document} heading={c.loser.section} caveat={c.loser.caveat} />
      </div>
      <p data-testid="conflict-outcome"><strong>Outcome.</strong> {c.outcome}</p>
      <p className="cite">{c.honesty}</p>
    </div>
  );
}

function ActionRow({ a }: { a: DecisionAction }) {
  return (
    <div data-testid="decision-action" style={{ marginBottom: ".7rem" }}>
      <div><strong>{a.order}. {a.action}</strong></div>
      <div>
        <span className="tag">{a.rule_id}</span>
        <span className="tag rank">{a.rank_label}</span>
        {a.nodes.map((n) => <span key={n} className="tag node">{n}</span>)}
        <span className="tag dim">{a.dimension}</span>
        {a.modal && <span className="tag">text says: {a.modal}</span>}
        {a.analogy_note && <span className="tag analogy">by analogy</span>}
      </div>
      <Quote quote={a.citation.quote} chunkId={a.citation.chunk_id} where={a.where} short={a.document} heading={a.citation.section} caveat={a.caveat} />
      {a.supporting.map((s) => <Quote key={s.quote} quote={s.quote} chunkId={s.chunk_id} where={s.where} short={s.document} caveat={s.caveat} />)}
      {a.analogy_note && <div className="cite">{a.analogy_note}</div>}
    </div>
  );
}

export function StepView({ step }: { step: StepResult }) {
  return (
    <div>
      <Pipeline on={step.nodes} />
      <p><strong data-testid="headline">{step.headline}</strong></p>
      <div>
        {step.classes.map((c) => <span key={c.id} className="tag" title={`matched: ${c.matched_terms.join(", ")}`}>{c.label}</span>)}
        {step.dimension_ids.map((d) => <span key={d} className="tag dim">D{d}</span>)}
      </div>

      {step.decision && (
        <div className="card decision" data-testid="decision">
          <h3 style={{ marginTop: 0 }}>Corrective action, from the pre-agreed rules</h3>
          <p className="cite">{step.decision.basis}</p>
          {step.decision.conflicts.length > 0 && (
            <>
              <h3>Sources that pull different ways</h3>
              {step.decision.conflicts.map((c) => <ConflictCard key={c.id} c={c} />)}
            </>
          )}
          <h3>From telecom law, regulation and regulator policy</h3>
          {step.decision.actions.filter((a) => a.rank <= 2).map((a) => <ActionRow key={a.rule_id} a={a} />)}
          {step.decision.actions.some((a) => a.rank > 2) && (
            <details>
              <summary>Supporting guidance and framework text ({step.decision.actions.filter((a) => a.rank > 2).length}). These recommend; they do not compel.</summary>
              {step.decision.actions.filter((a) => a.rank > 2).map((a) => <ActionRow key={a.rule_id} a={a} />)}
            </details>
          )}
          {step.decision.outcomes.length > 0 && <Outcomes outcomes={step.decision.outcomes} />}
        </div>
      )}

      {step.rule_findings.length > 0 && (
        <details open={!step.decision}>
          <summary>Pre-agreed rules fired ({step.rule_findings.length})</summary>
          {step.rule_findings.map((f) => (
            <div className="card" key={f.rule_id} data-testid="rule-finding">
              <div>
                <span className="tag">{f.rule_id}</span>
                {f.nodes.map((n) => <span key={n} className="tag node">{n}</span>)}
                <span className="tag dim">D{f.dimension_id} {f.dimension}</span>
                <span className="tag rank">{f.rank_label}</span>
                {f.modal && <span className="tag">text says: {f.modal}</span>}
                {f.supports && <span className="tag">supports {f.supports}</span>}
                {f.analogy_note && <span className="tag analogy">by analogy</span>}
              </div>
              <p><strong>{f.title}.</strong> {f.action}</p>
              <Quote quote={f.citation.quote} chunkId={f.citation.chunk_id} where={f.where} short={f.document} heading={f.citation.section} ocr={f.ocr} caveat={f.caveat} />
              {f.supporting.map((s) => <Quote key={s.quote} quote={s.quote} chunkId={s.chunk_id} where={s.where} short={s.document} caveat={s.caveat} />)}
              {f.analogy_note && <div className="cite">{f.analogy_note}</div>}
            </div>
          ))}
        </details>
      )}

      {step.controls.length > 0 && (
        <details open>
          <summary>Questions this event raises ({step.controls.filter((c) => !c.addressed).length} {NOT_ADDRESSED})</summary>
          {step.controls.map((c) => <ControlRow key={c.id} c={c} />)}
        </details>
      )}

      {step.retrieved.length > 0 && (
        <details>
          <summary>Other passages retrieved by BM25 ({step.retrieved.length})</summary>
          {step.retrieved.map((r) => (
            <div className="card" key={r.chunk_id} data-testid="retrieved">
              <div><span className="tag node">{r.node}</span><span className="tag">score {r.score}</span>{r.analogy_note && <span className="tag analogy">by analogy</span>}</div>
              <Quote quote={r.quote} chunkId={r.chunk_id} where={r.where} short={r.document} ocr={r.ocr} caveat={r.caveat} />
              <div className="cite">{r.why}</div>
              {r.analogy_note && <div className="cite">{r.analogy_note}</div>}
            </div>
          ))}
        </details>
      )}

      {step.model_step && (
        <div className="card">
          <span className="tag model">model-generated</span>
          {step.model_step.status === "used" && step.model_step.text && <p>{step.model_step.text}</p>}
          {step.model_step.status !== "used" && <p className="cite">Model output {step.model_step.status}: {step.model_step.reason}. The rule-built output above stands.</p>}
          {step.model_step.suggested_classes && <p className="cite">Suggested classes, not applied: {step.model_step.suggested_classes.join(", ")}.</p>}
        </div>
      )}

      <details>
        <summary>Reasoning trace for this event</summary>
        <pre className="raw">{JSON.stringify({ classes: step.classes, queries: step.queries, dropped_quotes: step.dropped_quotes, state_after: step.state }, null, 1)}</pre>
      </details>
    </div>
  );
}
