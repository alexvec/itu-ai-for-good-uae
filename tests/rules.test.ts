import { describe, expect, it } from "vitest";
import { chunkById } from "../lib/data.ts";
import { controls, dimensions, nodeMapping, rules, templateOutcomes, eventClasses } from "../lib/engine.ts";
import { nonDataRows, pipelineRows, supportingRows } from "../lib/evidence.ts";

const norm = (s: string) => s.replace(/\s+/g, " ");

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
    for (const r of rules) expect(chunkById.get(r.citation.chunk_id)!.extraction, r.id).toBe("text-layer");
  });

  it("the strength stated for a rule is the word the quote uses", () => {
    for (const r of rules) if (r.modal) expect(norm(r.citation.quote), r.id).toContain(r.modal);
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

describe("framework data", () => {
  it("has the 13 dimensions from the reference repo", () => {
    expect(dimensions.map((d) => d.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it("each evidence row uses a dimension the framework maps to that node", () => {
    for (const r of [...pipelineRows, ...supportingRows, ...nonDataRows]) expect(nodeMapping.node_to_dimensions[r.node], r.node).toContain(r.dimension_id);
  });
});
