# Demo script: Y.3172 Incident Counsel

Target length 6:30 against the event's 7-minute limit for the optional video (`docs/competition.md`), which leaves 30 seconds of margin. Run it on https://itu-ai-for-good-uae.vercel.app. Nothing here has been recorded or uploaded; the operator records, if at all.

Source for the screens: `docs/demo-path.md` and `e2e/demo.spec.ts`. Anything those files do not settle is marked **confirm on screen** and collected at the end. Check each in a dry run and change the words if the screen differs.

Rules for the narrator:

- Say "not addressed in the ingested documents". Never say the law is silent.
- Say each template outcome as the app has it: prohibition partly supported, consent supported, purpose limitation partly supported, oversight referral partly supported. Do not round up.
- Read quotes only as they appear on screen. Do not describe the Data Protection Law, the Data Office decree, the GDPR or the EU AI Act. They were not retrieved.
- Say once at the start and once at the end that the scenario is synthetic.
- Say nothing about eligibility, shortlisting, awards or results.

Before starting, open `/` in a fresh browser session so the audit log starts empty. The log is held in the browser session.

---

## 0:00 to 0:30. The problem (`/`)

Screen: home page, the synthetic label and the running-state line visible.

Say: "A telecom operator runs a machine-learning model that throttles traffic. When something goes wrong, someone has to work out which part of the pipeline is involved, which published rules bear on it, and what those rules do not say. This is a prototype adviser for that job. It is not legal advice, the scenario is synthetic, and no operator was consulted."

Point at the running-state line: no model or key is used.

## 0:30 to 1:15. Real input: the knowledge base (`/kb`)

Screen: `/kb`.

Say: "The knowledge base is nine real documents, retrieved on 2026-11-03: the 2003 Telecom Law, the TDRA Consumer Protection Regulations version 2.0, a 2009 policy on unsolicited communications, four UAE AI documents, and the ITU documents Y.3172 and the AI Readiness Report. Each row has its hash, and the build fails on a mismatch."

Point at the Telecom Law row marked secondary host and the page's note that the Arabic version prevails. Scroll to the attempts table: "These did not open: the Data Protection Law and the Data Office decree returned HTTP 403, and the GDPR and EU AI Act returned an HTTP 202 challenge. I do not say what they require." Press a "verify" button on one quote and show that it is found.

## 1:15 to 1:55. Events 1 and 2: deployment, popular (`/`)

Screen: `/`. Press the release button once per event.

Event 1. Say: "The model goes live and throttles a service class with no human in the loop. The agent classifies the event to Y.3172 nodes and fires rules from the Telecom Law Article 12, the consumer regulations on speed restrictions, and the Subscriber Information definition."

Event 2. Say: "The deployment is popular and is extended network-wide. Rule PR-03 says a popular system may be making significant-at-scale decisions. The source example is a website, so the screen marks it as an analogy."

## 1:55 to 2:35. Event 3: controversy (`/`)

Say: "Subscribers on one low-cost prepaid plan complain. Care proposes an AI chatbot for the complaints, and an outside auditor asks for each subscriber's usage records. Complaint rules from the consumer regulations Article 26 and Telecom Law Article 30 fire, and rule TL-11 fires on the chatbot." Open one rule and show its quote with chunk id.

## 2:35 to 3:35. Event 4: the knowledge base decides under PA-01 (`/`)

Screen: release event 4. The decision card shows two conflicts, each marked as settled by PA-01.

Say: "Two sources now pull different ways. The agent does not improvise. A rule I wrote before the run, PA-01, decides. It is my design choice, for legal review, and not a statement of UAE legal hierarchy: law or regulation outranks regulator policy, then national guidance, then framework documents."

C-01. Say: "The Strategy sets an objective to adopt AI across customer services. The consumer regulations, 26.7.2, preclude non-human agents in conversations about consumer complaints. The regulation outranks the guidance, so no AI chatbot in those conversations. The objective never mentions complaints, so this is general against specific."

C-02. Say: "The Ethics document says external auditing should be used for critical decisions. The regulations, 24.6, say a Licensee must obtain prior consent before sharing Subscriber Information with third parties not directly involved. The regulation wins: consent first, unless a person finds another ground. The audit itself is not ruled out."

## 3:35 to 4:20. Events 5 and 6: escalation, then the knowledge base decides (`/`)

Event 5. Say: "The consumer issue becomes a data-privacy breach. Call-detail records with identifiers went to a vendor for training, predictions reached a marketing dashboard, and there is no consent record." Article 24 of the regulations fires.

