// The rule-driven agent. Input is only the event text and the running state; scenario author notes never reach it.
import rulesJson from "../data/rules.json" with { type: "json" };
import classesJson from "../data/event-classes.json" with { type: "json" };
import controlsJson from "../data/controls.json" with { type: "json" };
import outcomesJson from "../data/template-outcomes.json" with { type: "json" };
import conflictsJson from "../data/conflicts.json" with { type: "json" };
import precedenceJson from "../data/precedence.json" with { type: "json" };
import readinessJson from "../data/framework/readiness-report.json" with { type: "json" };
import y3172Json from "../data/framework/y3172-nodes.json" with { type: "json" };
import mappingJson from "../data/framework/node-mapping.json" with { type: "json" };
import dimensionsJson from "../data/framework/dimensions.json" with { type: "json" };
import { Bm25, bestSlice } from "./bm25.ts";
import { termMatches } from "./kb-build.ts";
import { chunkById, chunks, docById } from "./data.ts";
import { CANDIDATE, NO_GLOBAL_EXAMPLE, NOT_ADDRESSED, type NodeId } from "./types.ts";
import type { StrengthCheck } from "./strength.ts";

export interface Citation { chunk_id: string; doc_id: string; page: number; section: string; article?: string | null; quote: string }
export interface Rule {
  id: string; title: string; classes: string[]; priority: number; group: string; action: string;
  nodes: NodeId[]; dimension_id: number; modal: string | null; citation: Citation; analogy: boolean; analogy_note?: string;
  supports?: string; supporting?: Citation[]; strength_check: StrengthCheck;
}
export interface Conflict { id: string; title: string; classes: string[]; tension: string; a: Citation; b: Citation; outcome: string; honesty: string }
export interface EventClass { id: string; label: string; terms: string[]; nodes: NodeId[]; dimension_ids: number[]; query: string }
export interface Control { id: string; class: string; question: string; nodes: NodeId[]; dimension_id: number; terms: string[]; scope: string[]; query: string; nearest_pin?: { chunk_id: string; quote: string } }
export interface TemplateOutcome { id: string; template_outcome: string; verdict: "supported" | "partly" | "not_addressed"; supported: string; unsupported: string; rule_ids: string[]; nearest_rule_ids?: string[] }
export interface Dimension { id: number; name: string; heading_chunk: string; page: number; factor: { chunk_id: string; page: number; quote: string } }

export const rules = rulesJson as unknown as Rule[];
export const eventClasses = classesJson as unknown as EventClass[];
export const controls = controlsJson as unknown as Control[];
export const templateOutcomes = outcomesJson as unknown as TemplateOutcome[];
export const nodeMapping = mappingJson as unknown as { source: string; license: string; note: string; node_to_dimensions: Record<NodeId, number[]>; node_to_factors: Record<NodeId, string>; nodes: Record<NodeId, string> };
export const conflicts = conflictsJson as unknown as Conflict[];
export const precedence = precedenceJson as unknown as { id: string; title: string; text: string; status: string; ranks: Record<string, string> };
export const readiness = readinessJson as unknown as { note: string; factors: { name: string; chunk_id: string; page: number; quote: string }[]; dimensions: Dimension[] };
export const y3172Nodes = (y3172Json as unknown as { nodes: Record<NodeId, Citation> }).nodes;
export const dimensions = readiness.dimensions;
export const dimensionName = (id: number) => dimensions.find((d) => d.id === id)?.name ?? `dimension ${id}`;
export const dimensionFactor = (id: number) => dimensions.find((d) => d.id === id)?.factor.quote.replace(/\s+/g, " ") ?? "";
export const repoDimensionCount = (dimensionsJson as unknown as { dimensions: unknown[] }).dimensions.length;

/** Where a citation sits, in the document's own terms. */
export function locator(c: { doc_id: string; page: number; article?: string | null }): string {
  const d = docById.get(c.doc_id)!;
  const where = `${d.page_label} ${c.page}`;
  if (!c.article) return where;
  return d.chunker === "articles" ? `${c.article}, ${where}` : `${d.chunker === "clauses" ? "sub-article " : ""}${c.article}, ${where}`;
}
export const caveatFor = (docId: string) => docById.get(docId)!.caveat;

