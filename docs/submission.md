# Submission materials: Y.3172 Incident Counsel

Drafted 2026-11-03 from the files in this repo. Nothing here has been submitted, registered or uploaded. The operator submits, using `submit.sh`.

Part A is the form text. Part B is the technical report.

---

# Part A. Form text

## Where this goes (unverified)

The final submission channel, URL and fields are **unverified**. `docs/competition.md` says the registration form only gauges interest, that detailed team information is collected later through Google Sheets, and that the final submission route was not found. Do not assume a form. Re-read the event page for the route before the deadline.

Dates as recorded in `docs/competition.md` (read from the event page, to be rechecked): registration open until 5 November 2026, submission deadline 10 November 2026. Time of day and timezone: unverified.

Solo eligibility is **unverified**. The page says a team is a maximum of four people. No minimum and no rule requiring more than one person was found, but a solo entry is also not explicitly allowed. Ask the organisers if it matters.

## Registration fields (from `docs/competition.md`, section "Registration form fields")

**Already done. Do not send this form again.** NEEDS.md records the registration as submitted on 2026-11-03: team Windboy, domain Telecommunications, no teammates. The table below is kept only as a record of the form's fields. The final submission channel is a separate step and is unverified.

The notes say fields marked * are mandatory and that which of the others are required should be confirmed on the live form.

| Field | Answer |
|---|---|
| Name* | [OPERATOR TO FILL] |
| Email* | [OPERATOR TO FILL] |
| Organization* | [OPERATOR TO FILL] |
| Designation* | [OPERATOR TO FILL] |
| Gender (Male, Female, Others, Prefer not to say) | [OPERATOR TO FILL, optional] |
| Team name* | [OPERATOR TO FILL] |
| Team leader* | [OPERATOR TO FILL] |
| Teammate 1, 2, 3 | [OPERATOR TO DECIDE. This is a solo entry, so likely blank. Confirm on the live form.] |
| Use case domain | Telecommunications |

## Title

Y.3172 Incident Counsel

(23 characters.)

## Short description

A rule-driven policy adviser for machine learning in a telecom network. It maps each event to ITU-T Y.3172 nodes, cites verbatim text from four UAE AI documents, and says what they leave open. No model or key needed. Synthetic scenario. Not legal advice.

(about 45 words, about 260 characters.)

## Long description

Y.3172 Incident Counsel is a policy and legal adviser agent for machine-learning functions in a telecom network, built solo for the telecommunications track. It is a prototype.

When an event happens, such as a complaint about an automated throttle, the agent classifies it to ITU-T Y.3172 pipeline nodes (SRC, C, PP, M, P, D, SINK), fires pre-agreed rules that each cite a chunk id and a verbatim quote, and retrieves further passages by BM25 keyed to the node. It then reports what its four documents leave open as "not addressed in the ingested documents", tagged by AI Readiness dimension. Every step is written to a hash-chained audit log that can be exported and checked.

The demo is a synthetic nine-event scenario that follows the event template: a deployment is popular, it causes a controversy, the knowledge base decides the action, a consumer issue escalates to a data-privacy breach, and the knowledge base decides again. The template's example outcomes are tested against the text. Prohibition, consent and oversight referral are partly supported. Purpose limitation is not addressed.

The limits are stated in the app. The knowledge base holds four UAE documents: the AI Strategy 2031, the July 2024 AI Charter, the December 2022 AI Ethics Principles and the government-services adoption guideline. None is telecom sector law, and their wording is "should" or weaker. The Telecom Law and the PDPL exist and were not ingested. No lawyer reviewed the rules. There are no global examples in the knowledge base.

Live: https://itu-ai-for-good-uae.vercel.app
Repository: https://github.com/alexvec/itu-ai-for-good-uae

(about 280 words. The competition notes give no length limits for title, short or long description: unverified. These sizes are conservative guesses. Trim if the form states a limit.)

## Required items checklist (from `docs/competition.md`)

1. Technical report, maximum 5 pages, in the official template. Part B below. The operator moves it into `sources/submission-template.docx` and checks the page count there.
2. GitHub repository: https://github.com/alexvec/itu-ai-for-good-uae
3. Knowledge base containing policies, regulations and strategies: `kb/chunks.json` in the repo, and the live export at `/api/kb.jsonl`.
4. Optional demo video, maximum 7 minutes. Script in `docs/demo-script.md`. Not recorded or uploaded by this build.

---

# Part B. Technical report

Notes for the operator, not part of the report:

