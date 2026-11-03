# Submission materials: Y.3172 Incident Counsel

Drafted 2026-11-03 from the files in this repo. Nothing here has been submitted, uploaded or posted, and registration has not been sent again. The operator submits.

Part A is the form text. Part B is the technical report, which `node scripts/build-report.mjs` fills into the official template.

---

# Part A. Form text

## Status and what is unverified

- **Registration is already done.** NEEDS.md records it as sent on 2026-11-03: team Windboy, leader Alex Veciana Belmonte, domain Telecommunications, no teammates. Do not send the registration form again.
- **Final submission channel, URL and fields: unverified.** `docs/competition.md` says the registration form only gauges interest, that detailed team information comes later through Google Sheets (fields unknown), and that no final submission route was found. Re-read the event page for the route.
- Deadline as read from the event page: 10 November 2026. Time of day and timezone: unverified.
- Solo eligibility: unverified. The page gives a maximum of four people and no minimum, and does not say a team of one is allowed.
- Length limits for title, short description and long description: none found in `docs/competition.md`, so the sizes below are conservative guesses. Trim if the form states a limit.

## Title

Y.3172 Incident Counsel

## Short description

A policy adviser agent for machine learning in a telecom network. It classifies each event to ITU-T Y.3172 nodes, answers from verbatim UAE telecom and AI text with chunk ids, settles conflicts by a pre-agreed rule, and logs every step in a hash chain. No model or key. Synthetic scenario. Not legal advice.

(About 300 characters.)

## Long description

Y.3172 Incident Counsel is a policy and legal adviser agent for machine-learning functions in a telecom network, built by one person for the telecommunications track. It is a prototype and not legal advice.

