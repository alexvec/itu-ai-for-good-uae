# Competition rules: AI for Good Lab Hackathon: United Arab Emirates

Researched 2026-11-03, reading only. No registration, login, or form submission was done.

Primary source (EVENT): https://aiforgood.itu.int/event/ai-for-good-sandbox-hackathon-united-arab-emirates/
Registration page (REG): https://aiforgood.itu.int/ai-for-good-sandbox-hackathon-uae-apply/
Reference repo (REPO): https://github.com/CrashingGuru/ITUAIReadiness

Method caveat: pages were read through a fetch tool that summarizes with a small model and limits quotes to about 125 characters. Quotes below are exact only where shown in quotation marks. Everything else is paraphrase and should be re-read on the page by the operator before relying on it.

## Pages that could not be fully read

- The rulebook, terms, and guideline PDFs linked from REG belong to the Robotics for Good Youth Challenge (organizer forms), not this hackathon. They were not opened. Applicability to this event: unverified.
- REG, as returned, mixed this hackathon's form with Robotics for Good Youth Challenge organizer and interest forms. Only the first form is relevant (REG).
- The submission template .docx (https://s41721.pcdn.co/wp-content/uploads/2022/06/AI-for-Good-Sandbox-Hackathon-submission-template.docx) was not opened. Its contents are unverified.
- ITU-T Y.3172 and the AI Readiness Framework 2.0 PDF were not opened.
- The mentoring Zoom registration and recordings (passcode-gated) were not opened.
- The Google Sheets for detailed team information are not linked in anything I could read. Fields unknown.
- No separate terms/rules/FAQ page exists beyond the FAQ section on EVENT, as far as I could reach.

## Dates (EVENT)

- Registration open until 5 November 2026.
- Mentoring sessions: 3, 10, 17, 24, 31 October and 7 November 2026; FAQ says weekly Saturdays 10:00 to 11:00 CEST, recorded.
- Submission deadline: 10 November 2026.
- First-round evaluation: 11 to 18 November 2026.
- Shortlist announced: 18 November 2026.
- Final evaluation: 8 December 2026, 09:00 to 17:00 GST, onsite at Dubai Exhibition Centre, Expo City Dubai, during GITEX Global.
- Award ceremony: 10 December 2026, onsite, Dubai.
- Submission time of day and timezone for 10 November: unverified.

## Eligibility and team (EVENT)

- "The team should be a maximum of 4 people." Examples given: 4 participants, or 3 participants plus 1 internal mentor.
- No minimum team size was found. No rule requiring more than one person was found. A solo entry is not forbidden on any page read, but also not explicitly allowed: treat as unverified. The REG form lists Team leader as required and Teammate 1 to 3 as not marked required (REG, summarized).
- "Only teams with a woman leader are eligible for the Special Prize for Women's Team."
- No nationality, residency, age, or affiliation restriction was found on EVENT or REG. Absence of a rule is not confirmation that none exists: unverified for any rules in unopened documents.
- FAQ: participants may join multiple teams and make multiple submissions; team name and domain can change until final submission; dropouts need no notification; an idea may be reused across challenges if each challenge's requirements are met (EVENT, paraphrase).

## Task (EVENT, paraphrase unless quoted)

- Domains: healthcare, education, telecom, public services (REG form options: Education, Healthcare, Government services, Telecommunications). EVENT also mentions agriculture.
- Build an AI agent based solution using a knowledge base built from use-case documentation and code.
- Solutions must map to the country's published documents (laws, national AI, digital and cybersecurity strategies, data-protection law, treaty obligations, "intellectual property regimes").
- Agent role options: innovative AI solution, policy and legal adviser, institutional participant, multi-agent coordination.
- Interactive error scenarios with "sequenced, chunked events released progressively".
- Audit logging and chain-of-thought tracing.
- Align with ITU-T Y.3172 and ITU AI Readiness Framework 2.0.
- Focus on domain-specific policy gaps and global policy examples, not country-specific recommendations.

## Country of the knowledge base

- EVENT says the knowledge base is "country-specific" and mapped to documents "provided by the country", and that the open knowledge base is led "under the leadership of UAE" and published "with acknowledgement to UAE". The page does not state outright that the country is fixed to UAE or that teams may choose another. Treat as unverified; the UAE is the strongly implied country given the event title.
- Provided datasets: none found on EVENT. Whether UAE documents are supplied to teams: unverified. The sandbox, which hosts the knowledge base, may supply them for selected participants: unverified.

## Sandbox, partners, mandated technology

- EVENT: "Use the cloud credits in the Sandbox to fine-tune AI models and create AI agents". Benefit: "Access to ITU AI for Good Lab and sandbox" "for selected hackathon participants".
- The knowledge base is hosted in the ITU AI for Good Lab (EVENT, paraphrase).
- Reference code for KB creation: REPO, MIT License. Includes a `simulation` folder and a Colab notebook. No API keys or accounts listed on the repo page (REPO).
- No required model, cloud, or commercial partner technology was found. No partner tracks were found. The only named technologies are ITU-T Y.3172, the ITU AI Readiness Framework 2.0, and the ITU AI for Good Lab/Sandbox.
- Whether use of the Sandbox is mandatory for submission: unverified (the page offers it to "selected" participants; the selection process is not described).

## Submission (EVENT)

Required:
1. "Technical Report (Max 5 pages)" using the template linked above. FAQ lists required sections: introduction, use case, requirements, Y.3172 mapping, AI Readiness Framework 2.0 mapping, local policy mapping, evaluation scenario, policy and standards gaps.
2. "Github repository". FAQ: only essential code needs to be public; this "might or might not influence the judges' decision."
3. "Knowledge base containing policies, regulations, and strategies".
4. "Optional: Demo video (max 7 minutes)". Required for shortlisted teams after the first round (per the operator's note and the summarized page). Content per FAQ: hardware and software setup, main functions, expected outcomes per scenario, real outcomes.

Submission channel, URL, and form fields for final submission: unverified. FAQ says the initial form only gauges interest and detailed team information is collected later via Google Sheets.

## Registration form fields (REG)

Name*, Email*, Organization*, Designation*, Gender (Male, Female, Others, Prefer not to say), Team name*, Team leader*, Teammate 1 (mentor/teammates), Teammate 2, Teammate 3, Use case domain (Education, Healthcare, Government services, Telecommunications). "All fields marked * are mandatory." Which of the optional-looking fields are truly required: confirm on the live form.

## Judging criteria (EVENT)

Five criteria, no weights or scores published (weights: unverified, not stated):
1. Knowledge base quality: "completeness, accuracy, and structure of ingested national material", retrieval of relevant policy context.
2. Agent capability: relevance and accuracy of responses in simulated error scenarios, identifying applicable solutions within laws and mandates.
3. Policy, strategy, and standards gap identification: relevance of gaps and accuracy of global examples are described as critical.
4. Auditability: logs, reasoning traces, source attribution.
5. Alignment with ITU standards: Y.3172 pipeline and AI Readiness Framework in the architecture.

FAQ: "Accuracy of the AI Prototype does not fall under any evaluation criteria." Judges' prize considers engagement and potential for research, development, innovation, or standards work.

## Prizes (EVENT)

- First grand prize 1500 CHF; second 1000 CHF; third 600 CHF; Women's Team special prize 600 CHF; Judges' prize for teams 1000 CHF.
- "A maximum of one prize will be awarded per team."
- Certificate of participation for teams with a valid submission.
- Travel: "Sponsorship for travel is provided for oversea selected teams." Selection criteria and amount: unverified.
- Possible deployment of winning solutions in the 2027 Summit live multi-country error exercise (EVENT, paraphrase).

## License, IP, data

- No licence requirement for entries, no IP assignment clause, no data rules, and no disqualification rules were found on EVENT or REG. All unverified.
- EVENT: the outcome includes publishing the open knowledge base in the ITU AI for Good Lab with acknowledgement to UAE; follow-ups include contributing "the code and models as open-source resources" (paraphrase). Whether this is mandatory for entrants: unverified.
- Terms and conditions for this hackathon: not found.

## Disqualification rules

None found. Unverified.

## Credits and conditions (second pass, 2026-11-03)

Pages opened: EVENT, the Kenya, Saudi and Riyadh pages below. Read only; nothing was claimed.

- Sandbox cloud credits: EVENT says to "Use the cloud credits in the Sandbox" and offers access to the AI for Good Lab and sandbox "for selected hackathon participants" (https://aiforgood.itu.int/event/ai-for-good-sandbox-hackathon-united-arab-emirates/). Amount, code, claim page, who is selected, products covered, exclusions, expiry, and whether a payment method is needed: not stated.
- Claim route: none found. EVENT links no application or claim page for credits. The only dated step that could relate to selection is the first-round evaluation, 11 to 18 November 2026, with the shortlist on 18 November (same URL). Link between shortlist and sandbox access: unverified.
- Promo or coupon code: none published on any page opened. Mark any code as unverified.
- Kenya (https://aiforgood.itu.int/event/ai-readiness-hackathon-kenya/), Saudi (https://aiforgood.itu.int/event/ai-readiness-hackathon-kingdom-of-saudi-arabia/) and Riyadh results (https://aiforgood.itu.int/the-itu-ai-readiness-hackathon-names-four-winning-solutions-in-riyadh/) state no credits. The Kenya and Saudi pages say teams work with the "ITU AI-RE Toolkit"; its access terms were not given on those pages.
- Reference code (MIT, https://github.com/CrashingGuru/ITUAIReadiness) needs no key per the earlier read.
- Conclusion: no claimable credit exists for the agent to redeem. Nothing added to NEEDS.md for credits.

## Past winners

Every item below is a DIFFERENT event from this UAE hackathon. Read through a summarising fetch tool; winner names are as the summary reported them from the page.

1. AI Readiness Hackathon, Kingdom of Saudi Arabia (Riyadh, 14 September 2026; organised by ITU and ICAIRE). Different event, same series, most recent edition.
   - Pages: https://aiforgood.itu.int/event/ai-readiness-hackathon-kingdom-of-saudi-arabia/ and https://aiforgood.itu.int/the-itu-ai-readiness-hackathon-names-four-winning-solutions-in-riyadh/
   - Winners (both pages): 1st SANAD; 2nd AI Guardian; 3rd Samaam; Women's Team prize Nakheel Doctor. The event page links each winner's GitHub repository; the repository URLs were not recorded and the repositories were not opened.
   - What they built (results article): SANAD, multi-agent mapping of Saudi financial regulation (SAMA) to NIST standards, rejecting findings without a verbatim citation. AI Guardian, a governance, risk and regulatory-intelligence platform separating AI assistance from deterministic compliance controls. Samaam, a policy gateway for oncology radiology that checks patient renal function and requested settings against Saudi regulation and returns "HTTP 403: Policy Violation" with provision and source link. Nakheel Doctor, Red Palm Weevil detection with a RAG knowledge base of Saudi guidance, citing evidence and requiring human confirmation for higher-impact actions.
   - Scoring: four criteria, no weights: use case described against the Y.3172 ML pipeline; mapping to AI Readiness factors and dimensions; contribution to the knowledge base, reviewed by ITU experts; input to AI strategies and policies, reviewed by policymakers. Reference links required for knowledge-base material. Judges named in the article: Vishnu Ram (ITU), Mariagrazia Squicciarini (UNESCO), Mohammed Aldrees (ETEC); the article gives no scoring method.
   - Prizes (event page): USD 3,000 total, 1,200 / 800 / 500, Women's 500. The results article mentions certificates and no money. Conflict between the two pages; unresolved.
   - Page status conflict: the event page marks applications closed yet lists winners.
2. AI Readiness Hackathon, Kenya (showcase 21 May 2026, KICC Nairobi, AI Everything Kenya x GITEX Kenya). Different event. Correction: the director's note said 2025; the page dates it 2026.
   - Page: https://aiforgood.itu.int/event/ai-readiness-hackathon-kenya/
   - Winners: 1st The Eagles; 2nd Tai Educators; joint 3rd Altura and Root ED; Women's prize TOKIVA Sisters. Team leaders are named on the page.
   - What they built: the page does not describe the winning projects. The task was use cases in education, agriculture, health and finance aligned to Y.3172 and the AI Ready factors and dimensions, plus national AI policy papers with reference links for the knowledge base.
   - Scoring: the same four criteria as Saudi, no weights. Prize amounts on the page are inconsistent (pool USD 1,500 versus a different winners table); unresolved.
3. AI Environmental Footprint Measurement Hackathon (August to October 2025; final 16 October 2025). Different event and topic, not the readiness series.
   - Page: https://aiforgood.itu.int/ai-environmental-footprint-measurement-hackathon/
   - Winners: 1st GreenMind; 2nd "Standardizing Energy Models for Large-Scale AI Training with Long-Term Sustainability Projections"; 3rd EcoAI Tracker. Prize: CHF 3,000 / 1,500 / 500 and a COP30 presentation chance.
   - What they built: the page lists no project descriptions. Task: proof-of-concept measuring carbon and water footprint of AI systems.
   - Scoring: innovation, accuracy, feasibility, impact, presentation, usability. No weights.
   - Not a Y.3172 or policy-mapping event.

Earlier Sandbox hackathon editions: a search of aiforgood.itu.int returned only the three events above. The submission template URL carries a 2022 path (wp-content/uploads/2022/06), which suggests an earlier Sandbox hackathon; no page for it was found or opened. Unverified.

This edition (UAE): EVENT mentions no gallery of projects, past winners or earlier hackathon editions (checked on the page). No gallery exists on pages opened. Winners not yet published; final evaluation 8 December 2026 and ceremony 10 December 2026 (EVENT).

What the scored mapping asks for, across the series: Y.3172 mapping of the use case; AI Readiness factors and dimensions; a knowledge base with reference links, reviewed by ITU experts; and input to AI strategies and policies. The UAE EVENT adds five criteria (listed under Judging criteria above), including auditability and source attribution. The Riyadh winners emphasised verbatim citation, traceable decisions, deterministic policy checks, and human confirmation, according to the results article. No page describes the winners' scores.

## Telecom sources: candidate list

Status is based on what the fetch tool returned. OPENED means the page or file returned a response that I could read as a summary. A summary read establishes only that a document exists and what it covers. No quotes or article numbers are recorded. The builder must download the bytes and quote from them. Several PDFs returned as binary, so content could not be summarised; marked OPENED-BINARY.

| # | Document | Publisher | Language | URL | Covers | Status |
|---|---|---|---|---|---|---|
| 1 | Federal Law by Decree No. 3 of 2003 Regarding the Organisation of the Telecommunication Sector (landing page) | WIPO Lex (secondary host, courtesy text; Arabic prevails) | EN, AR | https://www.wipo.int/wipolex/en/legislation/details/13893 | Chapter headings: interpretation, Supreme Committee, regulator, restructuring and licensing, networks and numbering, spectrum, network protection, transitional, penalties, final | OPENED |
| 2 | Same law, English PDF | WIPO Lex, copyright notice names the TRA | EN | https://www.wipo.int/wipolex/edocs/lexdocs/laws/en/ae/ae025en.pdf (the older wipolex-res.wipo.int path 301-redirects here) | Fetch returned an HTML page with inline text, not a PDF. About 34 pages by page markers | OPENED as HTML; PDF bytes not obtained |
| 3 | Same law, Arabic PDF | WIPO Lex | AR | wipolex-res.wipo.int/edocs/lexdocs/laws/ar/ae/ae025ar.pdf (base path reported by the page, host scheme unverified) | Authoritative text | NOT OPENED |
| 4 | Same law, government-hosted copy | tdra.gov.ae / uaelegislation.gov.ae | AR/EN | none found. The TDRA regulations index mentions the law without a link | n/a | NOT FOUND |
| 5 | TDRA regulations and rulings index | TDRA (primary) | EN page | https://tdra.gov.ae/en/About/regulations-and-ruling | 23 listed documents: 12 regulations and 11 rulings | OPENED |
| 6 | Consumer Protection Regulations Version 2.0, issued 25/07/2023 (per index) | TDRA (primary) | EN | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/CONSUMER-PROTECTION-REGULATIONS-VERSION-20-ISSUED-2572023.ashx | Consumer protection for telecom licensee services. PDF, 74 pages, 1 MB | OPENED-BINARY; content not summarised. Saved by the tool, bytes not inspected |
| 7 | Consumer Protection Regulations Annex 1, Consumer Dispute Procedure (30 Jan 2014, refers to V1.0) | TRA/TDRA | EN | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Regulations-Annex1-Consumer-Dispute-Procedure-30Jan2014_EN-pdf.ashx | Escalation of unresolved complaints to the regulator. Seen via search snippet only. May be superseded by V2.0: unverified | NOT OPENED (snippet only) |
| 8 | Consumer Protection Regulations Annex 2, Complaints regarding marketing and communications practices | TRA/TDRA | EN | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Regulations-Annex2-Complaints-Regarding-Marketing-and-Communications-Practices-3.ashx | Marketing complaints. Same supersession caveat | NOT OPENED (snippet only) |
| 9 | Complaints Handling Policy (22/09/2010 per index) | TDRA | EN | https://tdra.gov.ae/-/media/About/General-Policies/General-Policies-English/AEDAPOL013v11ComplaintsHandlingPolicy.ashx | Licensee complaints handling. Possibly superseded | NOT OPENED |
| 10 | Unsolicited Electronic Communications regulatory policy | TDRA | EN | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Unsolicited-Elrctronic-Commuincations--pdf.ashx | Spam and unsolicited messages. PDF, 19 pages, 261 KB | OPENED-BINARY; content not summarised |
| 11 | Registration Requirements for Mobile Consumers Policy | TDRA | EN | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Registration-Requirements-for-Mobile-Consumers-Policy-pdf.ashx | Subscriber registration. Found in search only | NOT OPENED |
| 12 | Policy: Registration of Mobile SIM Cards, Points of Sale V1.0 | TDRA | EN | https://tdra.gov.ae/-/media/About/regulations-and-ruling/EN/Policy---SIM-Cards-point-of-sale-registration-Eng-pdf.ashx | SIM registration at points of sale. Search only | NOT OPENED |
| 13 | TDRA consumer tool hub, complaint and dispute services | TDRA | AR pages | https://tdra.gov.ae/ar/consumer-tool-hub ; https://tdra.gov.ae/ar/Services/dispute-resolution-with-service-providers | Consumer-facing services. Listed on the legislations page. Direct page not individually opened | NOT OPENED |
| 14 | Federal Decree-Law No. 45 of 2021 Protection of Personal Data (PDPL), English translation | UAE Legislation portal (primary, official) | EN | https://uaelegislation.gov.ae/en/legislations/1972 (download: https://uaelegislation.gov.ae/en/legislations/1972/download) | Personal data protection. Search snippets give signing 20 Sep 2021 and effect 2 Jan 2022; one snippet says the PDF is Arabic only on u.ae. Both URLs returned HTTP 403 to the fetch tool | NOT OPENED (403). Builder must try a shell fetch with a browser user agent |
| 15 | Data protection laws overview | u.ae (official portal, secondary summary) | EN | https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws | Government summary of the PDPL | NOT OPENED (search snippet only) |
| 16 | Federal Decree by Law of 2021 Establishing the Emirates Data Office | UAE Legislation portal | EN | https://uaelegislation.gov.ae/en/legislations/2433/download | Oversight body for data protection; relevant to the template's "refer to oversight body" step | NOT OPENED (search listing only) |
| 17 | ITU-T Y.3172 (06/2019), Architectural framework for machine learning in future networks including IMT-2020 | ITU (primary) | EN, AR, ZH, ES, FR, RU | https://www.itu.int/rec/T-REC-Y.3172/en ; recommendation page https://www.itu.int/ITU-T/recommendations/rec.aspx?rec=13894 ; PDF https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-Y.3172-201906-I!!PDF-E&type=items | ML pipeline and ML management and orchestration. Status in force, approved 2019-06-22. The page states no free-access terms | Recommendation page OPENED; PDF NOT OPENED |
| 18 | ITU AI Readiness Framework 2.0 PDF | ITU | EN | https://www.itu.int/dms_pub/itu-t/opb/ai4g/T-AI4G-AI4GOOD-2025-6-PDF-E.pdf | Linked from EVENT | NOT OPENED (this pass) |

Not found: a TDRA instrument specifically about AI, about telecom data protection, or an English-language TDRA page for the Telecom Law. The 2003 law's WIPO copy is secondary and Arabic prevails (also stated in sources/README.md). Telecom-sector data and consumer instruments from other regulators were not searched.

Candidates the builder should weigh: rows 1 or 2 (law), 6 (consumer protection), 10 (unsolicited communications), 14 (PDPL). Rows 7 and 8 may be superseded by row 6 and should be cited only if the builder confirms they are in force. Which of these to ingest is the director's decision.

## Corrections to earlier content in this file

- "ITU-T Y.3172 and the AI Readiness Framework 2.0 PDF were not opened" (Pages that could not be fully read): Y.3172's ITU recommendation page was opened in this pass (details in row 17). The Framework PDF and the Y.3172 PDF remain unopened. The EVENT links for both are now recorded: Y.3172 at https://www.itu.int/rec/T-REC-Y.3172/en and the Framework at the dms_pub URL in row 18.
- "Partner tracks / earlier editions": the earlier note in this file found none. Earlier editions of the same series exist (Kenya, May 2026; Saudi Arabia, September 2026), and they use four criteria, not five. They are different events.
- Nothing in the Dates, Eligibility, Prizes, or Judging sections was contradicted by pages opened this pass.
