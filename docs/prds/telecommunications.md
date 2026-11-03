# PRD: Telecommunications (CHOSEN)

Working title: Y.3172 Incident Counsel. Status: ready to build. Owner: alexvec, solo.

## Amendments (2026-11-03)

This PRD predates the source pack. CLAUDE.md and the operator's brief of 2026-11-03 override it where they differ. The text below these amendments is unchanged and is superseded where listed here.

1. **KB contents (section 6 superseded).** Exactly four files: the UAE AI Strategy 2031, the July 2024 AI Charter, the December 2022 AI Ethics Principles and the government-services adoption guideline, each checked against `sources/README.md` at build time. The submission template is not chunked.
2. **Removed from the KB.** No Telecom Law, no PDPL, no u.ae pointer pages, no repo reference texts, no other fetched documents. No article, provision or quote from them appears in the product. References below to Telecom Law provisions, articles or data pages do not apply.
3. **Wording of absence (R3, section 5).** "Text silent" is replaced by "not addressed in the ingested documents". The product must not imply UAE telecom law is silent. It states that the KB has no binding telecom sector law, that the Telecom Law and PDPL exist and were not ingested, and that the guideline is applied to telecom by analogy. No document is called binding unless its text says so. None does. The silence test on "binding instruments" is replaced by a check that a control's terms occur in the ingested text.
4. **Global examples (R4).** None are treated as being in the KB. The gap view shows "no global example in KB". None are written from memory.
5. **Scenarios (section 7).** Scenario A is rebuilt as the template's numbered sequence: deployment, popular, controversy, KB decides, escalation from a consumer issue to a data-privacy breach, KB decides, then follow-on events carrying the regulator request, the push without sandbox and the emergency traffic. Scenario B is dropped, because it was built on Telecom Law provisions. Corrective actions follow pre-agreed rules in `data/rules.json`, each citing a chunk id and a verbatim quote. Template outcomes the text does not support are shown as not addressed.
6. **Evidence (R7).** The export is the template's table: one row per node in the order SRC, C, PP, M, P, D, SINK, with use case, one Readiness dimension and one policy document with chunk id, plus strategy alignment, interface design and collaboration between AI and a human.
7. **Framework data (section 3).** The node and dimension mapping comes from `simulation/server/agents/usecase.py` in the reference repo (the PRD's path `agents/usecase.py` is short by two folders), used as taxonomy with the licence notice kept. It is not KB content.
8. **Chunking (section 3, section 6).** The documents have no articles. Chunks split on pages first, then to about 256 words with about 30 overlap on line boundaries. Citations give PDF page and heading. Article field is null.
9. **Non-functional (N2, section 8, section 12).** The Arabic-prevails caveat applied to the Telecom Law, which is not ingested, so it is dropped from the banner. No accuracy number, and no invented names, metrics, testimonials, outcomes, operators or incidents.

## 1. User

A governance, risk or regulatory-affairs lead at a licensed telecom operator in the UAE who is accountable for machine-learning functions running inside the network (anomaly detection, traffic management, customer-impact prediction). Secondary user: a regulator-side or standards analyst reviewing how a sector law copes with ML in the network. Both are personas for design; none has been interviewed and no operator has been consulted.

## 2. Job to be done

When something happens in an ML-enabled network, the user needs to know, quickly and with citations: what part of the ML pipeline is involved, which provisions in the published UAE documents bear on the decision, what the text leaves open, and a record that shows how each answer was reached. Today that means a lawyer reading the Telecom Law, the data protection pages and the AI Charter by hand while an incident unfolds.

The event's framing: an AI agent acting as policy and legal adviser, tested by an interactive error scenario released in sequenced chunks, with audit logging and reasoning traces, mapped to Y.3172 and the AI Readiness Framework 2.0.

## 3. Partner capability that does the work

The named technologies, used as the working structure rather than as labels:

- **ITU-T Y.3172 pipeline.** Nodes SRC, C, PP, M, P, D, SINK, plus MLFO and ML sandbox. Every event is classified to one or more nodes first. The retrieval query, the findings and the gap check are keyed by node.
- **AI Readiness Framework 2.0 as encoded in the reference repo** (simulation/data/framework/dimensions.json): 6 factors (data, research, deployment, standards, opensource, sandbox), 13 dimensions, 111 metrics. Findings and gaps carry factor and dimension ids. The repo's node-to-dimension and node-to-factor mapping in agents/usecase.py is the starting table (builder reads it in full and copies it with attribution; MIT licence notice kept).
- **Reference repo KB format.** Chunk metadata: source_file, source_type, country, chunk_index, total_chunks, ingested_at, document_category. Chunk size 256 words, overlap 30. Additive fields: article, source_url, retrieved_on, sha256, y3172_nodes, dimension_ids.
- **AI for Good Sandbox.** Export target only. The KB exports as JSONL in the repo schema. Not required to run.

## 4. Requirements

Functional:

- R1. Ingest real public documents into a KB (section 6) and show what is in it, with URL, retrieval date, hash and fetch failures.
- R2. Scenario runner: load a scenario file; release events one at a time (button, optional timer); show the running state.
- R3. For each event: classify to Y.3172 nodes; retrieve; produce findings (provision, article, verbatim quote, why it applies) or an explicit "text silent" result.
- R4. Gap module: candidate gaps against Readiness dimensions, with nearest text, marked "candidate, needs human legal review". Global examples only from KB documents the builder has opened; otherwise "no global example in KB".
- R5. Audit: hash-chained append-only log for each session; trace view; JSONL export; a verify script.
- R6. Free-text event entry using the same rules, with the limitation shown.
- R7. Report-evidence export: Y.3172 mapping, Readiness mapping, local policy mapping tables as Markdown generated from the same data the app uses.

Non-functional:

- N1. Runs with no credentials. Deployed on Vercel; build tooling is GitHub CLI and Vercel CLI only.
- N2. No claim of legal advice. Banner states it. Arabic text of laws prevails; stated.
- N3. No invented facts: no operator names, incident histories, statistics or outcomes. Scenarios are synthetic and labelled so on screen.
- N4. English UI.

## 5. No-key behaviour and optional LLM

Credential check: this pass could not inspect the environment (no shell), so no LLM key or local model is assumed. NEEDS.md therefore lists the product as unblocked and the LLM as optional.

Default (no key), the product's real mode:

- Retrieval: in-process BM25 over the JSON KB, plus the filters node, document and article. No embeddings, no vector database.
- Agent: rules in a data file. Event classes (for example: automated network action; disclosure or sharing of subscriber data; interception or access to communications; licensing or authorization; equipment or system change; service complaint or regulator request; emergency or critical traffic) each carry trigger keywords, the Y.3172 nodes touched, query templates, and the dimension ids to test.
- Findings: composed from retrieved chunks and rule text. Every quoted span is checked as a substring of its chunk before it is displayed; failures are dropped and logged.
- Silence: if no chunk from a binding instrument scores above a set threshold for an event class, output "text silent" and feed the gap module.

Optional model, behind env vars `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` (any OpenAI-compatible endpoint, including a local one):

- Used only to rewrite the plain-language narrative of already-built findings and to suggest event classification for free-text input.
- It can never add a citation, quote or article. Its output is logged as a separate step marked "model-generated". Output that mentions an article not in the retrieved set is discarded.
- If the variables are unset or the call fails, the app behaves exactly as default. The report and demo describe the default mode.

## 6. Knowledge base: real sources

Status key: OPENED = read in this pass. NOT OPENED = identified but not read; the builder must fetch and verify before ingesting, otherwise exclude and list as missing.

| Document | Role | URL | Status |
|---|---|---|---|
| Federal Law by Decree No. 3 of 2003 Regarding the Organisation of the Telecommunication Sector (English, as amended per footnotes; Arabic prevails) | Core binding sector law | https://www.wipo.int/wipolex/edocs/lexdocs/laws/en/ae/ae025en.pdf | OPENED (full text) |
| WIPO Lex record for the law (amendments by Decree-Law 1 of 2005 and 5 of 2008 as stated by search results; page states No. 1 of 2005) | Metadata | https://www.wipo.int/wipolex/en/legislation/details/13893 | OPENED; the 2008 amendment is unverified |
| u.ae: Data protection laws (names Decree-Law 45 of 2021, Federal Law 15 of 2020 Consumer Protection, Federal Law 2 of 2019, Decree-Law 34 of 2021, Decree-Law 44 of 2021 UAE Data Office, Internet Access Management policy, Constitution Art. 31) | Pointer page, not primary law | https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws | OPENED |
| u.ae: Cyber laws (lists Telecom Law, Decree-Law 34 of 2021, 45 of 2021, 46 of 2021, Dubai Law 26 of 2015) | Pointer page | https://u.ae/en/Resources/Cyber-laws | OPENED |
| u.ae: UAE Charter for the Development and Use of AI (12 principles by name; page not an adoption notice) | AI principles; non-binding per secondary legal commentary, unverified | https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/policies/Ai/The-UAE-Charter-for-the-Development-and-Use-of-Artificial-Intelligence | OPENED (page) |
| u.ae: Artificial intelligence in government policies (AI Strategy, UAE Council for AI, AI CEO role, BRAIN, AIATC) | Strategy context | https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/artificial-intelligence-in-government-policies | OPENED |
| u.ae: AI resources (links to National Strategy PDF, AI Ethics Guide, Adoption Guideline) | Index of AI documents | https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/ai-resources | OPENED |
| Federal Decree-Law 45 of 2021 Personal Data Protection (English) | Binding; subscriber data | https://uaelegislation.gov.ae/en/legislations/1972/download | NOT OPENED (403 to the fetch tool; builder tries browser-style download) |
| UAE National Strategy for Artificial Intelligence 2031 | Strategy | https://assets.u.ae/api/public/content/deed2bf9d68244ab8119c27f2c52813f?v=87559d49 (from the AI resources page; the other u.ae URL 404ed) | NOT OPENED (size limit) |
| AI Ethics Guide; AI Adoption Guideline in Government Services | Guidance | links on the AI resources page above | NOT OPENED |
| Repo reference texts: ITU-T Y.3172 PDF and summary; Sandbox summary; EU AI Act summary; other national strategies | Standards and global examples | https://github.com/CrashingGuru/ITUAIReadiness/tree/main/simulation/server/knowledge/InputDocs | Y.3172 summary and Sandbox summary OPENED; the rest NOT OPENED. Global examples may be cited only from items the builder opens |
| TDRA regulations, policies, consumer protection instruments | Binding sector rules | none found | NOT FOUND. Do not guess. If the builder finds official TDRA texts, add them with the same checks |

Ingestion rules: store retrieved_on and sha256; chunk to 256 words with 30 overlap but split first on article boundaries so the article id is correct; build step asserts each chunk is a verbatim slice of source; article numbers are copied from the source text, never from this PRD (they were obtained through a summarizing tool). Pointer pages are tagged source_type "portal_summary" so the agent never presents them as primary law.

The country tag is "UAE" on every chunk; that the KB country is the UAE is an assumption (see win-plan.md).

## 7. Scenarios (synthetic, labelled)

Format: JSON with id, title, synthetic: true, and events[] each with release_order, label, text, and an author note of the Y.3172 nodes it is designed to touch (author notes are hidden from the agent, shown in the report as "expected by design").

Scenario A, "Automated throttling in a core network" (five events):
1. An ML anomaly model flags a traffic pattern in one region; the policy node applies an automated throttle to a service class (nodes M, P, D, SINK).
2. Operations wants to send subscriber call-detail data to an external vendor to retrain the model (SRC, C, PP).
3. Customers complain of degraded service and an information request from the sector regulator arrives (SINK, MLFO).
4. The retraining plan proposes pushing the new model straight to production without sandbox testing (M, Sandbox, MLFO).
5. Review finds the throttle also affected traffic to emergency or critical numbers (D, SINK).

Scenario B, "Lawful access request meets an ML pipeline" (four events), built on the Telecom Law's provisions on interception and disclosure and the data pages: a request arrives for stored communications metadata that the PP node has already transformed; a model drift alert; a vendor change; a request to explain a past automated decision.

These are invented exercises for testing the agent. They do not describe any real operator, incident, regulator action or outcome. Builder may add one more if time remains; not required.

## 8. What the demo must show on real input

On the live URL, in under seven minutes:

1. The KB page: real documents with URLs, dates, hashes, chunk counts, and the list of documents that failed to fetch.
2. Run Scenario A. At each event the app shows node classification, retrieved Telecom Law provisions with verbatim quotes and article numbers, and either findings or "text silent".
3. A free-text event typed live by the viewer.
4. The gap view: candidate gaps by Readiness dimension, each with nearest text and the review flag, and a global example only if one exists in the opened KB.
5. The audit view: export the log, run the verify script, change one byte, run it again and see it fail.
6. The no-key statement on screen. If the optional model is switched on, show the model step marked separately.

Real input means the actual Telecom Law text and the actual u.ae pages, not paraphrased fixtures. The scenario events are synthetic and say so.

## 9. Who pays

Unvalidated hypothesis, not evidence of demand: operators' compliance and network-governance teams, or a regulator or standards body that wants to test how a sector law copes with ML pipelines. This is a hackathon prototype; no pricing, customer, market size or revenue claim is made anywhere in the entry. For the judges' prize, the plausible value is research and standards work: a reusable, open KB format and a Y.3172-keyed gap method.

## 10. What would make a judge call it a wrapper

- The answers come from a model prompt with the law pasted in, and removing the model removes the product. Guard: default mode needs no model; show it.
- Citations that cannot be traced to a stored chunk. Guard: verbatim-slice check and chunk ids in every finding.
- Y.3172 appears only as a diagram. Guard: node classification drives retrieval, gaps and the report tables.
- A KB that is a handful of pasted web pages. Guard: source list with hashes, article-level chunks, failures disclosed.
- Gaps written from memory or generic AI-ethics talk, or global examples from nowhere. Guard: gaps arise from retrieval silence; examples only from opened KB documents.
- Audit that is a console log. Guard: hash-chained, exported, verifiable.
- Claims of accuracy, coverage or deployment. Guard: none made.

## 11. Acceptance checks

- Clean clone builds; build fails if a chunk is not a verbatim slice of its source.
- Live URL loads; Scenario A completes with the model variables unset.
- Every displayed quote appears in its chunk. Every finding has a chunk id.
- Exported log verifies; one-byte edit fails verification.
- Technical report tables regenerate from the same data files the app reads.
- Repo has no secrets; optional model variables documented in README.

## 12. Report evidence checklist (5 pages)

Introduction and use case: sections 1 to 2. Requirements: section 4. Y.3172 mapping: node table. Readiness mapping: factor and dimension table. Local policy mapping: provision table from the KB. Evaluation scenario: Scenario A with observed behaviour per event (observations, no scores). Policy and standards gaps: candidate gaps with the human review notes the operator writes. Limitations: Arabic prevails; documents not opened; synthetic scenarios; no accuracy claim.
