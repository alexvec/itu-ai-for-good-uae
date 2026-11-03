import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import scenario from "../data/scenarios/primary.json" with { type: "json" };
import { chunkById } from "../lib/data.ts";
import { allControlResults, allOutcomes, classify, emptyState, runStep, type StepResult } from "../lib/engine.ts";
import { evidenceMarkdown, nonDataRows, pipelineRows, supportingRows } from "../lib/evidence.ts";
import { discardReason, modelConfigured, modelNarrative } from "../lib/llm.ts";
import { CANDIDATE, NO_GLOBAL_EXAMPLE, NOT_ADDRESSED, PIPELINE } from "../lib/types.ts";
import { ROOT } from "../scripts/kb-io.ts";

function run(): StepResult[] {
  let state = emptyState();
  return scenario.events.map((e) => {
    const r = runStep(e.text, state);
    state = r.state;
    return r;
  });
}

function displayedQuotes(step: StepResult): { chunk_id: string; quote: string }[] {
  return [
    ...step.rule_findings.map((f) => ({ chunk_id: f.citation.chunk_id, quote: f.citation.quote })),
    ...step.retrieved.map((f) => ({ chunk_id: f.chunk_id, quote: f.quote })),
    ...step.controls.flatMap((c) => (c.nearest ? [{ chunk_id: c.nearest.chunk_id, quote: c.nearest.quote }] : [])),
    ...(step.decision?.actions.map((a) => ({ chunk_id: a.citation.chunk_id, quote: a.citation.quote })) ?? []),
    ...(step.decision?.outcomes.flatMap((o) => [...o.citations, ...o.nearest].map((c) => ({ chunk_id: c.citation.chunk_id, quote: c.citation.quote }))) ?? []),
  ];
}

describe("main scenario with the model variables unset", () => {
  const saved = { a: process.env.LLM_BASE_URL, b: process.env.LLM_API_KEY, c: process.env.LLM_MODEL };
  beforeEach(() => {
    delete process.env.LLM_BASE_URL;
    delete process.env.LLM_API_KEY;
    delete process.env.LLM_MODEL;
  });
  afterEach(() => {
    if (saved.a) process.env.LLM_BASE_URL = saved.a;
    if (saved.b) process.env.LLM_API_KEY = saved.b;
    if (saved.c) process.env.LLM_MODEL = saved.c;
  });

  it("completes every event and runs no model", async () => {
    expect(modelConfigured()).toBe(false);
    const steps = run();
    expect(steps).toHaveLength(scenario.events.length);
    for (const s of steps) expect(s.classes.length).toBeGreaterThan(0);
    expect(await modelNarrative(steps[0])).toBeUndefined();
    expect(scenario.synthetic).toBe(true);
  });

  it("follows the template: popular, controversy, then the KB decides, then the privacy escalation", () => {
    const beats = scenario.events.map((e) => e.beat);
    const pop = beats.indexOf("Popular");
    const con = beats.indexOf("Controversy");
    const dec = beats.indexOf("KB decides");
    const esc = beats.indexOf("Escalation");
    const dec2 = beats.lastIndexOf("KB decides");
    expect(pop).toBeGreaterThanOrEqual(0);
    expect(pop < con && con < dec && dec < esc && esc < dec2).toBe(true);
    const steps = run();
    expect(steps[pop].rule_findings.map((f) => f.rule_id)).toContain("PR-03");
    expect(steps[dec].decision!.actions.map((a) => a.rule_id)).toContain("PR-04");
    expect(steps[dec2].decision!.actions.map((a) => a.rule_id)).toEqual(expect.arrayContaining(["PR-11", "PR-12", "PR-14", "PR-15"]));
    expect(steps[dec2].decision!.outcomes).toHaveLength(4);
  });

  it("reports the template outcomes the text does not support as not addressed", () => {
    const by = Object.fromEntries(allOutcomes().map((o) => [o.id, o]));
    expect(by.purpose_limitation.status).toBe(NOT_ADDRESSED);
    expect(by.purpose_limitation.citations).toHaveLength(0);
    expect(by.oversight_referral.unsupported).toMatch(/outside the organization/);
    expect(by.prohibit.unsupported).toMatch(/binding/);
  });

  it("every displayed quote is in its chunk, for every event and view", () => {
    let total = 0;
    const check = (q: { chunk_id: string; quote: string }) => {
      total++;
      expect(chunkById.get(q.chunk_id)?.text.includes(q.quote), `${q.chunk_id}: ${q.quote}`).toBe(true);
    };
    for (const s of run()) displayedQuotes(s).forEach(check);
    for (const t of ["A law enforcement request asks for stored communications metadata", "Our licence renewal asks about the ML function", "Customers complain about the vendor export of personal data"]) displayedQuotes(runStep(t)).forEach(check);
    for (const c of allControlResults()) if (c.nearest) check(c.nearest);
    for (const r of [...pipelineRows, ...supportingRows, ...nonDataRows]) if (r.citation) check({ chunk_id: r.citation.chunk_id, quote: r.citation.quote });
    expect(total).toBeGreaterThan(40);
  });

  it("the agent never reads the scenario's author notes", () => {
    expect(runStep.length).toBeLessThanOrEqual(2);
    expect(run()[0].nodes.sort()).toEqual(["C", "D", "M", "P", "PP", "SINK", "SRC"]);
  });

  it("free text with no matching class says so and fires nothing", () => {
    const r = runStep("The billing team likes the colour of the new logo");
    expect(r.classes).toHaveLength(0);
    expect(r.rule_findings).toHaveLength(0);
    expect(r.headline).toContain(NOT_ADDRESSED);
  });

  it("an interception event is marked not addressed, with review flag and no global example", () => {
    const c = runStep("A request arrives to intercept communications").controls.find((x) => x.id === "G-01")!;
    expect(c.status).toBe(NOT_ADDRESSED);
    expect(c.review_flag).toBe(CANDIDATE);
    expect(c.global_example).toBe(NO_GLOBAL_EXAMPLE);
  });

  it("does not classify 'licensed telecom operator' as a licensing event", () => {
    expect(classify("A licensed telecom operator deploys a model").map((c) => c.id)).not.toContain("licensing_authorization");
  });
});

