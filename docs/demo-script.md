# Demo script: Y.3172 Incident Counsel

Target length 6:25. The event limit is 7 minutes, so there is about 35 seconds of margin. Run it on https://itu-ai-for-good-uae.vercel.app. Nothing here has been recorded or uploaded. The operator records and uploads, if at all (the video is optional until shortlisting, per `docs/competition.md`).

Rules for the narrator:

- Say "not addressed in the ingested documents". Never say the law is silent.
- Say "partly supported" for prohibition, consent and oversight referral. Say "not addressed" for purpose limitation. Do not round up.
- Read quotes only as they appear on screen. Do not paraphrase a quote as if it were the source.
- Items marked **confirm on screen** are not verifiable from the repo files alone. Check them in a dry run and adjust the words if the screen differs.
- The scenario is synthetic. Say so once at the start and once at the end.

Source for the screens: `docs/demo-path.md`. The recording command there is `RECORD=1 SLOW_MO=400 BASE_URL=https://itu-ai-for-good-uae.vercel.app npx playwright test --headed`. Its pacing may not match this script. Use it only if it fits.

Before starting, open `/` in a fresh browser session so the audit log starts empty. The log is held in the browser session.

---

## 0:00 to 0:25. The problem (on `/`)

Screen: home page, top banner visible.

Say: "A telecom operator runs a machine-learning model that throttles traffic. When something goes wrong, someone has to work out which part of the pipeline is involved, which published rules bear on it, and what those rules do not say. This is a prototype adviser for that job. It is not legal advice, the scenario is synthetic, and no operator was consulted."

Point at the banner: "no binding telecom sector law", Telecom Law and PDPL "were not ingested", "Runs with no model and no API key".

## 0:25 to 0:55. The knowledge base (`/kb`)

Screen: `/kb`.

Say: "The knowledge base is exactly four UAE documents: the AI Strategy, the July 2024 Charter, the 2022 Ethics Principles and a government-services adoption guideline. Each row shows URL, retrieval date, hash and chunk count. Some pages are OCR-derived and labelled that way."

Scroll to the "Not in the KB" table and the "Terms that never occur" table. Say: "The Telecom Law and the data protection law exist and are not here. The words telecom, subscriber, interception, breach, purpose limitation, sandbox and emergency do not occur in these four documents. These counts are computed live."

Confirm on screen: the term-count values (the README says none of the seven occurs; expect zero for each) and the OCR page list (README: Strategy 1 and 25, Ethics 25, Guideline 36 and 56).

## 0:55 to 1:55. Events 1 to 3: deployment, popular, controversy (`/`)

Screen: `/`. Click "Release first event", then "Release next event" twice.

Event 1, deployment. Say: "The model goes live and throttles a service class with no human in the loop. The strip at the top of each event is the ITU-T Y.3172 pipeline: SRC, C, PP, M, P, D, SINK, then the orchestrator and sandbox. The highlighted nodes are the ones the agent classified the event to." Confirm on screen: which nodes highlight, and that rules PR-01 and PR-02 appear under "Pre-agreed rules fired".

Event 2, popular. Say: "The deployment is popular and is extended network-wide. Rule PR-03 reclassifies it as a candidate set of significant-at-scale decisions. The source example in the Ethics document is a website, so the screen marks this 'by analogy' for a human to confirm." Point at the "may be" tag.

Event 3, controversy. Say: "Subscribers on one low-cost plan complain and find no way to challenge the decision. The complaint fires rules on investigation, equal treatment, a challenge procedure, human review, telling subscribers an AI decided, and a named person who can override." Open one rule and show the quote with its page and chunk id. Confirm on screen: the number of rules fired (by my reading of `data/rules.json`, PR-04 to PR-10, seven rules).

## 1:55 to 2:40. Event 4: the knowledge base decides (`/`)

Screen: release event 4. The "Corrective action, from the pre-agreed rules" card appears.

Say: "The governance lead asks what action to take. The agent does not improvise. It orders the rules that are pending and lists the corrective actions. Each action has its quote, its page, its chunk id and the source's own modal verb: 'could consider', 'should provide'. The text above the list says the rules were drafted in this build and not reviewed by a lawyer, and that the ingested text recommends and does not compel."

Confirm on screen: the number of actions in this list (by my reading of the code, ten: PR-01 to PR-10) and their order.

## 2:40 to 3:25. Events 5 and 6: breach, then the KB decides again (`/`)

Screen: release event 5, then event 6.

Event 5. Say: "The issue escalates. Call-detail records with identifiers were exported to a vendor, per-subscriber predictions reached a marketing dashboard, and no consent record exists." Confirm on screen: the personal-data-exposure class tag.

Event 6. Say: "The knowledge base decides again. Here is what the text supports." Scroll to the table "The template's example outcome, tested against the text". Read it as it stands:

- Prohibits a use: partly supported. "Should not be deployed" past accepted privacy standards, and by analogy "should avoid" exposing personal data. Not a binding prohibition.
- Requires consent: partly supported. Review of consent logging and revocation. Not a general consent duty on a telecom operator.
- Requires purpose limitation: **not addressed in the ingested documents.** Only nearest text is shown: minimum intrusion and need-based access.
- Refers the case to an oversight body: partly supported. An oversight mechanism inside the organisation and a Data Protection Officer role. No route to an outside body.

