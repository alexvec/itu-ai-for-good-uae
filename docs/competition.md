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
