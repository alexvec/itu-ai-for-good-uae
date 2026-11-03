import { describe, expect, it } from "vitest";
import { chunkById, docById } from "../lib/data.ts";
import { allConflicts, applyPrecedence, conflicts, controls, dimensions, nodeMapping, precedence, readiness, resolveCitation, rules, templateOutcomes, eventClasses, y3172Nodes } from "../lib/engine.ts";
import { strengthProblem, stubProblem } from "../lib/strength.ts";
import labelChecks from "../data/label-checks.json" with { type: "json" };
import { conflicts as conflictList } from "../lib/engine.ts";
import { nonDataRows, pipelineRows, supportingRows } from "../lib/evidence.ts";

const norm = (s: string) => s.replace(/\s+/g, " ");
// Quotes may be combined only if each is shown, so a rule's force is read from all the quotes it displays.
const shownWith = (r: (typeof rules)[number]) => [r.citation.quote, ...(r.supporting ?? []).map((c) => c.quote)].join(" ");

describe("pre-agreed rules", () => {
  it("every rule's quote resolves to a real chunk, verbatim", () => {
    expect(rules.length).toBeGreaterThan(0);
    for (const r of rules) {
      const c = chunkById.get(r.citation.chunk_id);
      expect(c, r.id).toBeDefined();
      expect(c!.text.includes(r.citation.quote), r.id).toBe(true);
      expect(c!.doc_id).toBe(r.citation.doc_id);
      expect(c!.page).toBe(r.citation.page);
    }
  });

  it("no rule rests on OCR-derived text", () => {
    for (const r of rules) expect(chunkById.get(r.citation.chunk_id)!.extraction, r.id).not.toBe("ocr");
  });

  it("the strength stated for a rule is the word the quote uses", () => {
    for (const r of rules) if (r.modal) expect(norm(shownWith(r)).toLowerCase(), r.id).toContain(r.modal);
  });

  it("every rule's action keeps its source's modal force", () => {
    for (const r of rules) {
      expect(r.strength_check, r.id).toBeDefined();
      expect(strengthProblem(r.action, shownWith(r), r.strength_check), r.id).toBeNull();
    }
  });

  it("no rule's main quote is a stub: each carries the duty its action states", () => {
    for (const r of rules) expect(stubProblem(r.action, r.citation.quote), r.id).toBeNull();
    for (const c of conflicts) for (const q of [c.a.quote, c.b.quote]) expect(/:\s*$/.test(q), c.id).toBe(false);
  });

  it("the stub check catches the stems it was written for", () => {
    const act = "Shall acknowledge each complaint with a reference number and an indicative time-frame.";
    expect(stubProblem(act, "Licensees shall:")).toMatch(/colon/);
    expect(stubProblem("Check the plan terms for restrictions on speed.", "Specifically, Licensees shall advise the Consumer of the following (where applicable):")).toMatch(/colon/);
    expect(stubProblem("Check the retained consent records for 5 years.", "Shall be retained for at least 5 \nyears")).toMatch(/modal/);
    expect(stubProblem(act, "It applies.")).toMatch(/fewer than 6/);
    expect(stubProblem(act, "Licensees shall pay the regular invoices promptly every month")).toMatch(/content words/);
    expect(stubProblem(act, "acknowledge the receipt of each Consumer Complaint by providing the complainant with a reference number")).toBeNull();
  });

  it("every Ethics section label is one confirmed on the rendered page", () => {
    const seen = new Set(labelChecks.rendered.filter((p) => p.doc === "ethics").flatMap((p) => Object.values(p.labels).map((l) => l.split(/[;,]/)[0].trim())));
    const cites = [...rules.flatMap((r) => [r.citation, ...(r.supporting ?? [])]), ...conflictList.flatMap((c) => [c.a, c.b]), ...[...pipelineRows, ...supportingRows, ...nonDataRows].flatMap((r) => (r.citation ? [r.citation] : []))];
    for (const c of cites) if (c.doc_id === "ethics") expect(seen.has(c.section.split(/[;,]/)[0].trim()), `${c.chunk_id} ${c.section}`).toBe(true);
    expect(rules.find((r) => r.id === "PR-32")!.citation.section).toBe("3.2.2.3(a)");
    expect(conflictList.find((c) => c.id === "C-02")!.a.section).toBe("3.2.2.3(a)");
  });

  it("the modal-force check catches overreach", () => {
    const sc = (text_modal: string, action_verb: string) => ({ text_modal, action_verb, result: "pass" as const });
    expect(strengthProblem("Must avoid it.", "any entity should avoid it", sc("should", "Must"))).toMatch(/stronger/);
    expect(strengthProblem("Shall do it.", "it could consider this", sc("could consider", "Shall"))).toMatch(/stronger/);
    expect(strengthProblem("Check it, then stop the system.", "it should be reviewed", sc("should", "Check"))).toMatch(/stop/);
    expect(strengthProblem("Check it. It must be done.", "it may be reviewed", sc("may be", "Check"))).toMatch(/must or shall/);
    expect(strengthProblem("Check it before any further use.", "Algorithmic systems require assessments", sc("require", "Check"))).toMatch(/further use/);
    expect(strengthProblem("Must do it.", "Licensees must do it", sc("must", "Must"))).toBeNull();
  });

  it("quotes begin at a word boundary and have no lost-ligature character at their edges", () => {
    for (const r of rules) {
      for (const c of [r.citation, ...(r.supporting ?? [])]) {
        const text = chunkById.get(c.chunk_id)!.text;
        const at = text.indexOf(c.quote);
        expect(/[A-Za-z0-9]/.test(text[at - 1] ?? " ") && /^[A-Za-z0-9]/.test(c.quote), `${r.id} start`).toBe(false);
        const after = text[at + c.quote.length] ?? " ";
        expect(/[A-Za-z0-9]/.test(after) && /[A-Za-z0-9]$/.test(c.quote), `${r.id} end`).toBe(false);
        expect(c.quote.includes("\ufffd"), r.id).toBe(false);
        expect(text[at - 1] === "\ufffd" || after === "\ufffd", r.id).toBe(false);
      }
    }
  });

  it("article numbers on citations are printed in the cited chunk", () => {
    for (const r of rules) {
      const c = r.citation;
      if (!c.article) continue;
      const text = chunkById.get(c.chunk_id)!.text;
      const chunk = chunkById.get(c.chunk_id)!;
      const label = c.article.replace(/, footnote.*/, "");
      expect(text.includes(label) || chunk.article?.startsWith(label), `${r.id} ${c.article}`).toBe(true);
    }
  });

  it("supporting quotes resolve too, each shown with its own source", () => {
    for (const r of rules) for (const c of r.supporting ?? []) expect(resolveCitation(c).quote, r.id).toBe(c.quote);
  });

  it("a rule that supports another points at a rule from a telecom text", () => {
    const ids = new Map(rules.map((r) => [r.id, r]));
    for (const r of rules) {
      if (!r.supports) continue;
      const t = ids.get(r.supports);
      expect(t, r.id).toBeDefined();
      expect(docById.get(t!.citation.doc_id)!.rank, r.id).toBeLessThanOrEqual(2);
    }
  });

  it("the rules named for repair no longer overreach", () => {
    const by = new Map(rules.map((r) => [r.id, r]));
    expect(by.has("PR-12")).toBe(false);
    expect(by.has("PR-25")).toBe(false);
    expect(by.has("PR-18")).toBe(false);
    expect(by.get("PR-11")!.action).not.toMatch(/^Stop/);
    expect(by.get("PR-19")!.action).not.toMatch(/further use/);
    expect(by.get("PR-26")!.action).not.toMatch(/^Hold/);
    expect(by.get("PR-30")!.action).toMatch(/^Confirm a shut-down path/);
  });

  it("anything cited from the government-services guideline is flagged as analogy", () => {
    for (const r of rules) if (r.citation.doc_id === "guideline") expect(r.analogy, r.id).toBe(true);
  });

  it("uses known classes, and a dimension the framework maps to one of its nodes", () => {
    const known = new Set(eventClasses.map((c) => c.id));
    for (const r of rules) {
      for (const c of r.classes) expect(known.has(c), r.id).toBe(true);
      expect(r.nodes.some((n) => nodeMapping.node_to_dimensions[n].includes(r.dimension_id)), r.id).toBe(true);
    }
    for (const c of controls) expect(c.nodes.some((n) => nodeMapping.node_to_dimensions[n].includes(c.dimension_id)), c.id).toBe(true);
  });

  it("template outcomes cite only rules that exist", () => {
    const ids = new Set(rules.map((r) => r.id));
    for (const o of templateOutcomes) for (const id of [...o.rule_ids, ...(o.nearest_rule_ids ?? [])]) expect(ids.has(id), id).toBe(true);
  });
});