- Move this into `sources/submission-template.docx` and check the page count there. Five pages is the limit and it is unchecked. The node table and the policy table carry quotes, so they are the first thing to shrink if it runs over (use shorter slices, still verbatim).
- Quotes below are copied from `data/rules.json` and `data/evidence-map.json`. In the PDF text layer a line break sits inside many quotes. Here each line break is shown as a single space, as the app's evidence export does. Where a table shows part of a quote, it is a contiguous slice. Paste from `/api/evidence.md` if you want the export's exact form.
- Status of gap questions G-01 to G-11 is computed live on `/gaps`. Paste the result into section 8 before submitting.
- The Strategy's cover is said to read "Version | 2018". That line is not in the stored cover OCR (`strategy-p01-c1`), so it is unconfirmed from the repo. Check the PDF. The report only says the body refers to events of 2018, which the stored text does.
- Word count: see the end of Part B.

---

**Y.3172 Incident Counsel: a policy adviser agent for machine learning in a telecom network**

Solo entry by alexvec. Track: Telecommunications. Repository: https://github.com/alexvec/itu-ai-for-good-uae. Live: https://itu-ai-for-good-uae.vercel.app

## 1. Short introduction of the agent

Y.3172 Incident Counsel is a policy and legal adviser agent for machine-learning functions in a telecom network. It is a hackathon prototype and is not legal advice.

When an event happens, the agent classifies it to ITU-T Y.3172 nodes, fires pre-agreed rules that each cite a chunk id and a verbatim quote, retrieves more passages by BM25 keyed to the node, and says what the ingested documents leave open. Each step goes into a hash-chained audit log that can be exported and verified. It needs no model and no API key.

The main limitation comes first. The knowledge base (KB) holds four UAE documents: the AI Strategy 2031, the July 2024 AI Charter, the December 2022 AI Ethics Principles and Guidelines, and the AI Adoption Guideline in Government Services. None is telecom sector law, and the word "telecom" occurs on no page of them. Their wording is "should" or weaker; the Ethics document calls its guidelines non-binding. The Telecom Law (Federal Law by Decree No. 3 of 2003) and the Personal Data Protection Law exist and were not ingested. Rules that use the government-services guideline are marked "by analogy". "Not addressed in the ingested documents" describes four files. It never means UAE law is silent. The Strategy is an older text: its body refers to events of 2018.

## 2. Description of the use case

A licensed telecom operator (synthetic) runs an ML model that predicts congestion and applies automated traffic shaping to service classes. The agent advises the operator's governance lead when something goes wrong. The design personas are that lead and a regulator-side or standards analyst. Neither was interviewed; no operator was consulted.

The evaluation is a synthetic nine-event exercise, "From a popular network model to a data-privacy breach", written for this entry. It describes no real operator, incident or regulator action. Events are released one at a time.

## 3. Requirements of the use case

Functional:

- R1. Ingest real public documents; show URL, date, hash, chunk count and OCR-derived pages.
- R2. Release scenario events one at a time; show the running state.
- R3. Per event: classify to nodes, fire rules with verbatim quotes, retrieve, state what is left open.
- R4. Gap view by Readiness dimension with nearest text, the flag "candidate, needs human legal review", and "no global example in KB".
- R5. Hash-chained audit log, trace view, JSONL export, verify script.
- R6. Free-text events through the same rules.
- R7. Report tables generated from the app's data files.

Non-functional: no credentials needed; "not legal advice" banner; scenarios labelled synthetic; no invented facts.

An optional model (OpenAI-compatible endpoint) may reword the narrative and suggest classes. Its output is logged as "model-generated" and discarded if it adds an article, an unretrieved chunk or an unmatched quotation. It was tested only against a mock.

## 4. Mapping to ITU-T Y.3172

Node wording comes from the reference repository's copy (CrashingGuru/ITUAIReadiness, MIT, `agents/usecase.py`). The Y.3172 text itself was not read. Nodes drive the agent: each event class lists the nodes it touches, retrieval queries once per node, filtered to chunks tagged with that node, and rules and gap questions carry nodes.

