# Demo path

The path `e2e/demo.spec.ts` walks. Under seven minutes on the live URL. Everything shown is real KB text and a synthetic scenario. No model and no key.

1. **Knowledge base, `/kb`.** Four documents with URL, date, hash, chunk count and OCR-derived pages. Show what is not in the KB (Telecom Law, PDPL) and the table of terms that never occur.
2. **Scenario, `/`.** Release the nine events one at a time.
   - Event 2, popular: rule PR-03 reclassifies the deployment as a candidate set of significant-at-scale decisions.
   - Event 3, controversy: complaints fire the challenge and fairness rules.
   - Event 4, the KB decides: the corrective action, with each step cited to a verbatim quote.
   - Event 5, escalation from a consumer issue to a data-privacy breach.
   - Event 6, the KB decides: corrective action, then the template's example outcome tested against the text. Purpose limitation shows "not addressed in the ingested documents".
   - Events 7 to 9: regulator request, push without sandbox, emergency traffic.
3. **Free text, `/free-text`.** Type an event, for example a law enforcement request for stored communications metadata.
4. **Gaps, `/gaps`.** Candidates by Readiness dimension, each with nearest text, the review flag and "no global example in KB".
5. **Evidence, `/evidence`.** The template table: one row per node, SRC to SINK, then strategy alignment, interface design and collaboration between AI and a human. Open the Markdown export.
6. **Audit, `/audit`.** Verify, change one byte and see it fail. Export the log and run `node scripts/verify-audit.ts <file>`.
7. **No-key statement.** The banner and the running state say no model or key is used.

To record: `RECORD=1 SLOW_MO=400 BASE_URL=https://itu-ai-for-good-uae.vercel.app npx playwright test --headed`.