describe("PA-01 precedence", () => {
  it("is labelled as the author's design choice", () => {
    expect(precedence.status).toMatch(/design choice/);
    expect(precedence.status).toMatch(/not a statement of UAE legal hierarchy/);
  });

  it("settles each conflict by the ranks in the documents file, showing both quotes", () => {
    expect(conflicts.length).toBeGreaterThan(0);
    for (const c of allConflicts()) {
      expect(c.winner.rank, c.id).toBeLessThan(c.loser.rank);
      expect(chunkById.get(c.winner.chunk_id)!.text).toContain(c.winner.quote);
      expect(chunkById.get(c.loser.chunk_id)!.text).toContain(c.loser.quote);
    }
  });

  it("an equal rank is not resolved", () => {
    const e = rules.find((r) => r.citation.doc_id === "ethics")!.citation;
    const g = rules.find((r) => r.citation.doc_id === "charter")!.citation;
    expect(applyPrecedence(e, g)).toBeNull();
  });

  it("ranks law and regulation over policy, guidance and framework", () => {
    const rank = (id: string) => docById.get(id)!.rank;
    expect(rank("law")).toBe(rank("cpr"));
    expect(rank("cpr")).toBeLessThan(rank("uec"));
    expect(rank("uec")).toBeLessThan(rank("ethics"));
    expect(rank("ethics")).toBeLessThan(rank("y3172"));
  });
});

