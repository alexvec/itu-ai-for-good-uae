# Slide outline: Y.3172 Incident Counsel

Ten slides, one per `---` section, to export to PDF from any Markdown or slide tool. Nothing here has been uploaded or submitted. Slide text uses only facts in this repo. Speaker notes sit under each slide.

Image rule: for a profile, team or cover photo use the file `/Users/alex/Documents/GitHub/hackathon-ops/operator-assets/avatar.jpg` and no other picture. Do not generate an image of the operator. Do not draw a graphic that looks like a screenshot. Real screenshots of the live site are fine if the operator takes them.

---

## Slide 1. Title

**Y.3172 Incident Counsel**

A policy and legal adviser agent for machine learning in a telecom network.

ITU AI for Good Lab Hackathon, United Arab Emirates. Track: Telecommunications.

Team Windboy. Built by Alex Veciana Belmonte.

Photo (if the template has a slot): `/Users/alex/Documents/GitHub/hackathon-ops/operator-assets/avatar.jpg`

Live: https://itu-ai-for-good-uae.vercel.app
Repo: https://github.com/alexvec/itu-ai-for-good-uae

Footer: Prototype. Not legal advice. Synthetic scenario.

Notes: say that this is one person's prototype. Do not say anything about eligibility, shortlisting or results.

---

## Slide 2. The job

When an ML model in a network goes wrong, someone has to work out:

- which part of the pipeline is involved
- which published rules bear on it
- what those rules do not say

The user is a design persona: a governance lead at a licensed operator. No operator or user was consulted.

Notes: do not claim demand.

---

## Slide 3. What the agent does

1. Classifies each event to ITU-T Y.3172 nodes (SRC, C, PP, M, P, D, SINK)
2. Fires pre-agreed rules, each with a chunk id and a verbatim quote, with an action no stronger than the quote
3. Settles conflicts between sources by a rule written before the run (PA-01), with both quotes shown
4. Says "not addressed in the ingested documents" for what the text leaves open, tagged by Readiness dimension
5. Writes every step to a hash-chained audit log

No model. No API key.

Notes: the optional model was only tested against a mock and is not used in the demo.

---

## Slide 4. The knowledge base is real, and its limits are stated

Nine documents retrieved on 2026-11-03, each with a SHA-256 the build checks:

- Telecom: the 2003 Telecom Law, the TDRA Consumer Protection Regulations v2.0 (2023), a 2009 TRA policy on unsolicited communications
- UAE AI guidance: Strategy 2031, July 2024 Charter, December 2022 Ethics Principles, a government-services guideline (by analogy only)
- Framework: ITU-T Y.3172 and the AI Readiness Report 2.0, each read only in part

Not retrieved: the Data Protection Law (HTTP 403), the Data Office decree (HTTP 403), the GDPR and the EU AI Act (HTTP 202 challenge).

Notes: the Telecom Law is an English text on WIPO Lex, a secondary host. It says the Arabic version prevails. Its footnotes show only a 2005 amendment, and its in-force status was not checked. The CPR file lists annexes it does not contain. CPR 24.1 puts Article 24 behind the Data Protection Law, which was not read. Do not say what the unretrieved texts require.

---

## Slide 5. Mapping to ITU-T Y.3172 and AI Readiness

One row per node, from `data/evidence-map.json`:

| Node | Readiness dimension | Policy document |
|---|---|---|
| SRC | D13 Digital Infrastructure | CPR 2.1.31 |
| C | D1 Data/Model Marketplace | CPR 24.6 |
| PP | D3 Cross-Domain Correlation Analysis | CPR 24.4 |
| M | D9 Impacts of Humans in AI Integration | Ethics 3.2.2.2(i) |
| P | D10 AI & Policies | Telecom Law Art. (30) |
| D | D12 Granular Priorities | CPR 5.5.6 |
| SINK | D6 Human Interface | CPR 26.7.2 |

