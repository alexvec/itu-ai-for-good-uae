"use client";
import { useCallback, useEffect, useState } from "react";
import type { RunState, StepResult } from "../lib/engine.ts";

export interface SessionEntry { id: string; beat: string; label: string; text: string; step: StepResult }
export interface SessionData { session: string; lines: string[]; head: string; seq: number; state: RunState; entries: SessionEntry[]; modelConfigured: boolean }

const KEY = "y3172-session";
const GENESIS = "0".repeat(64);
const fresh = (): SessionData => ({
  session: `s-${Date.now().toString(36)}`, lines: [], head: GENESIS, seq: 0, modelConfigured: false,
  state: { fired_rules: [], pending_rules: [], classes_seen: [], events_seen: 0 }, entries: [],
});

export function useSession() {
  const [data, setData] = useState<SessionData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    setData(saved ? JSON.parse(saved) : fresh());
  }, []);

  const save = useCallback((d: SessionData) => {
    sessionStorage.setItem(KEY, JSON.stringify(d));
    setData(d);
  }, []);

  const send = useCallback(async (payload: { event_id?: string; text?: string }, meta: { id: string; beat: string; label: string; text: string }) => {
    if (!data) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/step", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, state: data.state, prev_hash: data.head, seq: data.seq, session: data.session }),
      });
      if (!res.ok) throw new Error(`The server returned ${res.status}.`);
      const out = await res.json();
      save({ ...data, lines: [...data.lines, ...out.lines], head: out.head, seq: out.seq, state: out.step.state, modelConfigured: out.model_configured, entries: [...data.entries, { ...meta, step: out.step }] });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [data, save]);

  const reset = useCallback(() => save(fresh()), [save]);
  return { data, busy, error, send, reset };
}