For each event in a synthetic nine-event scenario, the agent classifies it to ITU-T Y.3172 nodes (SRC, C, PP, M, P, D, SINK), fires pre-agreed rules that each cite a chunk id and a verbatim quote, and says what the documents leave open as "not addressed in the ingested documents". When two sources pull different ways, a rule written before the run (PA-01, the author's design choice) decides, with both quotes on screen. Every step goes into a hash-chained audit log that can be exported and verified. It needs no model and no API key.

The knowledge base holds nine documents retrieved on 2026-11-03, each with a SHA-256 that the build checks: the 2003 Telecom Law (English text on a secondary host; the Arabic version prevails), the TDRA Consumer Protection Regulations v2.0, a 2009 TRA policy on unsolicited communications, four UAE AI guidance documents, ITU-T Y.3172 and the ITU AI Readiness Report 2.0.

The scenario follows the official template: a popular deployment, a controversy, the knowledge base deciding, a consumer issue that escalates to a data-privacy breach, and the knowledge base deciding again. The template's example outcomes come out as prohibition partly supported, consent supported, purpose limitation partly supported and oversight referral partly supported, each with its stated limit.

Limits: the Data Protection Law, the Data Office decree, the GDPR and the EU AI Act were not retrieved. There is no global example in the knowledge base. No lawyer reviewed the rules. No accuracy figure is reported.

Live: https://itu-ai-for-good-uae.vercel.app
Repository: https://github.com/alexvec/itu-ai-for-good-uae

(About 290 words.)

## Required items (from `docs/competition.md`)

1. Technical report, maximum 5 pages, in the official template. Part B below, built into `docs/technical-report.docx`. The page count is measured separately after the build and is not stated here.
2. GitHub repository: https://github.com/alexvec/itu-ai-for-good-uae
3. Knowledge base containing policies, regulations and strategies: `kb/chunks.json` in the repository, and the live export at `/api/kb.jsonl`.
4. Optional demo video, maximum 7 minutes. Script in `docs/demo-script.md`. Not recorded or uploaded by this build.

---

# Part B. Technical report

Notes for the operator, not part of the report:

- `node scripts/build-report.mjs` reads from the title line below to the first horizontal rule after section 1. Keep the eight section headings and the node table's rows (SRC, C, PP, M, P, D, SINK).
- Quote fragments are copied from `data/rules.json` and `data/conflicts.json`. Each sits inside one line of its source, so no line break is lost.
- Section 6 was cut to two rules to keep to the page limit. The full rule table is at `/evidence` and `/api/evidence.md`.
- The page count is unmeasured here. Measure it with `node scripts/measure-report.mjs`, and trim table quotes first if it runs over.

**Y.3172 Incident Counsel: a policy adviser agent for machine learning in a telecom network**

## 1. Short introduction of the agent

Y.3172 Incident Counsel is a policy and legal adviser agent for machine-learning functions in a telecom network. It is a one-person hackathon prototype and not legal advice. For each event it classifies the event to ITU-T Y.3172 nodes, fires pre-agreed rules that cite a chunk id and a verbatim quote, settles conflicts between sources by a rule agreed beforehand (PA-01), says what the documents leave open, and logs every step in a hash chain. No model or key is used; an optional model was only mock-tested.

## 2. Description of the use case

A synthetic licensed operator runs an ML model that predicts congestion; a policy node throttles service classes. The agent advises the governance lead. No operator or user was consulted.

The knowledge base (KB) has nine documents retrieved on 2026-11-03. Telecom: the 2003 Telecom Law (English text on WIPO Lex, a secondary host; it says the Arabic version prevails; its footnotes show only a 2005 amendment; in-force status not checked), the TDRA Consumer Protection Regulations v2.0, 2023 (CPR; annexes absent) and a 2009 TRA policy on unsolicited communications. UAE AI guidance: Strategy 2031, 2024 Charter, 2022 Ethics Principles, and a government-services guideline used by analogy only. Framework: Y.3172 and the Readiness Report 2.0, each read only in part.

## 3. Requirements of the use case

- Ingest real public documents; show hashes and every failed retrieval.
- Release events one at a time, with nodes, verbatim quotes and what is not addressed.
- Settle source conflicts by a stated precedence rule, both quotes shown.
- Tag candidate gaps by Readiness dimension; keep a hash-chained audit log; need no credentials.

## 4. Mapping to ITU-T Y.3172

Retrieval and rules are keyed by node. Telecom text leads; the M row keeps an Ethics sentence because no telecom text speaks to model training.

| Node | Use case | Readiness dimension | Policy document |
|---|---|---|---|
| SRC | Elements and devices produce usage records. | D13 Digital Infrastructure | CPR 2.1.31, `cpr-p09-c1`: "“Subscriber Information” means - any personal data" |
| C | Collectors pull the records. | D1 Data/Model Marketplace | CPR 24.6, `cpr-p60-c2`: "Licensees must obtain a Subscriber’s prior consent" |
| PP | Records are joined into features. | D3 Cross-Domain Correlation Analysis | CPR 24.4, `cpr-p59-c5`: "Licensees shall use reliable security measures" |
| M | The model predicts congestion; a vendor retrains it. | D9 Impacts of Humans in AI Integration | Ethics 3.2.2.2, `ethics-p12-c2`: "should subject AI systems informing significant decisions to quality checks" |
| P | Predictions become throttling, with human override. | D10 AI & Policies | Telecom Law Art. (30), `law-p15-c4`: "ensure non-discrimination when providing such services" |
| D | Decisions go to service classes and regions. | D12 Granular Priorities | CPR 5.5.6, `cpr-p22-c2`: "restrictions on the speed of data transfer" |
| SINK | The throttle is applied; subscribers see it. | D6 Human Interface | CPR 26.7.2, `cpr-p65-c5`: "preclude the use of non-human agents" |

The sandbox row is weak: no UAE text in the KB mentions a sandbox, and its only quote is the voluntary Y.3172, "An ML sandbox is an isolated domain" (`y3172-p21-c3`). The AI for Good Sandbox was not used.

## 5. Mapping to the ITU AI Readiness Report 2.0

Dimension names are read from the Report, which has no per-node table. The node assignment is the reference repository's (CrashingGuru/ITUAIReadiness, MIT) plus my unreviewed choice. Beyond data and models:

| Item | Node, dimension | Policy document |
|---|---|---|
| Strategy alignment | MLFO, D7 | Strategy, `strategy-p06-c1`: "stop working on AI solutions in other" (sectors); telecom is not named |
| Interface design | SINK, D6 | CPR 26.2, `cpr-p64-c8`: "The Licensee’s procedures shall be user-friendly" |
| Collaboration between AI and a human | P, D8 | Ethics 3.6.2.3, `ethics-p19-c1`: "Humanity should retain the power to govern itself and make the final decision," |

## 6. Requirements mapping to local policies

The rules in `data/rules.json` were drafted in this build; no lawyer reviewed them. A code check keeps each action no stronger than its quote.

| Rule: requirement | Source, modal, chunk | Quote |
|---|---|---|
| TL-11: no AI chatbot in complaint talks | CPR 26.7.2, preclude, `cpr-p65-c5` | "preclude the use of non-human agents by Licensees in" |
| TL-13: purpose limit, involved third parties | CPR 24.9, required, `cpr-p60-c5` | "required for the purposes of providing the telecommunication service." |

CPR 24.1 (`cpr-p59-c2`) subordinates Article 24 to the Data Protection Law: "DPL shall prevail to the extent necessary to remove any such inconsistency." That law returned HTTP 403 and was not retrieved, so every Article 24 answer depends on a text not read. The Data Office decree (HTTP 403), the GDPR and the EU AI Act (HTTP 202 challenge) were also not retrieved. Nothing here says what they require.

## 7. Evaluation scenario covering the technical solution and the policy

Synthetic, written for this entry, nine events released one at a time. It is not evidence of coverage.

1. Deployment: the model throttles a service class with no human in the loop. Law Art. (12), CPR 5.5 and the Subscriber Information definition fire.
2. Popular: extended network-wide. PR-03: a popular system may be making significant-at-scale decisions; the Ethics example is a website, so by analogy.
3. Controversy: a low-cost prepaid plan complains. Care proposes an AI chatbot, and an outside auditor asks for each subscriber's usage records. Conflicts C-01 and C-02 arise.
4. The KB decides under PA-01, written before the run. It is my design choice for legal review, not UAE legal hierarchy: law or regulation outranks regulator policy, then national guidance, then framework, rank read from each document's own text. C-01: Strategy "ADOPT AI ACROSS CUSTOMER" (services) against CPR 26.7.2 "preclude the use of non-human agents". The CPR wins: no AI chatbot in these complaint conversations (general against specific; the objective never mentions complaints). C-02: Ethics "should be used as a means" (external audit) against CPR 24.6 "Licensees must obtain a Subscriber’s prior consent". The CPR wins: consent first unless a person finds another ground; the audit itself is not ruled out.
5. Escalation from a consumer issue to a data-privacy breach: call-detail records with identifiers went to a vendor for training, predictions reached a marketing dashboard, and no consent record exists. CPR Article 24 fires.
6. The KB decides again. The template's outcomes, as the text has them:

| Template outcome | Status | Supported by | Not supported |
|---|---|---|---|
| Prohibits a use | partly supported | CPR 24.6; 24.7 (interconnection data, marketing included); Law Art. (72) | A bar on a Licensee's own use for marketing or training: none found |
| Requires consent | supported | CPR 24.6; 2009 policy 5.5 | A consent rule for ML training; the unread Data Protection Law prevails on inconsistency (24.1) |
| Requires purpose limitation | partly supported | CPR 24.9; 24.7 | A general duty on a Licensee's own use: phrase absent from the telecom text |
| Refers the case to an oversight body | partly supported | Law Art. (12); TDRA consumer dispute (26.16); TDRA request (24.11) | A duty to report a breach to any body: none found |

Events 7 to 9: regulator request (CPR 3.9, 24.11; Law Art. (71)); push without sandbox (Y.3172 only, no UAE text); emergency numbers (CPR 22.4, scoped to dunning, by analogy).

Expected nodes, written by me and hidden from the agent, sit beside observed nodes. I wrote the rules and classifier too, so agreement shows only that code matches intent, not performance. No accuracy figure is reported.

## 8. Policy and standards gaps found by that mapping

All are candidates for human legal review. "Not addressed in the ingested documents" describes these nine files only; it does not mean UAE law is silent.

- Purpose limitation and training: no general duty on a Licensee's own use, and no telecom rule specific to training a model on Subscriber Information, was found.
- Breach: no duty to report a breach to any body was found (TL-23); the Data Protection Law and Data Office decree are unread.
- ML: the Telecom Law text does not mention it (TL-01); no telecom text covers ML change control or a sandbox.
- Global examples: no global example in KB, a known weakness since the criteria treat them as critical.

Other limits: no lawyer reviewed the rules or PA-01. Free-text classification is keyword matching. The audit log lives in the browser session and detects edits but is not tamper-proof. Credits: reference repository MIT; Ethics Principles CC BY 4.0 (UAE AI and Blockchain Council). No authority endorses this entry.

---

**Word count of Part B (title line through the last paragraph of section 8): 1,353.** Counted with ripgrep (Grep tool) as tokens containing at least one letter or digit, over a copy of Part B alone, so table pipes, separator rows and bullet markers are excluded and headings, table cells and chunk ids are included. The tail of the match list was read at offsets to get the total. Microsoft Word counts differently and may differ by a few percent. The page count is not stated here; it is measured separately after the build.
