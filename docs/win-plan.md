# Win plan: ITU AI for Good Lab Hackathon, UAE

Written 2026-11-03 by the strategy pass. Rule book: docs/competition.md (unchanged). Deadline 10 November 2026. Solo build by alexvec.

## Decision

Track: **Telecommunications**. Role: **policy and legal adviser agent** for a licensed operator's network-ML team, driven through ITU-T Y.3172 pipeline events. Chosen PRD: docs/prds/telecommunications.md.

Working title: Y.3172 Incident Counsel (a label, not a claimed product).

## Assumptions (all recorded, none verified by the organizers)

1. The country is the UAE. The event page implies it ("under the leadership of UAE", event title) but never says teams cannot pick another. Unverified.
2. A solo entry is allowed. No page read forbids it; none permits it. Unverified.
3. Judging weights are not published. Nothing below assumes a weighting.
4. The form's "Telecommunications" domain is the same domain list the event describes as "telecom". The FAQ says domain can change until final submission, so this choice is reversible.
5. "Partner technology" here means the four technologies the event names: ITU-T Y.3172, AI Readiness Framework 2.0, the reference repo (MIT), and the AI for Good Sandbox. No commercial partner exists.

## What was and was not opened in this pass

Opened and read (via a summarizing fetch tool, so article numbers are "as reported" and the builder re-checks them against the text at ingestion):