Also: strategy alignment, interface design, and collaboration between AI and a human.

Notes: the node-to-dimension table is the reference repository's (CrashingGuru/ITUAIReadiness, MIT) plus the author's unreviewed choice, because the Report has none. The M row keeps an Ethics sentence because no telecom text speaks to model training. The sandbox row is weak: no UAE text in the KB mentions a sandbox, and the AI for Good Sandbox was not used.

---

## Slide 6. Popular, then controversy

Synthetic scenario, nine events released one at a time.

1. Deployment: the model throttles a service class with no human in the loop
2. **Popular:** extended network-wide. PR-03, by analogy: the Ethics example is a website
3. **Controversy:** a low-cost prepaid plan complains. Care proposes an AI chatbot. An outside auditor asks for each subscriber's usage records

Notes: show the live site here. Say that the scenario is invented and is not evidence of coverage.

---

## Slide 7. The knowledge base decides: PA-01

PA-01 was written before the run. It is a design choice, for human legal review, and not UAE legal hierarchy: law or regulation outranks regulator policy, then national guidance, then framework documents.

- C-01: Strategy objective to adopt AI across customer services against CPR 26.7.2, which precludes non-human agents in complaint conversations. The CPR wins: no AI chatbot there.
- C-02: Ethics external auditing against CPR 24.6, prior consent before sharing Subscriber Information. The CPR wins: consent first, unless a person finds another ground. The audit itself is not ruled out.

Notes: C-01 is general against specific, and the objective never mentions complaints. C-02 conflicts only if the audit needs Subscriber Information. Both quotes are on screen in the app.

---

## Slide 8. Escalation: consumer issue to data-privacy breach

Call-detail records with identifiers went to a vendor for training, predictions reached a marketing dashboard, and no consent record exists. The template's outcomes, as the text has them:

| Outcome | Status |
|---|---|
| Prohibits a use | partly supported |
| Requires consent | supported |
| Requires purpose limitation | partly supported |
| Refers the case to an oversight body | partly supported |

Each row carries what the text does not support, for example no duty to report a breach to any body was found.

Notes: do not round up. "Not addressed in the ingested documents" describes nine files and never means UAE law is silent. Gaps are candidates for human legal review. No lawyer reviewed the rules or PA-01.

---

## Slide 9. Auditability and known weaknesses

- Every input, class, rule, query and quote check is logged, hash-chained, exportable, and verifiable in the app or with `node scripts/verify-audit.ts`. Change one byte and verification fails.
- The log detects edits but is not tamper-proof, and lives in the browser session.
- **No global example in KB.** The GDPR and EU AI Act were not retrieved. None is written from memory.
- Rules were drafted in this build, with no lawyer review.
- Free-text classification is keyword matching.
- Expected and observed nodes were written by the same author. This is not a performance result. No accuracy figure is reported.

Notes: say these before being asked. Earlier events in this series (Saudi Arabia, Kenya) are different events with four criteria. Citation checks and hash-chained logs are not unique to this entry, so do not present them as differentiators.

---

## Slide 10. Who pays, and what is next

**Who pays:** an unvalidated hypothesis, not evidence of demand. Operator compliance and network-governance teams, or a regulator or standards body testing how rules cope with ML in a network. No price, customer or market figure.

**Next (intentions):**

- Lawyer review of the rules and PA-01
- Retrieve the Data Protection Law, the Data Office decree and foreign texts for real global examples
- Test the optional model against a real endpoint
- Load the KB into the Sandbox (the export is in the reference JSONL schema)

Live: https://itu-ai-for-good-uae.vercel.app
Repo: https://github.com/alexvec/itu-ai-for-good-uae

Credits: reference repo CrashingGuru/ITUAIReadiness (MIT). Ethics Principles CC BY 4.0, UAE AI and Blockchain Council. No UAE office, TDRA or ITU endorses this entry.
