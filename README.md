# Y.3172 Incident Counsel

A policy and legal adviser agent for machine-learning functions in a telecom network. Built for the ITU AI for Good Lab Hackathon (UAE), telecommunications track. A working label and a hackathon prototype.

Live: https://itu-ai-for-good-uae.vercel.app

**Not legal advice.** Scenarios are synthetic. No operator was consulted.

## What it does

When something happens in an ML-enabled network, the agent:

1. classifies the event to ITU-T Y.3172 pipeline nodes (SRC, C, PP, M, P, D, SINK, plus MLFO and the ML sandbox);
2. fires pre-agreed rules, each citing a chunk id, an article or page as printed, and a verbatim quote, with an action no stronger than the quote;
3. settles conflicts between sources with a pre-agreed precedence rule, PA-01, showing both quotes;
4. retrieves further passages with BM25, keyed by node;
5. says what the documents leave open, as "not addressed in the ingested documents", and feeds that to a gap view tagged by AI Readiness dimension;
6. writes every step to a hash-chained audit log you can export and verify.

The main scenario follows the event template: the deployment is popular, it causes a controversy, the knowledge base decides the action, then a consumer issue escalates to a data-privacy breach and the knowledge base decides again. It is synthetic and is not evidence of coverage.

It needs no model and no API key.

## Run it

Node 24 or later.

```sh
npm ci
npm run dev        # http://localhost:3000
npm test           # unit and data checks
npm run build      # checks source hashes and chunks first, and fails on a mismatch
npx playwright install chromium
npx playwright test    # walks docs/demo-path.md against a local build
BASE_URL=https://itu-ai-for-good-uae.vercel.app npx playwright test    # or against the live site
npm run evidence   # prints the report tables as Markdown
node scripts/verify-audit.ts audit.jsonl    # verifies an exported audit log
```

## What the knowledge base contains

Nine documents, retrieved on 2026-11-03. Each file has a row in `sources/README.md` with its URL and SHA-256. The build fails on a hash mismatch, on a file in `sources/` with no row, and if the extracted law text is not what the saved HTML yields.

| File | What it is | Status | Extraction | Licence or copyright as stated |
|---|---|---|---|---|
| `uae-telecom-law-2003-wipo-en-extracted.txt`, from `uae-telecom-law-2003-wipo-en.html` | Federal Law by Decree No. 3 of 2003 | Secondary host (WIPO Lex). The document says the Arabic version prevails in case of any discrepancy. | Saved HTML parsed as text by `lib/law-html.ts`, cut at "Article (N)" | COPYRIGHT 2005, TRA, ALL RIGHTS RESERVED |
| `tdra-consumer-protection-regulations-v2.0-2023.pdf` | TDRA Consumer Protection Regulations v2.0, 25 July 2023 | Primary. Annexes listed but not in the file. | Text layer (PyMuPDF), cut at sub-article numbers | No notice found |
| `tdra-unsolicited-electronic-communications-policy-2009.pdf` | TRA regulatory policy, 30 December 2009, with Annex (1) | Primary. Current status beyond its own text not checked. | Text layer (PyMuPDF), cut at clause numbers | Copyright 2009 TRA, all rights reserved |
| `uae-ai-strategy-2031.pdf` | National strategy | National guidance. States no legal force of its own. | Text layer (pypdf), OCR on pages 1 and 25 | None stated |
| `uae-ai-charter-methaq.pdf` | Charter, July 2024 | National guidance. Calls itself a guiding framework. | Text layer (pypdf). Lost ligatures stay as U+FFFD | None stated |
| `uae-ai-ethics-principles-2022.pdf` | Ethics principles, December 2022 | National guidance. Calls its guidelines non-binding. | Text layer (pypdf), OCR on page 25 | CC BY 4.0, owner the UAE AI and Blockchain Council |
| `uae-ai-adoption-guideline-government-services.pdf` | Government-services guideline | National guidance. **Applied to telecom by analogy only, labelled on screen.** | Text layer (pypdf), OCR on pages 36 and 56 | None stated |
| `itu-t-y3172-2019.pdf` | Recommendation ITU-T Y.3172 | Framework, voluntary by its own text. Not UAE policy. | Text layer (PyMuPDF) | ITU 2019, all rights reserved, no reproduction without prior written permission |
| `itu-ai-readiness-framework-report-2.0-2026.pdf` | AI Ready Report 2.0, January 2026 | Framework, informational by its own text. Not UAE policy. | Text layer (PyMuPDF) | None stated; extract requests go to jur@itu.int |

