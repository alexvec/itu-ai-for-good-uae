import { NextResponse } from "next/server";
import scenario from "../../../data/scenarios/primary.json" with { type: "json" };
import { emptyState, runStep, classify, eventClasses, type RunState } from "../../../lib/engine.ts";
import { GENESIS } from "../../../lib/audit.ts";
import { modelConfigured, modelNarrative, suggestClasses } from "../../../lib/llm.ts";
import { stepToLines } from "../../../lib/step-log.ts";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  const { event_id, text, state, prev_hash, seq, session } = body as { event_id?: string; text?: string; state?: RunState; prev_hash?: string; seq?: number; session?: string };
  const event = event_id ? scenario.events.find((e) => e.id === event_id) : undefined;
  if (event_id && !event) return NextResponse.json({ error: "unknown event" }, { status: 404 });
  const input = event ? event.text : typeof text === "string" ? text.trim().slice(0, 2000) : "";
  if (!input) return NextResponse.json({ error: "no event text" }, { status: 400 });
  const prevHash = typeof prev_hash === "string" && /^[0-9a-f]{64}$/.test(prev_hash) ? prev_hash : GENESIS;
  const session_id = typeof session === "string" ? session.slice(0, 64) : "session";

  const step = runStep(input, state ?? emptyState());
  if (modelConfigured()) {
    step.model_step = await modelNarrative(step);
    if (!event && classify(input).length === 0) {
      const suggested = await suggestClasses(input);
      if (suggested.length) {
        step.model_step = { ...(step.model_step ?? { status: "used" as const }), suggested_classes: suggested.map((id) => eventClasses.find((c) => c.id === id)!.label) };
      }
    }
  }
  const log = stepToLines(step, { session: session_id, seq: typeof seq === "number" ? seq : 0, prevHash, eventId: event?.id ?? null, scenarioId: event ? scenario.id : null });
  return NextResponse.json({ step, lines: log.lines, head: log.head, seq: log.seq, model_configured: modelConfigured() });
}
