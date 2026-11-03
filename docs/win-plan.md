# Win plan: ITU AI for Good Lab Hackathon, UAE

Revised 2026-11-03 (second pass, rebuild). Rule book: docs/competition.md (unchanged). Deadline 10 November 2026. Solo build by alexvec. Track: Telecommunications (fixed by the operator; not reopened). PRD: docs/prds/telecommunications.md, "Rebuild amendments (2026-11-03, second)".

This event is judged by people against five published criteria (docs/competition.md, Judging criteria). It is not graded by an automated evaluator, it has no commercial sponsor, and it is not a lablab event. So there is no business-pitch rubric and no 1-to-5 lablab scoring here. Scores below are my own ordinal reading of the five criteria; no weights are published and none are assumed. Nothing here predicts a result.

## Past winners and how this differs

Every item below is a different event from this UAE hackathon (Saudi Arabia, 14 September 2026; Kenya, 21 May 2026). They used four criteria, not this event's five. Pages and repositories were read through a summarising fetch tool, so descriptions are the tool's summary of each README, not my reading of the code. Nothing was run.

Source pages: https://aiforgood.itu.int/event/ai-readiness-hackathon-kingdom-of-saudi-arabia/ (lists the four winning repositories), https://aiforgood.itu.int/the-itu-ai-readiness-hackathon-names-four-winning-solutions-in-riyadh/, https://aiforgood.itu.int/event/ai-readiness-hackathon-kenya/.

