// The rule-driven agent. Input is only the event text and the running state; scenario author notes never reach it.
import rulesJson from "../data/rules.json" with { type: "json" };
import classesJson from "../data/event-classes.json" with { type: "json" };
import controlsJson from "../data/controls.json" with { type: "json" };
import outcomesJson from "../data/template-outcomes.json" with { type: "json" };
import mappingJson from "../data/framework/node-mapping.json" with { type: "json" };
import dimensionsJson from "../data/framework/dimensions.json" with { type: "json" };
import { Bm25, bestSlice } from "./bm25.ts";
import { termMatches } from "./kb-build.ts";
import { chunkById, chunks, docById } from "./data.ts";
import { CANDIDATE, NO_GLOBAL_EXAMPLE, NOT_ADDRESSED, type NodeId } from "./types.ts";

export interface Citation { chunk_id: string; doc_id: string; page: number; section: string; quote: string }
export interface Rule {
  id: string; title: string; classes: string[]; priority: number; group: string; action: string;
  nodes: NodeId[]; dimension_id: number; modal: string | null; citation: Citation; analogy: boolean; analogy_note?: string;
}
export interface EventClass { id: string; label: string; terms: string[]; nodes: NodeId[]; dimension_ids: number[]; query: string }
export interface Control { id: string; class: string; question: string; nodes: NodeId[]; dimension_id: number; terms: string[]; query: string; nearest_pin?: { chunk_id: string; quote: string } }
export interface TemplateOutcome { id: string; template_outcome: string; verdict: "partly" | "not_addressed"; supported: string; unsupported: string; rule_ids: string[]; nearest_rule_ids?: string[] }
export interface Dimension { id: number; name: string; description: string }

export const rules = rulesJson as unknown as Rule[];
export const eventClasses = classesJson as unknown as EventClass[];
export const controls = controlsJson as unknown as Control[];
export const templateOutcomes = outcomesJson as unknown as TemplateOutcome[];
export const nodeMapping = mappingJson as unknown as { source: string; license: string; note: string; node_to_dimensions: Record<NodeId, number[]>; node_to_factors: Record<NodeId, string>; nodes: Record<NodeId, string> };
export const dimensions = (dimensionsJson as unknown as { dimensions: Dimension[] }).dimensions;
export const dimensionName = (id: number) => dimensions.find((d) => d.id === id)?.name ?? `dimension ${id}`;

const index = new Bm25(chunks);
export const MIN_SCORE = 6;
export const MIN_TERMS = 2;

export interface RuleFinding { kind: "rule"; rule_id: string; title: string; action: string; modal: string | null; nodes: NodeId[]; dimension_id: number; dimension: string; factor: string; analogy_note: string | null; document: string; citation: Citation; ocr: boolean }
export interface RetrievedFinding { kind: "retrieved"; class_id: string; node: NodeId; score: number; matched_terms: string[]; document: string; chunk_id: string; page: number; quote: string; why: string; analogy_note: string | null; ocr: boolean }
export interface ControlResult { id: string; question: string; nodes: NodeId[]; dimension_id: number; dimension: string; addressed: boolean; status: string; found_terms: string[]; nearest: { chunk_id: string; page: number; document: string; quote: string; analogy_note: string | null; ocr: boolean } | null; review_flag: string | null; global_example: string | null }
export interface OutcomeResult extends TemplateOutcome { citations: { rule_id: string; document: string; citation: Citation; analogy: boolean }[]; nearest: { rule_id: string; document: string; citation: Citation; analogy: boolean }[]; status: string }
export interface Decision { actions: { order: number; rule_id: string; action: string; modal: string | null; document: string; citation: Citation; analogy_note: string | null; dimension: string; nodes: NodeId[] }[]; outcomes: OutcomeResult[]; basis: string }

export interface RunState { fired_rules: string[]; pending_rules: string[]; classes_seen: string[]; events_seen: number }
export const emptyState = (): RunState => ({ fired_rules: [], pending_rules: [], classes_seen: [], events_seen: 0 });

export interface QueryLog { class_id: string; node: NodeId; query: string; results: { chunk_id: string; score: number; matched: string[] }[] }
export interface StepResult {
  input: string;
  classes: { id: string; label: string; matched_terms: string[] }[];
  nodes: NodeId[];
  dimension_ids: number[];
  rule_findings: RuleFinding[];
  retrieved: RetrievedFinding[];
  controls: ControlResult[];
  decision: Decision | null;
  headline: string;
  narrative: string;
  not_addressed: boolean;
  queries: QueryLog[];
  dropped_quotes: { chunk_id: string; quote: string; reason: string }[];
  state: RunState;
  model_step?: { status: "used" | "discarded" | "failed"; text?: string; reason?: string; suggested_classes?: string[] };
}