| Node | Use case | Readiness dimension | Policy document |
|---|---|---|---|
| SRC | Network elements and subscriber devices produce counters and usage records. | D13 Digital Infrastructure | Ethics, p. 21, `ethics-p21-c2`: "the information generated about the user over the course of their interaction with the system" |
| C | Collectors pull those records, including call-detail data, and set their granularity. | D1 Data/Model Marketplace | Ethics, p. 21, `ethics-p21-c1`: "Establish an oversight mechanism for data collection, storage and processing and use across your organization" |
| PP | The pre-processor joins network and customer records and builds features. | D3 Cross-Domain Correlation Analysis | Ethics, p. 21, `ethics-p21-c1`: "Use measures to enhance privacy such as encryption, anonymization and aggregation." |
| M | The model predicts congestion and is retrained, partly with a vendor. | D9 Impacts of Humans in AI Integration | Ethics, p. 12, `ethics-p12-c2`: "quality checks at least as stringent as those that would be required of a human being taking the same decision." |
| P | The policy node turns predictions into throttling decisions, with human override. | D8 Collaboration with AI | Charter, p. 4, `charter-p04-c1`: "the irreplaceable value of human judgment and human oversight over AI" |
| D | The distributor sends the decision to the right service classes and regions. | D12 Granular Priorities | Ethics, p. 10, `ethics-p10-c2`: "whether AI subjects in the same circumstances receive equal treatment." |
| SINK | Network functions apply the throttle. Subscribers and staff see the effect. | D6 Human Interface | Ethics, p. 15, `ethics-p15-c1`: "AI operators should inform AI subjects when a significant decision affecting them has been made by an AI system." |

Supporting components. MLFO: D7 Strategy Alignment, `strategy-p22-c2`: "the Council will ultimately oversee the implementation of the AI Strategy in the UAE." ML sandbox: D10 AI & Policies, `strategy-p06-c1`: "Governance frameworks will be evaluated by testing them in the UAE’s industry pilots." That is nearest text only. It is not about an ML sandbox.

## 5. Mapping to the ITU AI Readiness Report 2.0

The Report itself was not read. Dimensions and factors come from `dimensions.json` in the reference repository, which cites Report 2.0, January 2026: six factors, 13 dimensions. The node-to-dimension table is also the repository's. I chose one dimension per node from its list for that node. That is my judgement and unreviewed.

The template asks for more than data and model handling:

| Item | Node, dimension | Policy document |
|---|---|---|
| Strategy alignment | MLFO, D7 | Strategy, p. 6, `strategy-p06-c1`: "This does not mean that the UAE will stop working on AI solutions in other sectors where AI can deliver other benefits to society." Telecom is not a listed priority sector, so this rests on a general sentence. |
| Interface design | SINK, D6 | Guideline, p. 40, `guideline-p40-c1` (by analogy): "Designing the UX and UI for the AI use case is also a key step throughout execution to ensure that it gets easily adopted by target users." |
| Collaboration between AI and a human | P, D8 | Ethics, p. 19, `ethics-p19-c1`: "Humanity should retain the power to govern itself and make the final decision, with AI in an assisting role." |

## 6. Requirements mapping to local policies

The 31 pre-agreed rules (PR-01 to PR-31, `data/rules.json`) were drafted in this build. No lawyer has reviewed them. Each cites a chunk id and a verbatim quote. Selected rules:

| Rule: requirement | Source, modal | Quote |
|---|---|---|
| PR-03: treat the throttle as a candidate set of significant-at-scale decisions (by analogy: the source example is a website) | Ethics p. 8, `ethics-p08-c1`; "may be" | "if the website is popular then the AI system may be making a set of significant-at-scale decisions" |
| PR-06: provide a way to challenge a throttling decision | Ethics p. 12, `ethics-p12-c1`; "should provide" | "should provide procedures by which affected AI subjects can challenge a specific decision concerning them." |
| PR-12: do not extend the model to marketing while unassessed | Ethics p. 21, `ethics-p21-c1`; "should not be deployed" | "should not be deployed to the extent of violating internationally and/or UAE’s accepted standards of privacy and human dignity and people rights." |
| PR-11: stop per-subscriber predictions reaching marketing (by analogy) | Guideline p. 48, `guideline-p48-c1`; "should avoid" | "any entity should avoid AI models that are exposing personal data unless there is a matter of public interest and targeted government services outcomes or consent in line with national regulations." |
| PR-14: review consent logging and revocation | Ethics p. 21, `ethics-p21-c1`; "should review" | "AI Operators should review the system for proper consent logging, ability of users to revoke permission whenever applicable." |
| PR-25: refer binding-law questions to human counsel | Charter p. 5, `charter-p05-c1`; no modal | "emphasizes the importance of complying with international treaties and local laws in the development and use of AI." |

No document is described as binding, because none says it is. The agent recommends and never compels.

## 7. Evaluation scenario covering the technical solution and the policy

Synthetic, nine events, released in order.

