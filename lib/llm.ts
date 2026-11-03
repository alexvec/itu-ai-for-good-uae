// Optional model behind LLM_BASE_URL, LLM_API_KEY and LLM_MODEL. Any OpenAI-compatible endpoint.
// It may reword the narrative and suggest classes for free text. It can never add a citation, quote or article.
import type { StepResult } from "./engine.ts";
import { eventClasses } from "./engine.ts";

export function modelConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.LLM_BASE_URL && env.LLM_API_KEY && env.LLM_MODEL);
}

/** Returns a reason to discard the model's text, or null if it adds no citation, quote or article of its own. */
export function discardReason(text: string, retrievedText: string[], allowedChunkIds: string[]): string | null {
  if (/\b(article|art\.|section|clause|§)\s*\d/i.test(text)) return "mentions an article or section number";
  const ids = text.match(/\b(?:strategy|charter|ethics|guideline)-p\d{2}-c\d+\b/g) ?? [];
  if (ids.some((id) => !allowedChunkIds.includes(id))) return "cites a chunk that was not retrieved";
  const corpus = retrievedText.join(" ").toLowerCase().replace(/\s+/g, " ");
  for (const m of text.matchAll(/["“]([^"”]{12,})["”]/g)) {
    if (!corpus.includes(m[1].toLowerCase().replace(/\s+/g, " "))) return "contains a quotation that is not in the retrieved text";
  }
  return null;
}

async function chat(system: string, user: string, env: NodeJS.ProcessEnv): Promise<string> {
  const res = await fetch(`${env.LLM_BASE_URL!.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${env.LLM_API_KEY}` },
    body: JSON.stringify({ model: env.LLM_MODEL, temperature: 0.2, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`model endpoint returned ${res.status}`);
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("model returned no text");
  return text.trim();
}

/** Suggestion only, for free text that matched no class. Unknown ids are dropped. */
export async function suggestClasses(text: string, env: NodeJS.ProcessEnv = process.env): Promise<string[]> {
  if (!modelConfigured(env)) return [];
  try {
    const list = eventClasses.filter((c) => c.id !== "decision_request").map((c) => `${c.id}: ${c.label}`).join("\n");
    const out = await chat("Pick event classes for a telecom ML incident. Reply with class ids separated by commas, or none.", `Classes:\n${list}\n\nEvent:\n${text}`, env);
    const known = new Set(eventClasses.map((c) => c.id));
    return out.split(/[\s,]+/).filter((id) => known.has(id));
  } catch {
    return [];
  }
}

export async function modelNarrative(step: StepResult, env: NodeJS.ProcessEnv = process.env): Promise<StepResult["model_step"] | undefined> {
  if (!modelConfigured(env)) return undefined;
  try {
    const text = await chat(
      "Rewrite the narrative in plain language, in at most three sentences. Do not add facts, quotations, citations, article numbers or legal conclusions.",
      step.narrative,
      env,
    );
    const quotes = [...step.rule_findings.map((f) => f.citation.quote), ...step.retrieved.map((f) => f.quote), ...(step.decision?.actions.map((a) => a.citation.quote) ?? [])];
    const ids = [...step.rule_findings.map((f) => f.citation.chunk_id), ...step.retrieved.map((f) => f.chunk_id), ...(step.decision?.actions.map((a) => a.citation.chunk_id) ?? [])];
    const reason = discardReason(text, quotes, ids);
    return reason ? { status: "discarded", reason } : { status: "used", text };
  } catch (e) {
    return { status: "failed", reason: (e as Error).message };
  }
}