export interface ResolvedCitation extends Citation { document: string; where: string; caveat: string | null; rank: number; rank_label: string; status: string }
export function resolveCitation(c: Citation): ResolvedCitation {
  const d = docById.get(c.doc_id)!;
  const chunk = chunkById.get(c.chunk_id);
  if (!chunk || !chunk.text.includes(c.quote)) throw new Error(`citation: quote is not in chunk ${c.chunk_id}`);
  return { ...c, document: d.short, where: locator(c), caveat: d.caveat, rank: d.rank, rank_label: d.rank_label, status: d.status };
}

/** PA-01. The lower rank number wins. Equal rank is not resolved here and goes to a person. */
export function applyPrecedence(a: Citation, b: Citation): { winner: Citation; loser: Citation } | null {
  const ra = docById.get(a.doc_id)!.rank;
  const rb = docById.get(b.doc_id)!.rank;
  if (ra === rb) return null;
  return ra < rb ? { winner: a, loser: b } : { winner: b, loser: a };
}

const index = new Bm25(chunks);
export const MIN_SCORE = 6;
export const MIN_TERMS = 2;

export interface RuleFinding { kind: "rule"; rule_id: string; title: string; action: string; modal: string | null; nodes: NodeId[]; dimension_id: number; dimension: string; factor: string; analogy_note: string | null; document: string; where: string; caveat: string | null; rank: number; rank_label: string; supports: string | null; citation: Citation; supporting: ResolvedCitation[]; ocr: boolean; strength: StrengthCheck }
export interface RetrievedFinding { kind: "retrieved"; class_id: string; node: NodeId; score: number; matched_terms: string[]; document: string; where: string; caveat: string | null; chunk_id: string; page: number; quote: string; why: string; analogy_note: string | null; ocr: boolean }
export interface ControlResult { id: string; question: string; nodes: NodeId[]; dimension_id: number; dimension: string; addressed: boolean; status: string; found_terms: string[]; terms: string[]; searched: string[]; nearest: { chunk_id: string; page: number; document: string; where: string; caveat: string | null; quote: string; analogy_note: string | null; ocr: boolean } | null; review_flag: string | null; global_example: string | null }
export interface OutcomeResult extends TemplateOutcome { citations: { rule_id: string; document: string; where: string; citation: Citation; analogy: boolean }[]; nearest: { rule_id: string; document: string; where: string; citation: Citation; analogy: boolean }[]; status: string }
export interface ConflictResult { id: string; title: string; tension: string; honesty: string; outcome: string; rule_id: string; winner: ResolvedCitation; loser: ResolvedCitation }
export interface DecisionAction { order: number; rule_id: string; action: string; modal: string | null; document: string; where: string; caveat: string | null; rank: number; rank_label: string; citation: Citation; supporting: ResolvedCitation[]; analogy_note: string | null; dimension: string; nodes: NodeId[] }
export interface Decision { conflicts: ConflictResult[]; actions: DecisionAction[]; outcomes: OutcomeResult[]; basis: string }

export interface RunState { fired_rules: string[]; pending_rules: string[]; pending_conflicts: string[]; classes_seen: string[]; events_seen: number }
export const emptyState = (): RunState => ({ fired_rules: [], pending_rules: [], pending_conflicts: [], classes_seen: [], events_seen: 0 });

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
const scopeNames = (ids: string[]) => ids.map((id) => docById.get(id)!.short);