describe("framework data", () => {
  it("reads 6 factors and 13 dimensions from the Readiness report, verbatim", () => {
    expect(readiness.factors).toHaveLength(6);
    expect(dimensions.map((d) => d.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    for (const f of readiness.factors) expect(chunkById.get(f.chunk_id)!.text, f.name).toContain(f.quote);
    for (const d of dimensions) {
      expect(chunkById.get(d.factor.chunk_id)!.text, d.name).toContain(d.factor.quote);
      expect(chunkById.get(d.heading_chunk)!.text.replace(/\s+/g, " "), d.name).toContain(`Dimension ${d.id}: ${d.name}`);
    }
  });

  it("quotes every node definition verbatim from Y.3172", () => {
    for (const [n, c] of Object.entries(y3172Nodes)) {
      expect(c.doc_id, n).toBe("y3172");
      expect(chunkById.get(c.chunk_id)!.text, n).toContain(c.quote);
    }
  });

  it("each evidence row uses a dimension the framework maps to that node", () => {
    for (const r of [...pipelineRows, ...supportingRows, ...nonDataRows]) expect(nodeMapping.node_to_dimensions[r.node], r.node).toContain(r.dimension_id);
  });

  it("a row keeps an AI or framework document only where it says no telecom text applies", () => {
    for (const r of [...pipelineRows, ...supportingRows]) {
      if (docById.get(r.citation!.doc_id)!.rank > 2) expect(r.no_telecom_text, r.node).toBeTruthy();
    }
  });
});
