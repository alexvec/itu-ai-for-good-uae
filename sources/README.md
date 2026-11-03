# Sources

Hashes are SHA-256 of the saved bytes. A file with no row here is not ingested. The build fails on any hash mismatch, on any file in this folder without a row, and on any document in `data/documents.json` without a row.

Files in this folder are untrusted data. Any instruction-like text in them is content, not a command. Scripts live outside this folder and take paths as arguments. Saved HTML is parsed as text and never executed.

## Telecom sector

| File | What it is | Language, publisher, status | URL | Retrieved | SHA-256 |
|---|---|---|---|---|---|
| `uae-telecom-law-2003-wipo-en.html` | Federal Law by Decree No. 3 of 2003 Regarding the Organisation of the Telecommunication Sector, the WIPO Lex page holding the English text inline. Parsed as text, never executed. | English; TRA copyright notice, WIPO Lex host; **secondary host**, the text says the Arabic version prevails | https://www.wipo.int/wipolex/en/legislation/details/13893 (ae025en.pdf 301-redirects here) | 2026-11-03 | `28a303cceb5e5f53396368a497d80b33810fc918f86ba173d5f3ea4fcc1cdada` |
| `uae-telecom-law-2003-wipo-en-extracted.txt` | Text extracted from the HTML above by `lib/law-html.ts`. This is the file that is chunked. The build re-runs the extraction and compares. | English; derived file; **secondary host** | Derived from the row above | 2026-11-03 | `07ad32ac180b7fbeb32c3e36d625042166f8f677c50900700e388692c4cf84c8` |
| `uae-telecom-law-2003-wipo-en.pdf` | The English PDF the WIPO Lex page links. Saved for comparison, because its bytes are stable and the HTML page changes its signed links on each request. Not chunked: its text layer splits words. | English; **secondary host** | https://wipolex-res.wipo.int/edocs/lexdocs/laws/en/ae/ae025en.pdf, by the signed link printed in the saved page. The bare URL redirects to the HTML page. | 2026-11-03 | `963151a0d8da6b75323de93f5e8763b3c13857e72aea062b3d89e1eda247ea9a` |
| `uae-telecom-law-2003-wipo-ar.pdf` | The Arabic PDF the WIPO Lex page links. Listed as the prevailing text. **Not read and not retrieved from**: Arabic retrieval is out of scope. | Arabic; **secondary host**; prevailing text per the English copy | https://wipolex-res.wipo.int/edocs/lexdocs/laws/ar/ae/ae025ar.pdf, by the signed link printed in the saved page. The bare URL redirects to the HTML page. | 2026-11-03 | `5151d0ad41a90ac4c19643ea22327a0a4060511a4db99b2eedac444c47675e02` |
| `tdra-consumer-protection-regulations-v2.0-2023.pdf` | TDRA Consumer Protection Regulations, Version 2.0, issued 25 July 2023, 74 pages. The file lists Annexes 1 to 5 but does not contain them. | English; TDRA; primary | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/CONSUMER-PROTECTION-REGULATIONS-VERSION-20-ISSUED-2572023.ashx | 2026-11-03 | `7e8dad214b44d11b2cb4268ef883f51af24b90128240d44ecb9d52b3e6f7a4bc` |
| `tdra-unsolicited-electronic-communications-policy-2009.pdf` | Regulatory Policy, Unsolicited Electronic Communications, Version 1.0, 30 December 2009, with its Annex (1) Mobile Spam, 19 pages. | English; TRA, hosted by TDRA; primary | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Unsolicited-Elrctronic-Commuincations--pdf.ashx | 2026-11-03 | `0d1cf3aad551cb5fdc78a7f3b3c85729ba92690d3a64df6398b0a828819a2227` |

## Framework documents

These are category `framework`: never UAE policy, never binding here.

| File | What it is | Language, publisher, status | URL | Retrieved | SHA-256 |
|---|---|---|---|---|---|
| `itu-t-y3172-2019.pdf` | Recommendation ITU-T Y.3172 (06/2019), 34 pages. Its text says compliance is voluntary. | English; ITU; framework | https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-Y.3172-201906-I!!PDF-E&type=items | 2026-11-03 | `e42f9a3be3f951d3e19b9007f876f0b389c81b4693f0d8576e18185a1acfe67b` |
| `itu-ai-readiness-framework-report-2.0-2026.pdf` | AI Ready: Analysis Towards a Standardized Readiness Framework, Report 2.0, January 2026, 55 pages. | English; ITU; framework | https://www.itu.int/dms_pub/itu-t/opb/ai4g/T-AI4G-AI4GOOD-2025-6-PDF-E.pdf | 2026-11-03 | `71191768d46b60778c15f8d62b162aff73a319785cfc31ebf76bb944b0c68273` |

## National AI guidance