Saved and hashed, not chunked: the English PDF of the law (`uae-telecom-law-2003-wipo-en.pdf`), the Arabic PDF of the law (`uae-telecom-law-2003-wipo-ar.pdf`, listed as the prevailing text, not read), and the event template.

Every quote is a verbatim slice of a stored chunk, and every chunk is a verbatim slice of stored text. Article numbers come from that text. `/kb` also has the full table of what was attempted.

## What it does not contain

- **The Data Protection Law (Federal Decree-Law No. 45 of 2021).** Both URLs returned HTTP 403. The CPR names it and says it prevails over CPR Article 24 on any inconsistency, so every Article 24 answer here is subject to a text this product has not read. Nothing here states what it says, and no secondary copy is used.
- The Emirates Data Office decree (HTTP 403), the CPR annexes, any licence, and any amendment beyond the footnotes in the saved law text. The Arabic text was not read.
- **Global examples.** The GDPR and the EU AI Act on EUR-Lex returned HTTP 202 with an empty body and a challenge header, so neither was retrieved. The gap view says "no global example in KB". None is written from memory.
- "Not addressed in the ingested documents" describes these files only, found by a word search. It says nothing about what UAE law requires outside them. Every gap is a candidate that needs human legal review.
- The rules in `data/rules.json` and the conflicts in `data/conflicts.json` were drafted in this build. No lawyer has reviewed them. PA-01 is the author's design choice, not a statement of UAE legal hierarchy.
- The node-to-dimension table is the reference repo's, because the Readiness report does not give one per node. Dimension names and factor statements are read from the report.

## How it is built

- Next.js on Vercel. Retrieval is in-process BM25 over `kb/chunks.json`. The agent is rules in data files: `data/event-classes.json`, `data/rules.json`, `data/conflicts.json`, `data/precedence.json`, `data/controls.json`, `data/template-outcomes.json`.
- Each rule carries `strength_check` (text modal, action verb, result), and `lib/strength.ts` recomputes it in the tests.
- Free-text classification is keyword matching, so it can miss a paraphrase.
- Each quote on screen has a "verify" button. It re-finds the quote in its chunk and the chunk in the stored text, and shows the offsets and the file hash.
- The audit log is held in the browser session. The hash chain makes an edit evident. Someone who recomputes the whole chain could forge a new one, so compare the head hash with a copy kept elsewhere.
- `/api/kb.jsonl` exports the KB in the reference repo's chunk schema with additive fields, for loading into the AI for Good Sandbox. The Sandbox itself was not used.
- `/evidence` and `/api/evidence.md` generate the report tables from the data files the app reads.

## Rebuilding the KB

The stored text is committed, so a normal build needs none of this. To regenerate it, use a Python with PyMuPDF and keep scripts outside `sources/`:

```sh
<venv>/bin/python -I scripts/extract_pdf_mupdf.py sources/<file>.pdf kb/extracted/<file>.json
node scripts/extract-law.ts
npm run kb:build
```

## The technical report

`node scripts/build-report.mjs` fills a copy of `sources/submission-template.docx` from Part B of `docs/submission.md`. `node scripts/measure-report.mjs <docx>` exports it to PDF through Pages.app and counts pages. See the header of each script.

## Optional model

Set all three to use any OpenAI-compatible endpoint:

| Variable | Meaning |
|---|---|
| `LLM_BASE_URL` | Endpoint base, for example `http://localhost:11434/v1` |
| `LLM_API_KEY` | API key |
| `LLM_MODEL` | Model name |

The model only rewords the narrative and suggests classes for free text. Its output is logged as a separate step marked `model-generated`, and is discarded if it brings in an article number, a chunk that was not retrieved, or a quotation that is not in the retrieved text. Unset or failing, the app behaves as default.

## Licences and attribution

- Code: MIT, see `LICENSE`.
- Third-party files in `sources/` and the text derived from them in `kb/` are not covered by the MIT licence. Their stated status is in the table above. Several carry all-rights-reserved notices and are kept here so the hashes and quotes can be checked; no permission from their owners has been sought.
- No UAE office, TDRA or ITU endorses this project.
- `data/framework/dimensions.json` and `node-mapping.json` hold taxonomy from [CrashingGuru/ITUAIReadiness](https://github.com/CrashingGuru/ITUAIReadiness) (MIT, Copyright (c) 2026 Vishnu Ram OV; notice in `data/framework/LICENSE.ITUAIReadiness`).