/** A control is addressed only if one of its terms actually occurs in a retrievable chunk of the documents it searches. Computed, never asserted. */
export function evaluateControl(ctl: Control): ControlResult {
  const inScope = kbText.filter((k) => ctl.scope.includes(k.c.doc_id));
  const found = ctl.terms.filter((t) => inScope.some((k) => termMatches(k.lower, t)));
  let hit: ControlResult["nearest"] = null;
  const describe = (chunkId: string, quote: string) => {
    const chunk = chunkById.get(chunkId)!;
    const d = docById.get(chunk.doc_id)!;
    return { chunk_id: chunk.id, page: chunk.page, document: d.short, where: locator({ doc_id: chunk.doc_id, page: chunk.page, article: chunk.article }), caveat: d.caveat, quote, analogy_note: d.analogy_note, ocr: chunk.extraction === "ocr" };
  };
  const pin = ctl.nearest_pin;
  if (pin && chunkById.get(pin.chunk_id)?.text.includes(pin.quote)) {
    hit = describe(pin.chunk_id, pin.quote);
  } else {
    for (const h of index.search(ctl.query, { limit: 5 })) {
      const quote = bestSlice(h.chunk.text, ctl.query);
      if (quote && h.chunk.text.includes(quote)) {
        hit = describe(h.chunk.id, quote);
        break;
      }
    }
  }
  const addressed = found.length > 0;
  return {
    id: ctl.id, question: ctl.question, nodes: ctl.nodes, dimension_id: ctl.dimension_id, dimension: dimensionName(ctl.dimension_id),
    addressed, status: addressed ? "addressed in the ingested documents" : NOT_ADDRESSED, found_terms: found, terms: ctl.terms, searched: scopeNames(ctl.scope), nearest: hit,
    review_flag: addressed ? null : CANDIDATE, global_example: addressed ? null : NO_GLOBAL_EXAMPLE,
  };
}

function toFinding(r: Rule): RuleFinding {
  const doc = docById.get(r.citation.doc_id)!;
  const chunk = chunkById.get(r.citation.chunk_id);
  if (!chunk || !chunk.text.includes(r.citation.quote)) throw new Error(`rule ${r.id}: quote is not in chunk ${r.citation.chunk_id}`);
  return {
    kind: "rule", rule_id: r.id, title: r.title, action: r.action, modal: r.modal, nodes: r.nodes, dimension_id: r.dimension_id,
    dimension: dimensionName(r.dimension_id), factor: dimensionFactor(r.dimension_id), analogy_note: r.analogy ? (r.analogy_note ?? doc.analogy_note) : null,
    document: doc.short, where: locator(r.citation), caveat: doc.caveat, rank: doc.rank, rank_label: doc.rank_label, supports: r.supports ?? null,
    citation: r.citation, supporting: (r.supporting ?? []).map(resolveCitation), ocr: chunk.extraction === "ocr", strength: r.strength_check,
  };
}

function buildOutcome(o: TemplateOutcome): OutcomeResult {
  const cite = (id: string) => {
    const r = rules.find((x) => x.id === id)!;
    return { rule_id: id, document: docById.get(r.citation.doc_id)!.short, where: locator(r.citation), citation: r.citation, analogy: r.analogy };
  };
  const status = o.verdict === "not_addressed" ? NOT_ADDRESSED : o.verdict === "supported" ? "supported by the ingested documents" : "partly supported by the ingested documents";
  return { ...o, citations: o.rule_ids.map(cite), nearest: (o.nearest_rule_ids ?? []).map(cite), status };
}

export function allOutcomes(): OutcomeResult[] {
  return templateOutcomes.map(buildOutcome);
}

function resolveConflict(c: Conflict): ConflictResult {
  const r = applyPrecedence(c.a, c.b);
  if (!r) throw new Error(`conflict ${c.id}: equal rank, not resolved by PA-01`);
  return { id: c.id, title: c.title, tension: c.tension, honesty: c.honesty, outcome: c.outcome, rule_id: precedence.id, winner: resolveCitation(r.winner), loser: resolveCitation(r.loser) };
}
export const allConflicts = () => conflicts.map(resolveConflict);

