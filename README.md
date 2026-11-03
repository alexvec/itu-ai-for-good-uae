# Y.3172 Incident Counsel

A policy and legal adviser agent for machine-learning functions in a telecom network. Built for the ITU AI for Good Lab Hackathon (UAE), telecommunications track. A working label and a hackathon prototype.

Live: https://itu-ai-for-good-uae.vercel.app

**Not legal advice.** Scenarios are synthetic. No operator was consulted.

## What it does

When something happens in an ML-enabled network, the agent:

1. classifies the event to ITU-T Y.3172 pipeline nodes (SRC, C, PP, M, P, D, SINK, plus MLFO and the ML sandbox);
2. fires pre-agreed rules, each citing a chunk id and a verbatim quote;
3. retrieves further passages with BM25, keyed by node;
4. says what the documents leave open, as "not addressed in the ingested documents", and feeds that to a gap view tagged by AI Readiness dimension;
5. writes every step to a hash-chained audit log you can export and verify.

The main scenario follows the event template: the deployment is popular, it causes a controversy, the knowledge base decides the action, then a consumer issue escalates to a data-privacy breach and the knowledge base decides again.

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

## Sources and their limits

The knowledge base is exactly four files, retrieved on 2026-11-03. Hashes are in `sources/README.md` and are checked at build time.

| File | What it is |
|---|---|
| `uae-ai-strategy-2031.pdf` | National strategy. Its text states no legal force of its own. |
| `uae-ai-charter-methaq.pdf` | Charter of general principles, July 2024. It calls itself a guiding framework. |
| `uae-ai-ethics-principles-2022.pdf` | Ethics principles and guidelines, December 2022. It calls its guidelines non-binding. |
| `uae-ai-adoption-guideline-government-services.pdf` | Guidance for government services. **Applied to telecom by analogy only, and labelled so on screen.** |

Extraction, stored per page in `kb/extracted/`:

- 196 chunks. Each is a slice of one stored page, with its page number, about 256 words with about 30 of overlap.
- Pages with no usable text layer were read with tesseract and are labelled OCR-derived in the data and on screen: Strategy pages 1 and 25, Ethics page 25, Guideline pages 36 and 56. The OCR of Guideline pages 36 and 56 is noisy. No rule rests on OCR.
- Guideline page 2 is decorative artwork with no words and is not ingested.
- The Charter's text layer stores the "Th" and "ff" ligatures as U+FFFD. They are left as they are, so some Charter quotes start after that character.
- These documents have no articles. Citations give the PDF page and the heading. The page index is the PDF's, and many PDF pages are two-page spreads.

## What is not in the knowledge base

- **The KB has no binding telecom sector law.** The Telecom Law (Federal Law by Decree No. 3 of 2003) and the PDPL exist and were not ingested. No text from them appears here.
- "Not addressed in the ingested documents" describes these four files only. It says nothing about what UAE law requires. Every gap is a candidate that needs human legal review.
- The words "telecom", "subscriber", "interception", "breach", "purpose limitation", "sandbox" and "emergency" do not occur in the four files. `/kb` counts them live.
- No global examples: no foreign instrument was ingested, and none is written from memory. The UAE documents mention some foreign practice in passing; those passages are not offered as global examples.
- The pre-agreed rules in `data/rules.json` were drafted in this build. No lawyer has reviewed them.

## How it is built

- Next.js on Vercel. Retrieval is in-process BM25 over `kb/chunks.json`. The agent is rules in data files: `data/event-classes.json`, `data/rules.json`, `data/controls.json`, `data/template-outcomes.json`.
- Free-text classification is keyword matching, so it can miss a paraphrase.
- The audit log is held in the browser session. The hash chain makes an edit evident. Someone who recomputes the whole chain could forge a new one, so compare the head hash with a copy kept elsewhere.
- `/api/kb.jsonl` exports the KB in the reference repo's chunk schema with additive fields, for loading into the AI for Good Sandbox. The Sandbox itself was not used.
- `/evidence` and `/api/evidence.md` generate the report tables from the data files the app reads.

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
- The source PDFs and the text derived from them in `kb/` remain their publishers' work and are not covered by the MIT licence. The AI Ethics Principles and Guidelines are CC BY 4.0, with the UAE AI and Blockchain Council as owner; no UAE office endorses this project.
- `data/framework/` holds taxonomy from [CrashingGuru/ITUAIReadiness](https://github.com/CrashingGuru/ITUAIReadiness) (MIT, Copyright (c) 2026 Vishnu Ram OV; notice in `data/framework/LICENSE.ITUAIReadiness`). It is structure, not KB content.