Say: "This is not a claim about what the law requires. It is what these four documents say."

Confirm on screen: the number of actions in the second list (by my reading, thirteen: PR-11 to PR-23).

## 3:25 to 3:50. Events 7 to 9, fast (`/`)

Screen: release events 7, 8 and 9 in quick succession. Pause one second on each headline.

Say: "A regulator's information request: the agent keeps records and refers the question to human counsel, because the Charter points to local laws and none is in the knowledge base. A push to production without sandbox testing: evaluate first, apply quality checks, test a fall back plan. Emergency traffic affected: modify or remove the system, keep shut-down possible, require human verification."

Confirm on screen: that all nine steps in the left list show as done and the "All events released" button label.

## 3:50 to 4:10. Free text (`/free-text`)

Screen: `/free-text`. Type: "a law enforcement request asks for stored communications metadata that the pre-processor has already transformed." (The page's own placeholder text, from the code.) Click "Run the same rules".

Say: "The same rules run on text I type. Classification is keyword matching, so it can miss a paraphrase, and the page says so."

Confirm on screen: the result. By my reading of `data/event-classes.json` and `data/rules.json`, the interception class matches and PR-25 refers the question to human counsel. The gap question on lawful access should show as a candidate, but check its status.

## 4:10 to 4:40. Gaps (`/gaps`)

Screen: `/gaps`.

Say: "Gaps are grouped by AI Readiness dimension. Each row shows the question, 'not addressed in the ingested documents', the flag 'candidate, needs human legal review', and the nearest text, which does not answer the question. The page states that this is not a finding about UAE law." Point to the box: "Global examples: no global example in KB."

Say: "I have no global examples. No foreign instrument was ingested and I did not write any from memory. The UAE documents mention some foreign practice in passing; the page says those passages are not offered as examples. That is a known weakness of this entry."

## 4:40 to 5:05. Evidence, and why Y.3172 makes it work (`/evidence`)

Screen: `/evidence`, the node table.

Say: "This is the table the template asks for: one row per node, SRC to SINK, with the use case, one Readiness dimension and one policy document with its chunk id. It is generated from the same data files the app runs on. The Y.3172 nodes are what make the agent work. An event is classified to nodes first, retrieval runs once per node, and rules and gap questions carry nodes. The Readiness dimensions tag every finding. The node wording and the thirteen dimensions come from the reference repository, CrashingGuru/ITUAIReadiness, under the MIT licence. I did not read the Readiness Report itself, and I did not use the AI for Good Sandbox. The knowledge base exports as JSONL in the reference schema for loading there."

Scroll to the three rows below the table: strategy alignment, interface design, collaboration between AI and a human.

## 5:05 to 5:35. Audit (`/audit`)

Screen: `/audit`.

Say: "Every input, class, rule, query, chunk id with score and quote check is in a hash-chained log. With no model there is no hidden reasoning to show, so the trace is the structured record." Click "Verify log": it should show VERIFIED with a line count and head hash. Click "Change one byte and verify": it should show FAILED at a line number.

Say: "A one-byte edit is detected. The chain is not tamper-proof: someone who recomputes the whole chain could forge a new one, so keep the head hash somewhere else. The log lives in this browser session. It can be exported and checked offline with the verify script."

Confirm on screen: the exact wording of the VERIFIED and FAILED lines.

## 5:35 to 6:00. Who pays

Screen: stay on `/audit` or return to `/`.

Say: "Who pays is an unvalidated hypothesis, not evidence of demand. The candidates are compliance and network-governance teams at operators, or a regulator or standards body that wants to test how rules cope with machine learning in a network. I have no customer, price or market figure, and none has been consulted. For the judges, the plausible value is research and standards work: an open knowledge-base format and a method that keys policy gaps to Y.3172 nodes."

## 6:00 to 6:25. What is next, and close

Screen: `/gaps` or `/`.

Say: "Next, as the repository's own limits point out: have a lawyer review the rules; ingest the Telecom Law and the data protection law, which would replace analogy with sector text; add foreign instruments so the gap view can offer real global examples; try the optional model against a real endpoint, since it has only been tested against a mock; and load the knowledge base into the Sandbox. These are intentions, not commitments. The scenario was synthetic. The repository is github.com/alexvec/itu-ai-for-good-uae and the live site is itu-ai-for-good-uae.vercel.app."

---

## Items to confirm on screen (collected)

1. Term-count values and OCR page list on `/kb`.
2. Which nodes highlight on event 1, and that PR-01 and PR-02 appear.
3. Number of rules fired at event 3 (expected seven).
4. Number and order of actions at event 4 (expected ten).
5. Personal-data-exposure tag at event 5, and number of actions at event 6 (expected thirteen).
6. Final state of the step list after event 9.
7. Free-text result for the stored-communications example (PR-25 and the lawful-access gap).
8. Wording of the VERIFIED and FAILED lines on `/audit`.
9. Total running time on a dry run, against the 7-minute limit.

## Not shown, on purpose

- No accuracy number, score or performance claim.
- No foreign example.
- No article of the Telecom Law or the PDPL.
- No claim that the entry is registered, submitted, shortlisted or approved.
