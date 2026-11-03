# PRD: Telecommunications (CHOSEN)

Working title: Y.3172 Incident Counsel. Status: ready to build. Owner: alexvec, solo.

## Rebuild amendments (2026-11-03, second)

Supersedes every earlier part of this file, including the first "Amendments (2026-11-03)", wherever they conflict. Reason: the first build had four general AI documents and no telecom text, so most telecom questions came back "not addressed" and no global example existed. Track stays Telecommunications. Evidence for the plan is in docs/competition.md (Telecom sources: candidate list) and docs/win-plan.md. Nothing below has been run; the builder confirms every claim about a document by reading the saved bytes.

### A. KB source plan (telecom first)

Rules that apply to every file:
- The builder downloads with a shell (curl with a browser user agent where a plain fetch fails), saves the bytes, takes the SHA-256, and adds a row to sources/README.md (file, what it is, URL, retrieval date, SHA-256, language, publisher, status such as primary or secondary host). That row is what makes it ingestible under CLAUDE.md. A file with no row is not ingested. The prebuild check fails on any ingested file without a row or with a hash mismatch.
- Nothing is quoted, cited or described unless it is a verbatim slice of a retrieved file. If a document cannot be opened, the document and every claim about its content are removed from the UI, the report, the rules and the docs. No secondary copy of a law is used unless it is labelled secondary on screen, and none is planned.
- Download and extraction go in new, empty directories; scripts live elsewhere; run any Python with `-I`. Delete temp copies after hashing (disk is at 98%).
- Scanned PDFs: text layer first, tesseract only where there is none. OCR-derived pages are flagged in the KB, no rule rests on an OCR page unless the page was checked by eye (render and view it).
- Candidate numbers below are rows in docs/competition.md "Telecom sources: candidate list". Statuses there come from a summarising tool.

Priority order (stop and decide at the end of Wed 4 Nov):

| Pri | Row | Document | Plan | If it fails |
|---|---|---|---|---|
| 1 | 1, 2 | Federal Law by Decree No. 3 of 2003 on the Organisation of the Telecommunication Sector, English courtesy text on WIPO Lex | The fetch of ae025en.pdf returned an HTML page whose body holds the whole law inline (Articles 1 to 84 as reported; builder checks). Ingest from the saved HTML: hash the HTML bytes, extract the text deterministically into a second file, hash that too, list both in sources/README.md, and run the verbatim-slice check against the extracted text. Mark it "secondary host, English courtesy text; the Arabic version prevails in case of discrepancy" (the page says so) on /kb, in the report and beside every quote. Chunk on "Article N" boundaries and fill the article field from the text. Read the footnotes and do not state later amendments or in-force status beyond what the saved text says. Also try the Arabic PDF (row 3) and, if it opens, hash and list it as the prevailing text, not retrieved from, because Arabic retrieval is out of scope. | If the text is not actually inline, drop the law and every claim about it. The report then says plainly there is no telecom statute in the KB. |
| 2 | 6 | TDRA Consumer Protection Regulations Version 2.0 (issued 25/07/2023 per the index), 74 pages | Primary publisher. Chunk by heading or clause number as printed. Confirm the issue date and version from the first pages. Check what it says about complaints and escalation to the regulator, use of consumer information and any annexes, then decide rows 7 to 9 below. | If it will not download or has no readable text, drop it. |
| 3 | 10 | TDRA Unsolicited Electronic Communications regulatory policy, 19 pages | Relevant to the marketing-dashboard step. Confirm date and whether it is in force from its own text. | Drop. |
| 4 | 14 | Federal Decree-Law No. 45 of 2021 (PDPL) from uaelegislation.gov.ae | Try the page and the `/download` URL with a browser user agent. Check the language of the file: if only Arabic is available it cannot support English quotes and is not ingested (no translation by the builder). | Drop it. All content claims about the PDPL go with it. The only remaining statement allowed is that the PDPL is named in an ingested document (the Ethics Principles mention "Personal Data Protection" on p. 24 per REVIEW.md; the builder re-verifies the page). PR-18 is reworded to match. No secondary copy (row 15, u.ae summary) is ingested. |
| 5 | 16 | Decree-Law establishing the Emirates Data Office | Try only after rows 1 to 4. Ingest if it opens as readable English and helps the "refer to an oversight body" step; use only what it says. | Drop. The oversight-referral outcome stays as supported by whatever the other texts say. |
| 6 | 7 (and 8, 9) | Consumer Dispute Procedure annex (2014, refers to V1.0); marketing complaints annex; 2010 complaints handling policy | Ingest only if V2.0's own text says the annex continues to apply, or the annex itself shows it is current. Otherwise leave out and do not cite it. | Leave out. |
| skip | 11, 12, 13, 15 | SIM-registration policies, TDRA consumer hub pages, u.ae data protection pointer | Not used by the scenario. Not ingested. | n/a |