export const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ");

export function classify(text: string) {
  const lower = normalize(text);
  return eventClasses.flatMap((c) => {
    const matched = c.terms.filter((t) => termMatches(lower, t));
    return matched.length ? [{ id: c.id, label: c.label, matched_terms: matched }] : [];
  });
}

const kbText = chunks.filter((c) => c.retrievable).map((c) => ({ c, lower: normalize(c.text) }));

/** A control is addressed only if one of its terms actually occurs in a retrievable chunk. Computed, never asserted. */
export function evaluateControl(ctl: Control): ControlResult {
  const found = ctl.terms.filter((t) => kbText.some((k) => termMatches(k.lower, t)));
  let hit: { chunk_id: string; page: number; document: string; quote: string; analogy_note: string | null; ocr: boolean } | null = null;
  const describe = (chunkId: string, quote: string) => {
    const chunk = chunkById.get(chunkId)!;
    const d = docById.get(chunk.doc_id)!;
    return { chunk_id: chunk.id, page: chunk.page, document: d.short, quote, analogy_note: d.analogy_note, ocr: chunk.extraction === "ocr" };
  };
  const pin = ctl.nearest_pin;
  if (pin && chunkById.get(pin.chunk_id)?.text.includes(pin.quote)) {
    hit = describe(pin.chunk_id, pin.quote);
  } else {
    const holder = found.length ? kbText.find((k) => found.some((t) => termMatches(k.lower, t))) : null;
    const candidates = holder ? [{ chunk: holder.c }] : index.search(ctl.query, { limit: 5 });
    const query = holder ? found.join(" ") + " " + ctl.query : ctl.query;
    for (const h of candidates) {
      const quote = bestSlice(h.chunk.text, query);
      if (quote && h.chunk.text.includes(quote)) {
        hit = describe(h.chunk.id, quote);
        break;
      }
    }
  }
  const addressed = found.length > 0;
  return {
    id: ctl.id, question: ctl.question, nodes: ctl.nodes, dimension_id: ctl.dimension_id, dimension: dimensionName(ctl.dimension_id),
    addressed, status: addressed ? "addressed in the ingested documents" : NOT_ADDRESSED, found_terms: found, nearest: hit,
    review_flag: addressed ? null : CANDIDATE, global_example: addressed ? null : NO_GLOBAL_EXAMPLE,
  };
}

function toFinding(r: Rule): RuleFinding {
  const doc = docById.get(r.citation.doc_id)!;
  const chunk = chunkById.get(r.citation.chunk_id);
  if (!chunk || !chunk.text.includes(r.citation.quote)) throw new Error(`rule ${r.id}: quote is not in chunk ${r.citation.chunk_id}`);
  return {
    kind: "rule", rule_id: r.id, title: r.title, action: r.action, modal: r.modal, nodes: r.nodes, dimension_id: r.dimension_id,
    dimension: dimensionName(r.dimension_id), factor: nodeMapping.node_to_factors[r.nodes[0]], analogy_note: r.analogy ? (r.analogy_note ?? doc.analogy_note) : null,
    document: doc.short, citation: r.citation, ocr: chunk.extraction === "ocr",
  };
}

function buildOutcome(o: TemplateOutcome): OutcomeResult {
  const cite = (id: string) => {
    const r = rules.find((x) => x.id === id)!;
    return { rule_id: id, document: docById.get(r.citation.doc_id)!.short, citation: r.citation, analogy: r.analogy };
  };
  return { ...o, citations: o.rule_ids.map(cite), nearest: (o.nearest_rule_ids ?? []).map(cite), status: o.verdict === "not_addressed" ? NOT_ADDRESSED : "partly supported by the ingested documents" };
}

export function allOutcomes(): OutcomeResult[] {
  return templateOutcomes.map(buildOutcome);
}

function runDecision(pending: string[]): Decision {
  const actions = pending
    .map((id) => rules.find((r) => r.id === id)!)
    .sort((a, b) => a.priority - b.priority)
    .map((r, i) => {
      const f = toFinding(r);
      return { order: i + 1, rule_id: r.id, action: r.action, modal: r.modal, document: f.document, citation: r.citation, analogy_note: f.analogy_note, dimension: f.dimension, nodes: r.nodes };
    });
  const pendingSet = new Set(pending);
  const privacy = templateOutcomes.some((o) => o.rule_ids.some((id) => pendingSet.has(id)));
  return {
    actions,
    outcomes: privacy ? allOutcomes() : [],
    basis: "Each action comes from a pre-agreed rule in data/rules.json, drafted in this build and not reviewed by a lawyer. Each rule cites a verbatim quote. The ingested text is guidance, so it recommends; it does not compel.",
  };
}