Event 6. Say: "The knowledge base decides again. Here are the template's outcomes as the text has them." Scroll to the outcomes table:

- Prohibits a use: partly supported. A bar on sharing without consent and on interconnection data. No bar on a Licensee's own use for marketing or training was found.
- Requires consent: supported by 24.6 and the 2009 policy, but not as a rule for ML training.
- Requires purpose limitation: partly supported, for involved third parties and interconnection data. No general duty on a Licensee's own use.
- Refers the case to an oversight body: partly supported. The law names the Authority and a consumer can take a dispute to the TDRA. No duty to report a breach to any body was found.

Say: "Article 24.1 says the Data Protection Law prevails on any inconsistency. That law was not retrieved, so these answers go to counsel. This is what the ingested documents say, not what UAE law requires."

## 4:20 to 4:40. Events 7 to 9, fast (`/`)

Release events 7, 8 and 9. Pause a moment on each headline.

Say: "A regulator request: the agent points to the records and information duties. A push to production without sandbox testing: Y.3172 describes a sandbox but is voluntary, and no UAE text in the knowledge base requires one. Emergency numbers affected: the one duty found is scoped to dunning, so it is read by analogy only."

## 4:40 to 5:00. Free text (`/free-text`)

Type: "A law enforcement request asks for stored communications metadata that the pre-processor has already transformed."

Say: "The same rules run on text I type. Classification is keyword matching and can miss a paraphrase." The result says "not addressed in the ingested documents" for the ML pipeline question (checked by `e2e/demo.spec.ts`).

## 5:00 to 5:20. Gaps (`/gaps`)

Say: "Gaps are grouped by Readiness dimension, each flagged 'candidate, needs human legal review' with the nearest text. The page says: no global example in KB. That is a known weakness. I did not write any from memory."

## 5:20 to 5:50. Evidence and why Y.3172 makes it work (`/evidence`)

Screen: the node table, SRC to SINK, then the strategy alignment, interface design and collaboration rows, then PA-01 and the outcomes.

Say: "This is the table the template asks for: one row per Y.3172 node with the use case, one Readiness dimension and one policy document. It is generated from the same data the app runs on. The Y.3172 nodes are what make the agent work: an event is classified to nodes first, retrieval and rules are keyed by node, and the Readiness dimensions tag every finding. I read Y.3172 and the Readiness report only in part, the node-to-dimension table comes from the reference repository, and I did not use the AI for Good Sandbox."

## 5:50 to 6:10. Audit (`/audit`)

Press verify and show VERIFIED. Press the tamper button and show FAILED.

Say: "Every step is in a hash-chained log. A one-byte edit is detected. It is not tamper-proof: someone who recomputes the chain could forge it, so keep the head hash elsewhere. The log can be exported and checked offline with the verify script."

## 6:10 to 6:30. Who pays, what is next

Say: "Who pays is an unvalidated hypothesis: compliance and network-governance teams at operators, or a regulator or standards body testing how rules cope with machine learning. I have no customer, price or market figure. Next: a lawyer reviews the rules and PA-01; I retrieve the Data Protection Law and foreign texts so the gap view can show real global examples; and I test the optional model, which has only been tried against a mock. The scenario was synthetic. The repository is github.com/alexvec/itu-ai-for-good-uae and the live site is itu-ai-for-good-uae.vercel.app."

---

## Confirm on screen (collected)

1. Home page: the exact wording and position of the synthetic label and the running-state line (the test expects "No model or key is used").
2. `/kb`: the wording of the limits banner and the secondary-host note, and the exact label on the quote "verify" button.
3. Event 1: which nodes highlight, and which rules appear (documented only as Article 12, CPR 5.5 and the Subscriber Information definition).
4. Event 3: how many rules fire and the wording of the TL-11 entry.
5. Event 4: the layout of the two conflict cards and the wording of "settled by PA-01".
6. Event 6: the wording and order of the outcome rows, and where the Data Protection Law note appears.
7. Events 7 to 9: what each headline says, and that the release button is disabled after event 9.
8. `/free-text`: the exact placeholder and result wording, and what else the stored-metadata example fires beyond "not addressed in the ingested documents".
9. `/gaps`: which gap questions show as not addressed, and the wording of the global-example note.
10. `/audit`: the exact VERIFIED and FAILED lines and button labels.
11. Total running time on a dry run, against the 7-minute limit.

## Not shown, on purpose

- No accuracy number, score or performance claim.
- No foreign example.
- No statement of what the Data Protection Law, the Data Office decree, the GDPR or the EU AI Act require.
- No claim that the entry is shortlisted, approved or awarded.