The four existing UAE AI documents stay (strategy, Charter, Ethics Principles, adoption guideline). They remain labelled non-binding guidance unless their own text says otherwise; none does. Where a telecom provision answers an event, it leads and the AI document is supporting. The PRD's earlier rule "u.ae pointer pages are not ingested" stands.

### B. Framework documents: Y.3172 and the Readiness Framework 2.0

Yes, retrieve and read both. In my pass the Readiness PDF (https://www.itu.int/dms_pub/itu-t/opb/ai4g/T-AI4G-AI4GOOD-2025-6-PDF-E.pdf) downloaded as a 1.1 MB PDF and the Y.3172 PDF (https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-Y.3172-201906-I!!PDF-E&type=items) downloaded as a 34 page PDF with no login prompt. I could not read either body (binary), so I cannot say what they contain. The builder extracts, reads them in full and:
- hashes both and lists them in sources/README.md under a separate heading, category `framework`, never presented as UAE policy or as binding;
- quotes node definitions (SRC, C, PP, M, P, D, SINK, MLFO, sandbox) verbatim from Y.3172 in the Y.3172 mapping table, replacing the reference repo's summary text;
- takes factor and dimension names, numbering and counts from the Readiness PDF. If they differ from the reference repo's dimensions.json (6 factors, 13 dimensions), the PDF wins and the report says the repo differs;
- records the licence or copyright status as stated in the files (the ITU page shows a copyright notice and no free-use terms; ITU-T Y.3172 reuse terms unverified). Quotes stay short.
They count as framework or KB documents only once retrieved and hashed. If either fails to open, the report keeps its current admission that it was not read and the table stays on the reference repo's mapping.

### C. Global examples: decision

Add at most two foreign documents, and only if retrieved and hashed. The criteria call relevance of gaps and accuracy of global examples critical, and the UAE documents alone cannot supply any. Priority:
1. EU General Data Protection Regulation, Regulation (EU) 2016/679, from EUR-Lex. Its text on purpose limitation, data minimisation and consent speaks to the template's escalation outcome (consent, purpose limitation) that the UAE AI documents support only partly.
2. EU AI Act, Regulation (EU) 2024/1689, from EUR-Lex (Official Journal text). Its text on human oversight and on critical digital infrastructure speaks to the policy node and the emergency-traffic step.
My own fetch of both EUR-Lex URLs returned an empty page, so neither is opened and neither is confirmed retrievable. The builder tries a shell fetch with a browser user agent, records which publication version it saved, and does not check later amendments.
Use is limited to what the text says. The gap view shows: "Example from another jurisdiction: [instrument], Article N: '<verbatim slice>'. Not an obligation in the UAE. No claim is made about adoption, enforcement or effect, and no recommendation to copy it." No examples from memory, no summaries of foreign law, no named foreign cases.
If neither document can be retrieved, keep "no global example in KB" on /gaps, in the report and in the demo, and do not add any. The NIST AI RMF is not planned (it is SANAD's reference standard and its metadata on retrieval looked wrong; not worth the time). Bring up a third only if the first two land by Wed 4 Nov and time remains.

### D. Rules, scenario and node table against telecom text

Order of work: read the retrieved telecom texts first, then rewrite. The scenario remains synthetic and the author's design; the report must not present it as evidence of coverage.

1. Retire analogy. Wherever a retrieved telecom provision answers an event, the rule cites it and the guideline-by-analogy rule is removed or demoted to a supporting line. Rules that rest on the government-services guideline (PR-11, PR-26) keep an analogy label if they stay at all. PR-25 ("binding law sits outside this KB") and PR-18 are rewritten or deleted according to what was retrieved; they must never say a law is absent when it is now in the KB, and must never describe the PDPL unless its text was retrieved.
2. An action must not be stronger than its quote. Test for every rule: the action's verb is no stronger than the quote's modal (may, could consider, should consider, should, shall or must as printed). No "stop", "hold", "shut down now" or "before any further use" unless the quote says it. Two or more telecom quotes may be combined only if each is shown. Specific fixes from REVIEW.md:
   - PR-11: "should avoid" cannot become "Stop". Rewrite to "Avoid ... or record which of the text's exceptions applies" and keep the analogy label unless a telecom provision replaces it.
   - PR-12: the quote is about surveillance technologies and was applied to marketing without a label. Replace with the telecom provision on use of subscriber information (CPR V2.0 or the unsolicited communications policy) if the text supports it; otherwise add the analogy label and a note, or delete the rule and show "not addressed".
   - PR-19: remove "before any further use of this data"; the quote says only that algorithmic systems require adequate privacy impact assessments. Action: ensure an adequate assessment exists or record that it does not.
   - PR-26: the quote describes a testing stage. Action: "Check that evaluation against acceptance criteria is recorded before deployment, as the guideline describes the sequence (analogy: government services)". Replace if a telecom provision covers change control.
   - PR-30: "should always be possible to shut down" supports "confirm a shut-down path exists and who can use it", not "shut down now". Replace or supplement with any telecom provision on emergency or critical traffic if the retrieved text has one.
   - Same test on every other rule. The builder lists the result in the rules file as a field `strength_check` per rule (text modal, action verb, pass/fail).
3. Required template steps stay, in this order: (1) deployment, (2) popular, (3) controversy, (4) KB decides, (5) escalation from a consumer issue to a data-privacy breach (the template's twist), (6) KB decides, then (7) regulator request, (8) push without sandbox, (9) emergency or critical traffic. The popular step keeps the Ethics p. 8 example as a labelled analogy unless a telecom text speaks to it. The controversy step is now a real consumer matter: subscribers complain about the throttle, and the complaint route is taken from CPR V2.0 if its text supplies one.
4. Pre-agreed rule for the controversy ("KB decides"). Add a precedence rule PA-01, written before the scenario runs and shown on screen: when two sources conflict, the one the retrieved text itself marks as law or regulation outranks regulator policy, which outranks national guidance, which outranks framework documents. Rank is read from each document's own text, not assumed, and PA-01 is labelled as the author's design choice, for human legal review, not as a statement of UAE legal hierarchy. The scenario includes a point where an Ethics "should" and a telecom provision pull different ways, and the agent applies PA-01 and shows both quotes. Do not engineer the conflict to invent a provision; if the texts do not conflict, say so and pick the closest real tension found, or report that none was found.
5. Template outcomes (prohibit use, require consent, purpose limitation, refer to oversight body): each is decided by reading the retrieved text, then recorded as supported, partly supported or not addressed, with the quote. This PRD does not pre-decide them. Where a foreign text speaks to an outcome it appears as the labelled foreign example, not as support.
6. Node table (SRC, C, PP, M, P, D, SINK, in that order). Per node: use case, one Readiness dimension (from the Readiness PDF if read), one policy document with chunk id and verbatim quote, plus strategy alignment, interface design and collaboration between AI and a human. Prefer a telecom document where its text speaks to the node. Keep an AI document only where no telecom text applies, and say which. Y.3172 node definitions are quoted from the Y.3172 PDF. The Sandbox row stays weak unless a retrieved text says more; do not stretch it.
7. Quote hygiene: every quote begins at a word boundary and ends at a clause end; no quote from a chunk that contains the lost-ligature character (U+FFFD) at the quote's edge; PR-10, PR-25, PR-29 and the P-node evidence quote are rechecked for this.
8. Regenerate data/evidence-map.json, the /evidence page, the report tables and the slides from the same data. Update the tests so they fail if a rule's citation is not a slice of its chunk or if `strength_check` fails.

### E. "The required capability runs on real input" at this event

No commercial sponsor API is named and the event has no partner track (docs/competition.md). Sandbox credits have no published claim route, so none are assumed and nothing depends on them. The required capability here is the thing the event asks for: an AI agent that works over a real country knowledge base built from the country's documents, mapped to ITU-T Y.3172 and the AI Readiness Framework 2.0, with audit logging and reasoning traces, run against a released sequence of events. It counts as real when:
- the KB is built from the retrieved files, not fixtures, and each row in sources/README.md has a hash that the build re-checks;
- every quote shown is a verbatim slice of its chunk, which is a slice of a retrieved file, and a "verify" action on screen re-finds it;
- the scenario runs with no model key, so the output is the agent's, not a hidden prompt's;
- the log is hash-chained and exportable, and a one-byte change fails verification.
A judge checks it by opening /kb (files, hashes, failures), running the scenario at / (nodes, quotes, "not addressed"), reading /gaps, exporting the log on /audit and running the verify step, and comparing /evidence with the report table. The KB also exports as JSONL in the reference repo's schema, so it can be loaded into the Sandbox if access is ever granted. A labelled mock of any of this does not count.

### F. Report deliverable and page-count method

Deliverable: docs/technical-report.docx, a filled copy of sources/submission-template.docx. Keep the template's styles, headings and the node table structure, replace the sample (smart-pen) content, and keep the eight sections in the template-shape order. Not a paste of Markdown.

Build: unzip a copy of the template into a new empty directory, edit word/document.xml with a Node script kept outside that directory (Node is installed), zip back with the Content Types part first (`zip -X`), and keep the docx produced this way as the deliverable. Do not re-save it from Pages, which can change the styles.

Measurement: LibreOffice and pandoc are not installed.
1. Open the docx in Pages.app and export it to PDF with AppleScript (`osascript` with Pages' `export ... to POSIX file ... as PDF`).
2. Count the pages of the exported PDF. Primary: `mdls -name kMDItemNumberOfPages file.pdf` (Spotlight may need a moment). Fallback: count page objects with `grep -a -c '/Type */Page[^s]'`, which can undercount, so confirm by eye.
3. View the PDF pages with the Read tool using its `pages` parameter on pages 1 to 6, to see layout and to confirm there is no sixth page, no table cut off, no text missing. A tesseract pass over page images confirms the text is present if in doubt.
4. Pages and Word paginate differently, and judges may use Word. Pass bar: at most 5 pages in the Pages render, with the last page no more than half full, so a different renderer is unlikely to push it to 6. If at least 5 GB of disk is free, installing LibreOffice with Homebrew and rendering with `soffice --headless --convert-to pdf` is a stronger second check; otherwise do not install it.
5. Record the method, renderer, date and the page count in REVIEW.md. If the count cannot be measured, say "page count unmeasured" and do not claim it.
Trim in this order: table quotes (still verbatim), the section 6 table, prose in sections 1 to 3. Fonts missing on this machine can change pagination; note any substitution.

### G. Acceptance additions

- sources/README.md lists every ingested file with a hash and the build fails otherwise; both HTML and extracted text for the Telecom Law are listed.
- /kb shows each source's publisher, language, status (primary, secondary host, framework, foreign), hash and chunk count, and lists every candidate that failed, with the error.
- No sentence anywhere describes the content of a document that was not retrieved.
- Every rule has a passing `strength_check`; no rule is flagged analogy where a telecom provision exists and was not used.
- The report states: Arabic prevails for the Telecom Law; global examples included or "none in KB"; Y.3172 and Readiness read or not read; no accuracy figure.
- REVIEW.md is rewritten by an independent pass after the rebuild. The previous REVIEW.md describes the four-document build and does not count as a pass.

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