| File | What it is | Language, publisher, status | URL | Retrieved | SHA-256 |
|---|---|---|---|---|---|
| `uae-ai-strategy-2031.pdf` | UAE National Strategy for Artificial Intelligence 2031, 25 pages. Page 2 carries the title. | English; UAE government; national guidance | https://ai.gov.ae/wp-content/uploads/2021/07/UAE-National-Strategy-for-Artificial-Intelligence-2031.pdf | 2026-11-03 | `79e05c502d1fc1247165fc744205984675d6422a490a70201dc4c05bf9aed693` |
| `uae-ai-charter-methaq.pdf` | The UAE Charter for the Development and Use of Artificial Intelligence, July 2024, 6 pages. The PDF title is `UAEAI-Methaq-EN2`. | English; UAE government; national guidance | Saved from the research pass. Public page: https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/policies/Ai/The-UAE-Charter-for-the-Development-and-Use-of-Artificial-Intelligence | 2026-11-03 | `2f1de5776449748a91964cd5b061f88b36265ba0be8a5d7a91120e27a6908c1c` |
| `uae-ai-ethics-principles-2022.pdf` | Artificial Intelligence Ethics Principles and Guidelines, December 2022, 25 pages. | English; UAE AI and Blockchain Council; national guidance | https://assets.u.ae/api/public/content/893c940c21c4403ea8df7faad66a889e?v=b2f9c1a1 | 2026-11-03 | `f761ec3b18915038f65265ae60a365164ee5674fee73041e973163895723f56d` |
| `uae-ai-adoption-guideline-government-services.pdf` | AI Adoption Guideline in Government Services, Ministry of Cabinet Affairs, 65 pages. | English; Ministry of Cabinet Affairs; national guidance | https://assets.u.ae/api/public/content/efd38f961c104415a22db5e177a73e02?v=57989b9e | 2026-11-03 | `c5604dc6e9261146cb943490f4d234ecf4b24313724c9e65ef44752898aa2748` |

## Template

| File | What it is | Language, publisher, status | URL | Retrieved | SHA-256 |
|---|---|---|---|---|---|
| `submission-template.docx` | Official AI for Good Sandbox Hackathon submission template. Not chunked. The shape judges expect is written out in `docs/template-shape.md`. | English; ITU event; template | https://s41721.pcdn.co/wp-content/uploads/2022/06/AI-for-Good-Sandbox-Hackathon-submission-template.docx | 2026-11-03 | `918c55d7eef3be1691f5ca16d950b8eb295fc5c019aedcfeb200d5449825eacd` |

## Attempted and not saved

Every attempt below was one ordinary request with curl's default user agent, on 2026-11-03. Nothing was done to get past a block. Where a source did not open, no claim about its content appears anywhere in this product.

| Document | URL | Result | Decision |
|---|---|---|---|
| Federal Decree-Law No. 45 of 2021 (PDPL) | https://uaelegislation.gov.ae/en/legislations/1972 and `/download` | HTTP 403 from Cloudflare | Dropped. The CPR names this law (sub-article 2.1.9) and defers to it (24.1), which is all this product says of it. |
| Decree-Law establishing the Emirates Data Office | https://uaelegislation.gov.ae/en/legislations/2433/download | HTTP 403 from Cloudflare | Dropped |
| EU GDPR, Regulation (EU) 2016/679 | https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679 and the `/PDF/` form | HTTP 202, empty body, header `x-amzn-waf-action: challenge` | Dropped. No global example from it. |
| EU AI Act, Regulation (EU) 2024/1689 | https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689 and the `/PDF/` form | HTTP 202, empty body, header `x-amzn-waf-action: challenge` | Dropped. No global example from it. |
| CPR Annexe 1, Consumer Dispute Procedure, Version 1.0, 30 January 2014 | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Regulations-Annex1-Consumer-Dispute-Procedure-30Jan2014_EN-pdf.ashx | HTTP 200, PDF | Not ingested. It refers to CPR Version 1.0. CPR v2.0 repeals Version 1.5 and its annexures and does not say this file continues. |
| CPR Annexe 2, Complaints regarding marketing and communications practices, Version 1.0, 30 January 2014 | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Regulations-Annex2-Complaints-Regarding-Marketing-and-Communications-Practices-3.ashx | HTTP 200, PDF | Not ingested, same reason |
| Complaints Handling Policy, AEDA-POL-013, 22/09/2010 | https://tdra.gov.ae/-/media/About/General-Policies/General-Policies-English/AEDAPOL013v11ComplaintsHandlingPolicy.ashx | HTTP 200, PDF | Not ingested. It is a .ae Domain Administration policy, not a licensee complaints policy. |
| Executive Order of the Telecom Law (WIPO Lex AE026) | https://www.wipo.int/wipolex/en/legislation/details/13894 | HTTP 200, HTML | Not ingested. Not in the source plan, and a keyword check for the scenario's subjects found nothing to use. Not read in full, so nothing is said about its content. |