function runDecision(pending: string[], pendingConflicts: string[]): Decision {
  const actions: DecisionAction[] = pending
    .map((id) => rules.find((r) => r.id === id)!)
    .sort((a, b) => a.priority - b.priority)
    .map((r, i) => {
      const f = toFinding(r);
      return { order: i + 1, rule_id: r.id, action: r.action, modal: r.modal, document: f.document, where: f.where, caveat: f.caveat, rank: f.rank, rank_label: f.rank_label, citation: r.citation, supporting: f.supporting, analogy_note: f.analogy_note, dimension: f.dimension, nodes: r.nodes };
    });
  // The template's outcome table belongs to the privacy escalation, so it appears only when a privacy rule is being decided.
  const privacy = pending.some((id) => rules.find((r) => r.id === id)!.group === "privacy");
  return {
    conflicts: pendingConflicts.map((id) => resolveConflict(conflicts.find((c) => c.id === id)!)),
    actions,
    outcomes: privacy ? allOutcomes() : [],
    basis: "Each action comes from a pre-agreed rule in data/rules.json, drafted in this build and not reviewed by a lawyer. Each cites a verbatim quote, and the action is no stronger than the quote. Where the text says shall or must it comes from telecom law or regulation; AI guidance is shown as supporting and recommends only.",
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
  const priorConflicts = prior.pending_conflicts ?? [];
  let pendingConflicts = [...priorConflicts, ...conflicts.filter((c) => c.classes.some((k) => ids.has(k)) && !priorConflicts.includes(c.id)).map((c) => c.id)];

  let decision: Decision | null = null;
  if (ids.has("decision_request")) {
    decision = runDecision(pending, pendingConflicts);
    pending = [];
    pendingConflicts = [];
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
          kind: "retrieved", class_id: c.id, node, score: h.score, matched_terms: h.matched, document: d.short, where: locator({ doc_id: h.chunk.doc_id, page: h.chunk.page, article: h.chunk.article }), caveat: d.caveat, chunk_id: h.chunk.id, page: h.chunk.page, quote,
          why: `Retrieved for "${c.label}" at node ${node}. Query terms matched: ${h.matched.join(", ")}. Keyword relevance only; a person should judge whether it applies.`,
          analogy_note: d.analogy_note, ocr: h.chunk.extraction === "ocr",
        });
      }
    }
  }
  // A telecom text leads a guidance document where both are retrieved.
  const rankOf = (id: string) => docById.get(chunkById.get(id)!.doc_id)!.rank;
  retrieved.sort((a, b) => rankOf(a.chunk_id) - rankOf(b.chunk_id) || b.score - a.score);
  retrieved.splice(4);

  const ctlResults = controls.filter((c) => ids.has(c.class)).map(evaluateControl);
  const gaps = ctlResults.filter((c) => !c.addressed);
  const not_addressed = rule_findings.length === 0 && !decision && retrieved.length === 0;

  let headline: string;
  if (!classes.length) headline = `No event class matched this text, so no rule fired. Treat it as ${NOT_ADDRESSED} until a person reviews it.`;
  else if (decision) headline = decision.actions.length ? `Corrective action decided by ${decision.actions.length} pre-agreed rule${decision.actions.length === 1 ? "" : "s"}${decision.conflicts.length ? `, and ${decision.conflicts.length} conflict${decision.conflicts.length === 1 ? "" : "s"} settled by ${precedence.id}` : ""}.` : "No pre-agreed rule is pending, so there is nothing new to decide.";
  else if (not_addressed) headline = `This event is ${NOT_ADDRESSED}.`;
  else headline = `${rule_findings.length} pre-agreed rule${rule_findings.length === 1 ? "" : "s"} fired. ${gaps.length ? `${gaps.length} question${gaps.length === 1 ? " is" : "s are"} ${NOT_ADDRESSED}.` : ""}`.trim();

  const narrative = !classes.length
    ? headline
    : `Classified as ${classes.map((c) => c.label).join("; ")}. Pipeline nodes touched: ${nodes.join(", ") || "none"}. ${headline}`;

  const seen = [...new Set([...prior.classes_seen, ...ids])];
  return {
    input: text, classes, nodes, dimension_ids, rule_findings, retrieved, controls: ctlResults, decision, headline, narrative, not_addressed,
    queries, dropped_quotes,
    state: { fired_rules: fired, pending_rules: pending, pending_conflicts: pendingConflicts, classes_seen: seen, events_seen: prior.events_seen + 1 },
  };
}

export function allControlResults(): ControlResult[] {
  return controls.map(evaluateControl);
}