1. **Deployment.** The model goes live; the policy node throttles a service class with no human in the loop. PR-01 and PR-02 apply: is the operator an "AI operator", and does the "significant decisions" scope gate apply. A human confirms.
2. **Popular.** The model is extended network-wide. PR-03 reclassifies it as a candidate set of significant-at-scale decisions, by analogy.
3. **Controversy.** Subscribers on one low-cost prepaid plan complain and find no way to challenge. PR-04 to PR-10 fire: investigate, test equal treatment, provide a challenge procedure, human reviewers, tell subscribers an AI decided, name who can override, keep human oversight.
4. **The KB decides.** The governance lead asks what to do. The agent orders the pending rules into a corrective-action list. Each action shows its quote and the source's modal verb, such as "could consider" or "should provide".
5. **Escalation.** Call-detail records with identifiers went to an external vendor, per-subscriber predictions reached a marketing dashboard, and no consent record exists. PR-11 to PR-23 fire.
6. **The KB decides again.** A second ordered list, then the template's example outcome tested against the text:

| Template example | Result | What the text supports | What it does not |
|---|---|---|---|
| Prohibits a use | Partly | "should not be deployed" past accepted privacy standards (PR-12); "should avoid" exposing personal data, by analogy (PR-11) | A binding prohibition |
| Requires consent | Partly | Review of consent logging and revocation (PR-14); consent named as an exception, by analogy (PR-11) | A general consent duty on a telecom operator |
| Requires purpose limitation | **Not addressed** | Nothing. Nearest text only: minimum intrusion (PR-13), need-based access (PR-17) | The phrase and the concept as a stated duty are absent |
| Refers the case to an oversight body | Partly | An oversight mechanism inside the organisation and a Data Protection Officer role (PR-15, PR-16) | Referral to any outside body. The Strategy says a Council oversees implementation of the Strategy; it gives no route for referring a case |

7. **Regulator request.** PR-24 keeps traceable records. PR-25 refers the question to human counsel, because the Charter points to local laws and none is in the KB.
8. **Push without sandbox.** PR-26 to PR-28: evaluate against acceptance criteria (by analogy), apply quality checks, test a fall back plan. "Sandbox" occurs in none of the four documents.
9. **Emergency traffic.** PR-29 to PR-31: modify or remove the system, keep shut-down possible, require human verification. "Emergency" occurs in none of them.

The evidence export lists expected nodes beside observed nodes. I wrote the scenario, the rules and the classifier, so agreement would show only that the code does what its author intended. No accuracy figure is reported; the event FAQ says accuracy is not a criterion.

## 8. Policy and standards gaps found by that mapping

All are candidates needing human legal review. None says what UAE law requires.

- **Template outcomes.** Purpose limitation is not addressed in the ingested documents. Prohibition, consent and oversight referral are partly supported (section 7).
- **No telecom sector law in the KB.** Nothing covers licensing, interception or lawful access, a regulator's information request, or traffic management. Questions G-01 to G-11 (`data/controls.json`) test these. The live `/gaps` page lists all eleven as "not addressed in the ingested documents" (checked 2026-11-03). That describes these four documents, not UAE law.
- **Wording strength.** Rules rest on "should", "could consider", "may be" or no modal.
- **No outside referral route.** The text sets up internal oversight only.

**Global examples: a known weakness.** The judging criteria treat global examples as critical and this entry has none. No foreign instrument was ingested and none is written from memory. The gap view shows "no global example in KB". It also discloses that the UAE documents mention some foreign practice in passing, which is not offered as examples because no foreign source was ingested to check it.

**Other limits.** Five pages are OCR-derived (Strategy 1 and 25, Ethics 25, Guideline 36 and 56); no rule rests on them. Free-text classification is keyword matching and can miss a paraphrase. The audit log lives in the browser session; the hash chain makes edits evident but is not tamper-proof, since a recomputed chain could be forged. The AI for Good Sandbox was not used; the KB exports as JSONL in the reference repository's schema.

**Credits.** Taxonomy from CrashingGuru/ITUAIReadiness (MIT, Copyright (c) 2026 Vishnu Ram OV). Ethics Principles and Guidelines: CC BY 4.0, owner the UAE AI and Blockchain Council; no UAE office endorses this entry. Code: MIT.

---

**Word count of the report (title line through section 8).** Approximately 2,150 words including tables. This is a hand estimate by section (about 240 in section 1, 90 in 2, 150 in 3, 370 in 4, 205 in 5, 300 in 6, 470 in 7, 280 in 8), made without a word counter. Expect an error of about 10 percent. Recount in the .docx. The 5-page limit is unchecked.
