// An action must not be stronger than its quote. The ladder orders what the source's words can carry
// against what the action's lead verb asserts. Checking, recording and asking a person are weaker than any modal.
export const TEXT_FORCE: Record<string, number> = {
  shall: 4, must: 4, "shall not": 4, "may not": 4, "strictly prohibited": 4, "not permitted": 4, preclude: 4, "shall be punished": 4, "are required": 4,
  should: 3, require: 3, imperative: 3,
  "should consider": 2, "could consider": 2, consider: 2, encourages: 2, may: 2, can: 2, "may be": 2,
  descriptive: 1,
};
export const ACTION_FORCE: Record<string, number> = {
  Record: 0, Check: 0, Note: 0, Ask: 0, Flag: 0, Confirm: 0, Compare: 0,
  Consider: 2, May: 2,
  Should: 3,
  Must: 4, Shall: 4, "Do not": 4,
};
export interface StrengthCheck { text_modal: string; action_verb: string; result: "pass" | "fail" }

/** Recomputes the check from the rule's own words. Returns the reason it fails, or null. */
export function strengthProblem(action: string, quote: string, sc: StrengthCheck): string | null {
  const t = TEXT_FORCE[sc.text_modal];
  const a = ACTION_FORCE[sc.action_verb];
  if (t === undefined) return `unknown text modal "${sc.text_modal}"`;
  if (a === undefined) return `unknown action verb "${sc.action_verb}"`;
  if (!action.startsWith(sc.action_verb)) return `action does not lead with "${sc.action_verb}"`;
  const q = quote.replace(/\s+/g, " ").toLowerCase();
  if (sc.text_modal !== "descriptive" && sc.text_modal !== "imperative" && !q.includes(sc.text_modal)) return `quote does not contain "${sc.text_modal}"`;
  if (a > t) return `action "${sc.action_verb}" is stronger than text "${sc.text_modal}"`;
  // A lead verb cannot launder a stronger word later in the sentence. These words must be in the quote to appear in the action.
  for (const w of ["stop", "halt", "hold", "immediately", "shut down now", "before any further use", "ban", "forbid"]) {
    if (new RegExp(`\\b${w}\\b`, "i").test(action) && !q.includes(w)) return `action says "${w}", which the quote does not`;
  }
  if (t < 4 && /\b(must|shall)\b/i.test(action)) return "action says must or shall on a text weaker than that";
  if (t < 3 && /\bshould\b/i.test(action)) return "action says should on a text weaker than that";
  return sc.result === "pass" ? null : "strength_check result is not pass";
}