| Winner (Saudi event) | What it is, from the README | Where it overlaps with this entry | How this entry is a different job |
|---|---|---|---|
| 1st SANAD (https://github.com/Noura-Alrajeh/SANAD) | Maps the SAMA Cyber Security Framework (2017) to NIST SP 800-53 Rev 5. Proposer, opponent and arbiter agents on two models; a deterministic gate rejects any verdict whose evidence is not a verbatim quote of both texts; 8 sources pinned by SHA-256 in manifest.csv; precision statistics; Gradio dashboard. Apache-2.0. The README does not mention Y.3172. | Verbatim-citation gate and hash-pinned sources. This entry's verbatim-slice build check and sha256 list are the same idea. Citation checking is therefore not a differentiator and must not be pitched as one. | SANAD is an offline mapping of one regulator's framework to one standard, scored by precision. This entry is not a framework-to-framework crosswalk. It is an event-driven adviser: a sequence of incident events in one deployed ML pipeline, each routed to Y.3172 nodes and answered from several documents, with a conflict between sources settled by a rule agreed in advance. No multi-agent debate, no precision score (the FAQ says accuracy is not a criterion). |
| 2nd AI Guardian (https://github.com/Nada-MH/ai-guardian) | Continuous AI governance, risk and regulatory-intelligence platform. LLM agents (RAG, adversarial simulator, what-if) over a deterministic core (applicability, scoring, gap analysis, audit hashing). FastAPI, Next.js, LangGraph, Postgres with pgvector, Docker. 49 frameworks and 258 clause chunks in its KB, Saudi finance and global AI standards. Hash-chained audit events, signed human overrides. Lists "ITU AI Readiness Framework & ITU-T Y.3172" as one KB entry. The README's accuracy figures (for example 98.4% citation accuracy) are self-reported and I did not verify them. Apache-2.0. | Hash-chained audit log; deterministic control separate from language-model help; gap analysis. This entry's hash-chain is the same mechanism, so it is not a differentiator. | AI Guardian is a general enterprise GRC platform for finance-style regulated firms, scoring many frameworks over time. This entry does one job: tell a telecom operator's governance lead, event by event, which part of the Y.3172 pipeline an incident touches and what UAE telecom and AI text says about it. AI Guardian treats Y.3172 as a document in its library; here Y.3172 nodes drive retrieval and the report table. This entry is far smaller (no database, no agents framework) and makes no accuracy claim. |
| 3rd Samaam (https://github.com/aboalrejal-ai/samaam) | Policy gateway for oncology radiology between a technologist console and a CT scanner. Its pipeline is laid out on the Y.3172 nodes SRC, C, PP, M, P, D, SINK. FHIR client and a DICOM worklist server, a retrieval step that drafts reasoning but cannot block, and a deterministic policy node that returns 403 with the provision and source. Six verdicts, four actions, three demo scenarios, audit endpoint, maps to Readiness dimensions D10, D11, D13. Encodes statutory sources (Royal Decree 60057, SDAIA PDPL, SFDA and Ministry of Health documents). LLM key optional. MIT. | The closest competitor. Same Y.3172 node spine, same template, same Readiness mapping, optional-model design, binding national text, a rules-based blocker, and a named-human override. This entry's "default mode needs no model" design is also Samaam's. | Samaam sits inline in one clinical request path and blocks or releases a single device action. This entry is not in the request path. It advises after events in a telecom ML pipeline, over a progressively released scenario, and has no integration with real network equipment. Samaam is healthcare/radiology, this is telecom. Honest comparison: Samaam is more integrated and more engineered (real protocol servers, verdict taxonomy, frontend, deployment). This entry is lighter and its rules are hand-written. Samaam is the model to beat, not a model this entry exceeds. |
| Women's prize Nakheel Doctor (https://github.com/HelhBader/nakheel-doctor) | Red Palm Weevil prototype: audio classifier (Random Forest), hybrid retrieval over a 30-chunk KB from eight sources, local Qwen3 8B with citation validation, deterministic policy engine returning ALLOW, BLOCK or REVIEW_REQUIRED. Maps workflow to Y.3172 nodes as a functional alignment. Lists policy and integration gaps. No stated licence on the page read; no audit section. | Human review, deterministic policy path, Y.3172 mapping, a gap list. | Agriculture with a trained classifier. This entry has no trained model and a different domain and buyer. |

| Winner (Kenya event) | What is recorded | Difference |
|---|---|---|
| 1st The Eagles; 2nd Tai Educators; joint 3rd Altura and Root ED; Women's prize TOKIVA Sisters | docs/competition.md records only the names and that the task covered education, agriculture, health and finance use cases. The Kenya page I re-opened links no project repositories and gives no descriptions; the only GitHub link on it is the reference ITU AI-RE Toolkit. | I could not confirm what any Kenya winner built, so I make no claim about overlap. None of the four sectors the page lists is telecom. That is all that can honestly be said. |

AI Environmental Footprint Measurement Hackathon winners (GreenMind and two others) were a different topic and are not a comparison.

What I could not open: the Kenya winners' projects (no links); any scores or judge comments for any winner; the Saudi event's submitted reports (only repositories); code in any repository (README summaries only); the 2022-path earlier Sandbox hackathon (no page found).

### Would this entry lose?

Plainly:

- As it stood before this rebuild, yes, most likely. Its KB held four general AI documents with no telecom text, most telecom questions returned "not addressed", it relied on analogy, and it had no global example. Criteria 1 and 3 were its weakest and the previous report said so. Measured against Samaam and SANAD, which cite binding national text with a source link, it was behind on the two criteria the event calls out.
- After the rebuild it can be competitive on the criteria that depend on documents and traces (1 KB quality, 4 auditability), but it will still be lighter than Samaam on agent capability (2), and it only reaches parity on 3 and 5 if the work below lands. I do not think it is the favourite for a top-three place, and I will not claim it is. Whether it is shortlisted depends on what other UAE entrants submit, which I have no information about.
- If the Telecom Law and at least the TDRA Consumer Protection Regulations cannot be retrieved and ingested, the honest conclusion is that this product loses on criteria 1 and 3 to any entry that does cite binding telecom text, and the right move is to submit it as it is, with the gaps disclosed, rather than dress it up.

What would change that (each is a build item, none is guaranteed):

1. Binding telecom text in the KB with article-level, verbatim, hash-pinned citations (criterion 1, 2, 3).
2. At least one foreign regulator text with a verbatim quote in the gap view, labelled foreign and not a UAE obligation (criterion 3: "global examples", called critical by the event).
3. Y.3172 and the Readiness Framework 2.0 actually read and cited, instead of taken from the reference repo's summary (criterion 5; the prior report admitted neither was read).
4. Rules whose actions are no stronger than their quotes, so a judge who checks one quote against one action does not find an overreach (criterion 2).
5. A visible rule for conflicts between sources, agreed before the scenario runs, that settles the controversy step (the template demands it).
6. Telecom is where Y.3172 comes from. None of the winners I read applied it to a telecom network, so that is the one honest domain difference. It is a difference of subject, not proof of better work.

## Decision

Track: Telecommunications. Role: policy and legal adviser agent for a licensed operator's governance lead, driven through Y.3172 pipeline events. There is no partner track at this event; the "partner technologies" are ITU-T Y.3172, the AI Readiness Framework 2.0, the reference repo (MIT) and the Sandbox. Depth over breadth: Y.3172 is the spine, the Readiness dimensions are the gap taxonomy, and nothing else is bolted on.

Why the other domains lose (unchanged reasoning, shortened): Government services is the runner-up but Y.3172 (a network ML architecture) fits it only by analogy. Healthcare has Samaam to beat already and its primary law was not reachable. Education had no instrument found. The operator has also fixed telecom.

## Assumptions (unverified, from docs/competition.md)

The country is the UAE; a solo entry is allowed; weights are unpublished; the submission route, time of day and timezone on 10 November are unknown; Sandbox credits have no claim route, so none are assumed and nothing depends on them.

## Score against this event's five criteria

Ordinal 1 low to 5 high, my judgment, not a prediction. "Before" is the build at commit c9433c7. "After" is the target if the plan below lands; it is not a result.

| Criterion | Before | After (target) | What moves it |
|---|---|---|---|
| 1 KB quality | 2: four non-binding AI documents; no telecom law; Charter has lost ligature characters in four chunks | 4: telecom law and regulator text plus four AI documents, framework documents, hashes, article ids | Retrieval of the sources in the PRD priority list; build check that every chunk is a verbatim slice |
| 2 Agent capability | 3: deterministic rules, 31 of them, several stronger than their quotes | 3 to 4: rules rewritten against telecom text; weaker than Samaam's integration | Rules rewrite; no overreach; conflict-precedence rule |
| 3 Gaps and global examples | 1 to 2: no global example, gaps mostly "not in the documents I happened to ingest" | 3: gaps arise against real telecom text; one or two foreign examples quoted if retrievable, else "no global example in KB" | Foreign sources retrieved or declined honestly |
| 4 Auditability | 4: hash-chained log, trace, export, verify script, one-byte tamper test | 4: same, plus a per-citation "verify against source" action | Already present; AI Guardian and Samaam also have audit |
| 5 ITU alignment | 3: nodes and dimensions from the reference repo; Y.3172 and Readiness never read | 4: both read from ITU PDFs, node definitions quoted | Retrieval of the two ITU PDFs and reading them |

## What to cut

No fine-tuning, vector database, hosted embeddings, multi-agent debate, accounts, persistence, Arabic UI or Arabic retrieval, second country, second domain, accuracy benchmark, legal-advice claim. The old Scenario B is gone. Pointer pages from u.ae are not ingested. The optional language-model narrative is the first thing to cut if time runs out. No new claim about the PDPL unless the official text is retrieved.

## Day plan, 3 to 10 November 2026

Disk is at 98% with about 20 GB free: delete temp downloads after hashing; do not install LibreOffice unless at least 5 GB remains free.

| Date | Deliverable | Exit test |
|---|---|---|
| Tue 3 Nov (today) | Retrieve with a shell, hash and list every candidate in the PRD source plan; try the PDPL with a browser user agent; save Telecom Law HTML and check the text is inline; retrieve the Y.3172 and Readiness PDFs; try the two foreign texts. Update sources/README.md | Each kept file has a SHA-256 row; each failure is noted with the error |
| Wed 4 Nov | Extraction (text layer first, tesseract only for scans), article-aware chunking, verbatim-slice check, KB rebuilt; read Y.3172 and the Readiness PDF in full; KB freeze at end of day | Build fails on any unlisted file or non-verbatim chunk; node and dimension table drafted from the ITU texts |
| Thu 5 Nov | Rewrite data/rules.json, scenario events and data/evidence-map.json against real provisions; fix PR-11, 12, 19, 26, 30; add the precedence rule; tests | Every action is no stronger than its quote; template step order intact; tests pass |
| Fri 6 Nov | Gaps recomputed; global-example view; KB page shows new sources and failures; deploy | Live URL answers; /kb lists new sources; /gaps shows foreign example or "no global example in KB" |
| Sat 7 Nov | Technical report filled into a copy of the official template at docs/technical-report.docx; page count measured by rendering; mentoring session (optional) | Rendered page count at most 5, last page no more than half full |
| Sun 8 Nov | Independent verifier pass; REVIEW.md rewritten; demo script timed | No quote fails; no source claim without a file hash |
| Mon 9 Nov | Freeze: clean clone build, live check, README, form text, packet for the operator | Operator has repo URL, form text, report |
| Tue 10 Nov | Operator submits, early in the day (time of day and timezone unverified) | n/a |

If a day slips, cut in this order: foreign sources beyond the first, optional model narrative, UI polish. Never cut the audit log, the verbatim check, or the telecom text.

## Main risks

- The summarising fetch tool reported article numbers; the builder re-verifies against saved bytes. Nothing is quoted unless it is a slice of a retrieved file.
- The Telecom Law is a 2003 law on a secondary host (WIPO Lex, TRA copyright notice, Arabic prevails). Later amendments are not checked unless the saved text shows them.
- The PDPL and foreign texts may stay blocked; the plan degrades to "dropped" or "no global example in KB" and says so.
- A judge may see a rules agent as simple. Answer: the criteria reward KB, traceability and alignment, and the product shows them on real documents without a model.
- Report page count differs between Pages and Word. Keep a margin.