- Reference repo tree and files: simulation/README.md, config.py, kb.py, ingest.py, agents/usecase.py, data/framework/dimensions.json, InputDocs/Inputs.md, the Y.3172 summary text and Sandbox summary text (all under https://github.com/CrashingGuru/ITUAIReadiness, MIT per competition.md).
- EVENT page (re-read for knowledge-base, scenario, audit, and criteria text).
- UAE Telecom Law, full English text, via WIPO Lex: https://www.wipo.int/wipolex/edocs/lexdocs/laws/en/ae/ae025en.pdf (page https://www.wipo.int/wipolex/en/legislation/details/13893). Federal Law by Decree No. 3 of 2003, Arabic prevails.
- u.ae portal pages: Data protection laws https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws ; Cyber laws https://u.ae/en/Resources/Cyber-laws ; AI in government policies https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/artificial-intelligence-in-government-policies ; AI resources https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/ai-resources ; UAE AI Charter page https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/policies/Ai/The-UAE-Charter-for-the-Development-and-Use-of-Artificial-Intelligence ; ICT in the health sector https://u.ae/en/about-the-uae/digital-uae/whole-of-government-approach/digital-health/ict-in-the-health-sector .

Could not open:

- ITU-T Y.3172 itself. The ITU page returned only metadata (Y.3172, approved 2019-06-22, in force). The repo's own summary text was read instead. The full PDF is also in the repo (InputDocs/AI_Use_Cases) and must be read by the builder.
- AI Readiness Framework 2.0 report. Only a landing page and secondary press were read; secondary sources disagree on pillar naming (five dimensions vs six factors). The repo's dimensions.json (6 factors, 13 dimensions, 111 metrics, "ITU AI Readiness Framework 2025 (Report 2.0)") is the only structured source read. Treat the pillar count as unverified until the report PDF is read.
- Submission template .docx. Downloaded by the fetch tool but unreadable here (binary, no shell in this session). Section order is unverified beyond the FAQ list in competition.md. The builder unzips it with a shell and reads word/document.xml.
- UAE National AI Strategy 2031 PDF: u.ae URL returned 404; the assets.u.ae copy exceeded the fetch size limit. Only secondary descriptions seen. Unverified.
- UAE PDPL (Federal Decree-Law 45 of 2021) full text: uaelegislation.gov.ae returned 403. Only the u.ae summary page was read.
- UAE AI Adoption Guideline in Government Services, AI Ethics Guide, Charter PDF (ai.gov.ae Methaq): binary or too large; not read.
- Any TDRA regulation, policy, or consumer-protection instrument from tdra.gov.ae: search surfaced no official TDRA page. Not read. The regulator's current name is reported inconsistently by secondary sources; the Telecom Law text names "the Authority" and the builder must copy whatever the law text says.
- LLM availability: this pass had no shell and could not inspect the machine for API keys or a local model runtime. So no key is assumed (see PRD).

## How the tracks score

Scoring is my own ordinal judgment (1 low to 5 high) against the five published criteria. It is not a prediction and no weights are known. "Evidence" means primary text I actually opened.

| Criterion | Telecom | Government services | Healthcare | Education |
|---|---|---|---|---|
| 1 KB quality (primary texts reachable) | 4: full Telecom Law text opened; plus 5 u.ae pages | 3: AI-in-government pages opened, Adoption Guideline unreadable | 2: health law only via portal summary; PDPL excludes health data per secondary sources | 1: no education instrument found or opened |
| 2 Agent capability (scenario fit) | 5: network incidents are naturally sequenced and chunked | 3: service-failure scenarios exist but are less event-driven | 3: clinical-safety scenarios raise stakes I cannot ground | 2 |
| 3 Gap identification | 4: a 2003 sector law read against ML-in-the-network is a real, checkable comparison | 3 | 3 | 2 |
| 4 Auditability | same across tracks | same | same | same |
| 5 ITU alignment | 5: Y.3172 is an ML-in-networks standard; the pipeline maps to the domain without translation | 3: Y.3172 must be stretched | 2 | 2 |

Why the others lose:

- **Government services**: the strongest runner-up. The u.ae AI-in-government pages are real and the AI Adoption Guideline exists, but I could not read the Guideline, and Y.3172 (a network ML architecture) fits a citizen-service agent only by analogy. A judge scoring criterion 5 would see a bolt-on.
- **Healthcare**: the primary instrument I reached (Federal Law No. 2 of 2019) was only summarized on a portal page, and secondary sources say the general PDPL excludes health data. That leaves the KB thin and the safety stakes high. A health adviser that cannot cite a primary text invites the wrapper charge.
- **Education**: I found and opened no UAE education-sector AI instrument. The KB would be mostly generic AI-ethics material. Lowest on criteria 1, 3 and 5.

The decisive factor is depth of use of one technology, not breadth: Y.3172 is the data model of the telecom product, not a label on it.

## Why a deep use of Y.3172 and the Readiness Framework, not a broad one

The event names no commercial partner. The deepest honest use of the named technologies:

1. **Y.3172 is the spine.** Every scenario event is routed through the seven pipeline nodes (SRC, C, PP, M, P, D, SINK) plus MLFO and the ML sandbox. The agent's first output for any event is "which node is acted on, and which governance question that raises". The repo's own usecase.py already defines these nine components and a node-to-dimension and node-to-factor map; the build reuses that mapping (after the builder reads it in full).
2. **The AI Readiness dimensions are the gap taxonomy.** Gaps are reported against the repo's 13 dimensions and 6 factors (dimensions.json), not free text.
3. **The reference repo sets the KB format.** Chunk metadata follows ingest.py: source_file, source_type, country, chunk_index, total_chunks, ingested_at, document_category. Chunking follows config.py (256 words, 30 overlap). Extra fields (article, node, dimension_ids, source_url, retrieved_on, sha256) are additive so the KB still loads with the reference ingest schema.
4. **The Sandbox is a target, not a dependency.** Sandbox credits are for "selected" participants. The KB and code ship as a portable export (JSONL) so they can be loaded into the Sandbox if access is granted. The product does not need it.

The repo's runtime (ChromaDB, Ollama qwen2.5:14b, about 16 GB RAM) cannot be hosted on Vercel and is not copied. Its design is followed; its stack is not.

## How the build scores on each criterion

1. **Knowledge base quality.** Completeness: a short list of real documents, each with source URL, retrieval date and sha256, ingested whole. Accuracy: clause-level chunks keep the article number; a build-time check asserts every stored chunk text is a verbatim slice of the fetched source. Structure: the repo schema plus additive fields. Honest scope: a KB page that lists what is ingested, what failed to fetch (PDPL, AI Strategy, if still blocked), and what is missing. Smaller and verified beats larger and unverified.
2. **Agent capability.** A deterministic, rule-driven agent runs a released-in-chunks scenario. Each event gets: Y.3172 node classification, retrieval with scores, applicable provisions with verbatim quotes, an action recommendation phrased as "what the retrieved text requires or leaves open", and a flag when the text is silent. No accuracy number is claimed or measured, per the FAQ. The scenarios are synthetic and labelled so.
3. **Gap identification.** Gap = an event class where a governance control is needed at a Y.3172 node and the KB's binding instruments return nothing above a retrieval threshold. Output names the dimension, the nearest text found, and a clearly marked "candidate: needs human legal review". Global examples come only from documents already in the KB that the builder has opened; if none apply the agent says so. No global example is written from memory.
4. **Auditability.** A hash-chained, append-only session log: every input, rule fired, query, chunk ids with scores, quoted spans, output. A "trace" view shows these. The trace is the system's structured reasoning, not a hidden model monologue. Export as JSONL, verifiable by a small script included in the repo.
5. **ITU alignment.** Y.3172 node view and MLFO/sandbox lanes in the UI; Readiness dimension and factor tags on every finding; the report's two mapping sections are generated from the same tables the app runs on, so report and code cannot drift.

## What to cut

- No fine-tuning, no vector database, no hosted embeddings, no Chroma, no Ollama, no GPUs.
- No multi-agent orchestration. One agent with named stages. (The role options in the event are alternatives, not a requirement to do several.)
- No accounts, no persistence beyond session export, no database.
- No Arabic UI or Arabic retrieval. The law's Arabic text prevails and this is a stated limitation.
- No other domains. No second country.
- No demo-video heroics; the video is optional until shortlist (18 November). Record a simple screen capture on day 7 only if time remains.
- No accuracy benchmarking, because the FAQ excludes it and it would invent numbers.
- No claim that the tool gives legal advice.

## Day-by-day plan

Day 1 is today, 2026-11-03. The operator's registration is due 5 November; registering is the operator's action.

| Day | Date | Deliverable | Exit test |
|---|---|---|---|
| 1 | Tue 3 Nov | Next.js (TypeScript) app scaffolded; Telecom Law ingested into a first KB JSON; search page with source-cited results; pushed to GitHub; deployed to Vercel | Live URL answers; a query returns a cited Telecom Law chunk |
| 2 | Wed 4 Nov | Remaining fetchable sources ingested with verbatim-slice check; KB page listing sources, hashes, failures; read Y.3172 PDF and dimensions.json fully; node and dimension tables written as data files | Build fails if any chunk is not a substring of its source |
| 3 | Thu 5 Nov | Scenario format and release engine; two synthetic scenarios; event classification rules; Y.3172 node view | Scenario can be stepped event by event in the browser |
| 4 | Fri 6 Nov | Retrieval to findings with quotes; silence detection; gap module with candidate flag; global example lookup restricted to KB | Each event returns findings or an explicit "text silent" |
| 5 | Sat 7 Nov | Hash-chained audit log, trace view, export, verify script; optional LLM narrative behind env var; mentoring session is today, optional | Exported log verifies; tampering one line makes verify fail |
| 6 | Sun 8 Nov | Report evidence generated from data tables; 5-page technical report written in the official template; README and run instructions | Report within 5 pages; every required section present |
| 7 | Mon 9 Nov | Freeze: end-to-end run on a clean checkout, mobile and desktop pass, no-key path re-tested, REVIEW.md, form text | Live URL responds; repo public with essential code |
| buffer | Tue 10 Nov | Operator submits via submit.sh. Submission time and timezone unverified, so do not leave it to the last hour | n/a |

If a day slips, cut in this order: LLM narrative, second scenario, global example lookup, UI polish. Never cut the audit log or the verbatim-quote check.

## Evidence map to the technical report (max 5 pages)

| Required section | Source of evidence in the build |
|---|---|
| Introduction, use case, requirements | PRD sections 1 to 4 |
| Y.3172 mapping | Generated table: node, role in the app, scenario events that touch it |
| AI Readiness Framework 2.0 mapping | Generated table: factor and dimension per finding type |
| Local policy mapping | Generated from KB: provision, article, which event class it answers |
| Evaluation scenario | The two scenarios, with each event's expected-by-design output versus real output, stated as observations, not scores |
| Policy and standards gaps | Gap module output, marked candidate, with reviewed notes |

## Main risks

- The fetch tool summarizes; article numbers must be re-verified at ingestion against the real text.
- Several UAE documents were blocked (403/404/size). If still blocked, the KB ships without them and the report says so.
- The Telecom Law is from 2003; the agent will often find it silent on ML. That is the point of the gap module but must be shown carefully as "text silent", not "law is deficient".
- A judge may see a keyword agent as simple. Answer: criteria reward KB structure, traceability and ITU alignment, and the model is optional by design.
- Arabic prevails in the law text; English is a courtesy translation and the report states that.
