# Slide outline: Y.3172 Incident Counsel

Ten slides. Export to PDF from any Markdown or slide tool (for example, one slide per `---` section). Nothing here has been uploaded or submitted. Slide text is facts from the repo only. Speaker notes are under each slide.

Image rule: the only picture of the operator is `/Users/alex/Documents/GitHub/hackathon-ops/operator-assets/avatar.jpg`. Use that file where a profile or cover photo is needed. Do not generate any other picture of the operator. Do not use a screenshot-lookalike graphic. Real screenshots of the live site are fine if the operator takes them.

---

## Slide 1. Title

**Y.3172 Incident Counsel**

A policy and legal adviser agent for machine learning in a telecom network.

ITU AI for Good Lab Hackathon, United Arab Emirates. Track: Telecommunications.

Solo entry by alexvec. Profile image: `/Users/alex/Documents/GitHub/hackathon-ops/operator-assets/avatar.jpg`

Live: https://itu-ai-for-good-uae.vercel.app
Repo: https://github.com/alexvec/itu-ai-for-good-uae

Footer: Prototype. Not legal advice. Synthetic scenario.

Notes: say plainly that this is one person's prototype.

---

## Slide 2. The problem

When an ML model in a network goes wrong, someone has to work out:

- which part of the pipeline is involved
- which published rules bear on it
- what those rules do not say

The job is hypothetical here: the personas are a governance lead at an operator and a regulator-side analyst. Neither was interviewed. No operator was consulted.

Notes: do not claim demand.

---

## Slide 3. What the agent does

1. Classifies the event to ITU-T Y.3172 nodes (SRC, C, PP, M, P, D, SINK, plus MLFO and sandbox)
2. Fires pre-agreed rules, each with a chunk id and a verbatim quote
3. Retrieves more passages with BM25, keyed to the node
4. Says "not addressed in the ingested documents" where the text is silent, tagged by AI Readiness dimension
5. Writes every step to a hash-chained audit log

No model. No API key.

Notes: the optional model only rewords and suggests classes, is logged separately as "model-generated", and was tested only against a mock.

---

## Slide 4. The knowledge base, and its limit

Four UAE documents, retrieved 2026-11-03, 196 chunks, hashes checked at build:

- AI Strategy 2031
- AI Charter, July 2024
- AI Ethics Principles and Guidelines, December 2022
- AI Adoption Guideline in Government Services (applied to telecom by analogy only)

**None is telecom sector law.** The word "telecom" occurs on no page of them. Wording is "should" or weaker. The Telecom Law and the PDPL exist and were not ingested.

Notes: this is the main limitation, so say it before a judge finds it. The Strategy's body refers to events of 2018; do not present it as a recent text.

---

## Slide 5. Mapping to ITU-T Y.3172 and the Readiness dimensions

Table, one row per node, from `data/evidence-map.json`:

| Node | Readiness dimension | Policy document, chunk id |
|---|---|---|
| SRC | D13 Digital Infrastructure | Ethics, `ethics-p21-c2` |
| C | D1 Data/Model Marketplace | Ethics, `ethics-p21-c1` |
| PP | D3 Cross-Domain Correlation Analysis | Ethics, `ethics-p21-c1` |
| M | D9 Impacts of Humans in AI Integration | Ethics, `ethics-p12-c2` |
| P | D8 Collaboration with AI | Charter, `charter-p04-c1` |
| D | D12 Granular Priorities | Ethics, `ethics-p10-c2` |
| SINK | D6 Human Interface | Ethics, `ethics-p15-c1` |

Notes: node wording and the 13 dimensions come from the reference repo CrashingGuru/ITUAIReadiness (MIT). The Readiness Report itself was not read. The dimension per node is the builder's choice from the repo's list.

---

## Slide 6. The scenario: popular, controversy, KB decides

Synthetic, nine events, released one at a time.

1. Deployment: model throttles a service class, no human in the loop
2. **Popular:** extended network-wide. PR-03 reclassifies it as significant-at-scale decisions, by analogy
3. **Controversy:** one prepaid plan complains; no way to challenge
4. **KB decides:** ordered corrective actions, each with a verbatim quote and the source's own modal verb
5. Escalation: subscriber data exported to a vendor and a marketing dashboard
6. **KB decides again**
7. to 9. Regulator request, push without sandbox, emergency traffic affected

Notes: show the live site here. Follow `docs/demo-script.md`.

---

## Slide 7. What the text supports, and what it does not

The template's example outcome, tested against the four documents:

| Outcome | Result |
|---|---|
| Prohibits a use | Partly supported. Not a binding prohibition |
| Requires consent | Partly supported. Not a general consent duty on an operator |
| Requires purpose limitation | **Not addressed in the ingested documents** |
| Refers the case to an oversight body | Partly supported. Internal oversight and a Data Protection Officer role; no route to an outside body |

"Not addressed" describes four files. It does not mean UAE law is silent.

Notes: do not round these up. Gaps are candidates needing human legal review. No lawyer reviewed the rules.

---

## Slide 8. Auditability

- Every input, class, rule fired, query, chunk id with score and quote check is logged
- Hash-chained; export as JSONL; verify in the app or with `node scripts/verify-audit.ts`
- Change one byte, and verification fails
- Limit: it detects edits, it is not tamper-proof. Keep the head hash elsewhere. The log lives in the browser session

Notes: with no model there is no hidden reasoning to show; the trace is the structured record.

---

## Slide 9. Known weaknesses

- **No global examples.** The gap view shows "no global example in KB". No foreign instrument was ingested and none is written from memory. The UAE documents mention some foreign practice in passing; the page discloses this
- Rules drafted in this build, not reviewed by a lawyer
- Free-text classification is keyword matching and can miss a paraphrase
- Five pages are OCR-derived; no rule rests on them
- Sandbox not used; the KB exports as JSONL in the reference schema
- Expected and observed nodes were written by the same author, so this is not a performance result. No accuracy figure is reported

Notes: say these before being asked.

---

## Slide 10. Who pays, and what is next

**Who pays:** an unvalidated hypothesis, not evidence of demand. Operator compliance and network-governance teams, or a regulator or standards body testing how rules cope with ML in a network. No price, customer or market figure.

**Next (intentions):**

- Lawyer review of the rules
- Ingest the Telecom Law and the PDPL
- Add foreign instruments for real global examples
- Test the optional model against a real endpoint
- Load the KB into the Sandbox

Live: https://itu-ai-for-good-uae.vercel.app
Repo: https://github.com/alexvec/itu-ai-for-good-uae

Credits: reference repo CrashingGuru/ITUAIReadiness (MIT). Ethics Principles and Guidelines CC BY 4.0, owner the UAE AI and Blockchain Council; no UAE office endorses this entry.
