"use client";
import { useState } from "react";
import { useSession } from "./useSession.ts";
import { StepView } from "./StepView.tsx";

export function FreeText() {
  const { data, busy, error, send } = useSession();
  const [text, setText] = useState("");
  const entries = data?.entries.filter((e) => e.id.startsWith("free-")) ?? [];
  const submit = () => {
    const t = text.trim();
    if (t) send({ text: t }, { id: `free-${Date.now()}`, beat: "Free text", label: "Typed event", text: t });
  };
  return (
    <>
      <div className="card">
        <label htmlFor="event"><strong>Describe an event in the network</strong></label>
        <textarea id="event" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="For example: a law enforcement request asks for stored communications metadata that the pre-processor has already transformed." data-testid="free-text" />
        <div className="row"><button onClick={submit} disabled={busy || !text.trim() || !data} data-testid="free-submit">Run the same rules</button></div>
        <p className="cite"><strong>Limitation.</strong> With no model configured, classification is keyword matching against the event classes in <code>data/event-classes.json</code>. It can miss a paraphrase, and text outside those classes gets no rule. Typed text is not stored on the server; it goes into this browser session&apos;s audit log.</p>
        {error && <p className="fail">{error}</p>}
      </div>
      {[...entries].reverse().map((e) => (
        <article className="card" key={e.id} data-testid="free-result">
          <div className="event-kicker">Typed event</div>
          <p>{e.text}</p>
          <StepView step={e.step} />
        </article>
      ))}
    </>
  );
}
