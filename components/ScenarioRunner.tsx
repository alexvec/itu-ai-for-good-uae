"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "./useSession.ts";
import { StepView } from "./StepView.tsx";

interface Ev { id: string; release_order: number; beat: string; label: string; text: string; author_nodes: string[] }

export function ScenarioRunner({ title, disclaimer, events }: { title: string; disclaimer: string; events: Ev[] }) {
  const { data, busy, error, send, reset } = useSession();
  const [auto, setAuto] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const done = new Set(data?.entries.map((e) => e.id));
  const next = events.find((e) => !done.has(e.id));
  const shown = data?.entries.filter((e) => events.some((x) => x.id === e.id)) ?? [];

  const release = () => { if (next && !busy) send({ event_id: next.id }, { id: next.id, beat: next.beat, label: next.label, text: next.text }); };

  useEffect(() => {
    if (!auto || !next || busy) return;
    const t = setTimeout(release, 6000);
    return () => clearTimeout(t);
  });
  useEffect(() => { if (shown.length) bottom.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [shown.length]);

  return (
    <div className="split">
      <aside>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <p><span className="synthetic" data-testid="synthetic">SYNTHETIC SCENARIO</span></p>
        <p className="cite">{disclaimer}</p>
        <div className="row">
          <button onClick={release} disabled={!next || busy || !data} data-testid="release">{next ? (shown.length ? "Release next event" : "Release first event") : "All events released"}</button>
          <button className="secondary" onClick={reset} disabled={busy} data-testid="reset">Reset</button>
        </div>
        <ol className="steps" data-testid="steps">
          {events.map((e) => (
            <li key={e.id} className={done.has(e.id) ? "done" : e.id === next?.id ? "next" : ""}>
              <span className="mono">{e.release_order}. {e.beat}</span><br />{done.has(e.id) || e.id === next?.id ? e.label : "Not released yet"}
            </li>
          ))}
        </ol>
        <label className="cite"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Release every 6 seconds</label>
        {data && (
          <div className="card cite" data-testid="running-state">
            <strong>Running state</strong><br />
            Events released: {data.state.events_seen}<br />
            Rules fired: {data.state.fired_rules.length}<br />
            Rules awaiting a decision: {data.state.pending_rules.length}<br />
            Audit lines: {data.lines.length}<br />
            Model: {data.modelConfigured ? "configured, output marked separately" : "none. No model or key is used."}
          </div>
        )}
        {error && <p className="fail">{error}</p>}
      </aside>
      <section>
        {shown.length === 0 && (
          <div className="card">
            <p><strong>Nine events, released one at a time.</strong> For each one the agent classifies the event to Y.3172 nodes, fires pre-agreed rules, retrieves from the KB and says what the ingested documents leave open. Conflicts between sources are settled by the pre-agreed rule PA-01, shown on screen.</p>
            <p className="cite">Press &quot;Release first event&quot; to begin.</p>
          </div>
        )}
        {shown.map((entry, i) => {
          const ev = events.find((e) => e.id === entry.id)!;
          return (
            <article className="card" key={entry.id} data-testid={`event-${entry.id}`} ref={i === shown.length - 1 ? bottom : undefined}>
              <div className="event-kicker">Event {ev.release_order} · {ev.beat} · synthetic</div>
              <h2 style={{ marginTop: ".2rem" }}>{ev.label}</h2>
              <p>{ev.text}</p>
              <StepView step={entry.step} />
              <p className="cite">Expected nodes by design: {ev.author_nodes.join(", ")}. The agent does not see this note.</p>
            </article>
          );
        })}
        {shown.length === events.length && (
          <div className="row">
            <a className="btn" href="/audit">Open the audit log</a>
            <a className="btn secondary" href="/gaps">See candidate gaps</a>
            <a className="btn secondary" href="/evidence">See the report evidence</a>
          </div>
        )}
      </section>
    </div>
  );
}
