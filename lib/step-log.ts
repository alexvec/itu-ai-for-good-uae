// Turns one agent step into audit lines. Shared by the API route and the tests.
import { makeLine } from "./audit.ts";
import type { StepResult } from "./engine.ts";

export function stepToLines(step: StepResult, ctx: { session: string; seq: number; prevHash: string; eventId: string | null; scenarioId: string | null }) {
  const stages: [string, unknown][] = [
    ["input", { event_id: ctx.eventId, scenario_id: ctx.scenarioId, text: step.input }],
    ["classify", { classes: step.classes, nodes: step.nodes, dimension_ids: step.dimension_ids }],
    ["rules_fired", { rule_ids: step.rule_findings.map((f) => f.rule_id), chunk_ids: step.rule_findings.map((f) => f.citation.chunk_id) }],
    ["retrieve", { queries: step.queries }],
    ["quote_check", { displayed: [...step.rule_findings.map((f) => ({ chunk_id: f.citation.chunk_id, quote: f.citation.quote })), ...step.retrieved.map((f) => ({ chunk_id: f.chunk_id, quote: f.quote }))], dropped: step.dropped_quotes }],
    ["gap_check", { controls: step.controls.map((c) => ({ id: c.id, addressed: c.addressed, status: c.status, found_terms: c.found_terms })) }],
  ];
  if (step.decision) stages.push(["decision", { conflicts: step.decision.conflicts.map((c) => ({ id: c.id, rule: c.rule_id, winner: c.winner.chunk_id, winner_rank: c.winner.rank_label, loser: c.loser.chunk_id, loser_rank: c.loser.rank_label })), actions: step.decision.actions.map((a) => ({ order: a.order, rule_id: a.rule_id, chunk_id: a.citation.chunk_id })), outcomes: step.decision.outcomes.map((o) => ({ id: o.id, status: o.status })) }]);
  if (step.model_step) stages.push(["model-generated", step.model_step]);
  stages.push(["output", { headline: step.headline, narrative: step.narrative, not_addressed: step.not_addressed }]);
  const lines: string[] = [];
  let prev = ctx.prevHash;
  let seq = ctx.seq;
  for (const [stage, payload] of stages) {
    const { line, hash } = makeLine(prev, ++seq, ctx.session, stage, payload);
    lines.push(line);
    prev = hash;
  }
  return { lines, head: prev, seq };
}