describe("evidence export", () => {
  it("has one row per node in template order, each with dimension and document", () => {
    expect(pipelineRows.map((r) => r.node)).toEqual(PIPELINE);
    for (const r of pipelineRows) {
      expect(r.use_case.length).toBeGreaterThan(0);
      expect(r.dimension_id).toBeGreaterThan(0);
      expect(r.citation?.chunk_id).toBeTruthy();
    }
  });

  it("includes strategy alignment, interface design and human collaboration", () => {
    expect(nonDataRows.map((r) => r.item)).toEqual(["Strategy alignment", "Interface design", "Collaboration between AI and a human"]);
  });

  it("states the KB's limits and marks analogy", () => {
    const md = evidenceMarkdown();
    expect(md).toContain("no binding telecom sector law");
    expect(md).toContain("Telecom Law");
    expect(md).toContain("PDPL");
    expect(md).toContain("applied by analogy");
    expect(md).toContain(NO_GLOBAL_EXAMPLE);
  });
});

describe("optional model guard", () => {
  it("discards article numbers, foreign chunk ids and unknown quotations", () => {
    expect(discardReason("Under Article 14 this is banned.", [], [])).toMatch(/article/);
    expect(discardReason("See ethics-p99-c1.", [], ["ethics-p01-c1"])).toMatch(/chunk/);
    expect(discardReason('The text says "operators must always ask first".', ["other text"], [])).toMatch(/quotation/);
    expect(discardReason('The text says "should respect privacy".', ["AI systems should respect privacy and more"], [])).toBeNull();
  });

  it("marks model output separately, and falls back when the call fails or adds a citation", async () => {
    const env = { LLM_BASE_URL: "http://model.test", LLM_API_KEY: "k", LLM_MODEL: "m" } as unknown as NodeJS.ProcessEnv;
    const step = runStep("Subscribers complain about service");
    const reply = (content: string) => new Response(JSON.stringify({ choices: [{ message: { content } }] }));
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock.mockResolvedValueOnce(reply("Subscribers raised a complaint."));
    expect((await modelNarrative(step, env))?.status).toBe("used");
    fetchMock.mockResolvedValueOnce(reply("Article 9 applies."));
    expect((await modelNarrative(step, env))?.status).toBe("discarded");
    fetchMock.mockRejectedValueOnce(new Error("down"));
    expect((await modelNarrative(step, env))?.status).toBe("failed");
    fetchMock.mockRestore();
  });
});

describe("product text", () => {
  const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  const files = ["app", "components", "lib", "data"].flatMap((d) => walk(join(ROOT, d))).filter((f) => /\.(tsx?|json|css)$/.test(f));
  const text = files.map((f) => [f, readFileSync(f, "utf8")] as const);

  it("never says the text or the law is silent, and states no article of an uningested law", () => {
    for (const [f, t] of [...text, ["README", readFileSync(join(ROOT, "README.md"), "utf8")] as const]) {
      expect(/text silent|law is silent(?! on)/i.test(t.replace("does not mean UAE\n        law is silent", "")), f).toBe(false);
      expect(/\bArticle\s+\d+/.test(t), f).toBe(false);
    }
  });

  it("reports no accuracy number", () => {
    for (const [f, t] of text) expect(/accuracy[^.\n]{0,20}\d+\s*%|\d+\s*%[^.\n]{0,20}accura/i.test(t) && !f.includes("chunks.json"), f).toBe(false);
  });
});
