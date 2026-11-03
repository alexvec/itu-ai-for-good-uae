# Demo path

The path `e2e/demo.spec.ts` walks. Under seven minutes on the live URL. Everything shown is real KB text and a synthetic scenario. No model and no key.

1. **Knowledge base, `/kb`.** Nine documents with publisher, language, status, hash and chunk count. The Telecom Law row is marked secondary host, and the page quotes the document's own line that the Arabic version prevails. Show every source attempted, including the HTTP 403 for the Data Protection Law and the HTTP 202 challenge from EUR-Lex. Press "verify" on one quote.
2. **Scenario, `/`.** Release the nine events one at a time.
   - Event 1, deployment: Telecom Law Article (12), CPR 5.5 on speed restrictions, the Subscriber Information definition.
   - Event 2, popular: PR-03, labelled by analogy. No telecom text speaks to popularity.
   - Event 3, controversy: complaints fire CPR Article 26 and Telecom Law Article (30). Care proposes a chatbot and an outside auditor asks for subscriber records.
   - Event 4, the KB decides: PA-01 settles two conflicts with both quotes on screen. CPR 26.7.2 outranks the Strategy objective. CPR 24.6 outranks the Ethics external-audit "should".
   - Event 5, escalation from a consumer issue to a data-privacy breach: CPR Article 24.
   - Event 6, the KB decides: corrective action, then the template's outcomes as read from the text. Consent is supported. Prohibit, purpose limitation and referral are partly supported, each with its limit. CPR 24.1 sends the question to counsel, because the Data Protection Law is not in the KB.
   - Events 7 to 9: regulator request (CPR 3.9, 24.11, Article (71)), push without sandbox (Y.3172, voluntary; no UAE text), emergency traffic (CPR 22.4, scoped to dunning, read by analogy).
3. **Free text, `/free-text`.** Type an event, for example a law enforcement request for stored communications metadata. Article (72) and CPR 24.3.5 fire, and the ML pipeline question stays not addressed.
4. **Gaps, `/gaps`.** Candidates by Readiness dimension, each with nearest text, the review flag and "no global example in KB".
5. **Evidence, `/evidence`.** The template table: one row per node, SRC to SINK, with the Y.3172 definition quoted, then strategy alignment, interface design and collaboration between AI and a human, then PA-01 and the outcomes. Open the Markdown export.
6. **Audit, `/audit`.** Verify, change one byte and see it fail. Export the log and run `node scripts/verify-audit.ts <file>`.
7. **No-key statement.** The banner and the running state say no model or key is used.

To record: `RECORD=1 SLOW_MO=400 BASE_URL=https://itu-ai-for-good-uae.vercel.app npx playwright test --headed`.