export function runStep(text: string, prior: RunState = emptyState()): StepResult {
  const classes = classify(text);
  const ids = new Set(classes.map((c) => c.id));
  const defs = eventClasses.filter((c) => ids.has(c.id));
  const nodes = [...new Set(defs.flatMap((c) => c.nodes))];
  const dimension_ids = [...new Set(defs.flatMap((c) => c.dimension_ids))].sort((a, b) => a - b);

  const newly = rules.filter((r) => r.classes.some((c) => ids.has(c)) && !prior.fired_rules.includes(r.id));
  const rule_findings = newly.map(toFinding);
  const fired = [...prior.fired_rules, ...newly.map((r) => r.id)];
  let pending = [...prior.pending_rules, ...newly.map((r) => r.id)];

  let decision: Decision | null = null;
  if (ids.has("decision_request")) {
    decision = runDecision(pending);
    pending = [];
  }

  // Retrieval is keyed by node: each class queries once per node it touches, filtered to chunks tagged with that node.
  const queries: QueryLog[] = [];
  const dropped_quotes: StepResult["dropped_quotes"] = [];
  const retrieved: RetrievedFinding[] = [];
  const cited = new Set([...newly.map((r) => r.citation.chunk_id), ...(decision?.actions.map((a) => a.citation.chunk_id) ?? [])]);
  for (const c of defs) {
    if (!c.query) continue;
    for (const node of c.nodes) {
      const hits = index.search(c.query, { limit: 2, node });
      queries.push({ class_id: c.id, node, query: c.query, results: hits.map((h) => ({ chunk_id: h.chunk.id, score: h.score, matched: h.matched })) });
      for (const h of hits) {
        if (h.score < MIN_SCORE || h.matched.length < MIN_TERMS || cited.has(h.chunk.id) || retrieved.some((x) => x.chunk_id === h.chunk.id)) continue;
        const quote = bestSlice(h.chunk.text, c.query);
        if (!quote) {
          dropped_quotes.push({ chunk_id: h.chunk.id, quote: "", reason: "no usable sentence in chunk" });
          continue;
        }
        if (!h.chunk.text.includes(quote)) {
          dropped_quotes.push({ chunk_id: h.chunk.id, quote, reason: "quote is not a substring of its chunk" });
          continue;
        }
        const d = docById.get(h.chunk.doc_id)!;
        retrieved.push({
          kind: "retrieved", class_id: c.id, node, score: h.score, matched_terms: h.matched, document: d.short, chunk_id: h.chunk.id, page: h.chunk.page, quote,
          why: `Retrieved for "${c.label}" at node ${node}. Query terms matched: ${h.matched.join(", ")}. Keyword relevance only; a person should judge whether it applies.`,
          analogy_note: d.analogy_note, ocr: h.chunk.extraction === "ocr",
        });
      }
    }
  }
  retrieved.sort((a, b) => b.score - a.score);
  retrieved.splice(4);

  const ctlResults = controls.filter((c) => ids.has(c.class)).map(evaluateControl);
  const gaps = ctlResults.filter((c) => !c.addressed);
  const not_addressed = rule_findings.length === 0 && !decision && retrieved.length === 0;

  let headline: string;
  if (!classes.length) headline = `No event class matched this text, so no rule fired. Treat it as ${NOT_ADDRESSED} until a person reviews it.`;
  else if (decision) headline = decision.actions.length ? `Corrective action decided by ${decision.actions.length} pre-agreed rule${decision.actions.length === 1 ? "" : "s"}.` : "No pre-agreed rule is pending, so there is nothing new to decide.";
  else if (not_addressed) headline = `This event is ${NOT_ADDRESSED}.`;
  else headline = `${rule_findings.length} pre-agreed rule${rule_findings.length === 1 ? "" : "s"} fired. ${gaps.length ? `${gaps.length} question${gaps.length === 1 ? " is" : "s are"} ${NOT_ADDRESSED}.` : ""}`.trim();

  const narrative = !classes.length
    ? headline
    : `Classified as ${classes.map((c) => c.label).join("; ")}. Pipeline nodes touched: ${nodes.join(", ") || "none"}. ${headline}`;

  const seen = [...new Set([...prior.classes_seen, ...ids])];
  return {
    input: text, classes, nodes, dimension_ids, rule_findings, retrieved, controls: ctlResults, decision, headline, narrative, not_addressed,
    queries, dropped_quotes,
    state: { fired_rules: fired, pending_rules: pending, classes_seen: seen, events_seen: prior.events_seen + 1 },
  };
}

export function allControlResults(): ControlResult[] {
  return controls.map(evaluateControl);
}
