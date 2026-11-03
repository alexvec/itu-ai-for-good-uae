# NEEDS

No rule on any page opened requires more than one person on a team. The only stated limit is a maximum of 4 (https://aiforgood.itu.int/event/ai-for-good-sandbox-hackathon-united-arab-emirates/). A solo entry is not stated either way. Unverified for unopened documents.

Details and sources are in docs/competition.md.

## Blocks the build

Nothing found that blocks the build. No partner API key, paid plan, or mandated platform was found on the pages read. The reference repo (MIT, https://github.com/CrashingGuru/ITUAIReadiness) lists no keys or accounts. Caveat: if the operator wants Sandbox cloud credits, access is for "selected" participants, selection process unverified. The build can proceed without it using the operator's own tooling.

Open question for the director, not a credential: the knowledge-base source country is implied to be the UAE but not stated outright, and no dataset is provided on the page. The build will need public UAE policy documents.

Strategy pass (2026-11-03) re-checked this. The chosen design (docs/prds/telecommunications.md) runs with no LLM key: BM25 retrieval and a rule-driven agent, with an optional OpenAI-compatible model behind LLM_BASE_URL, LLM_API_KEY, LLM_MODEL. The strategy pass could not inspect the machine for keys or a local model, so none is assumed. Deploys with GitHub CLI and Vercel CLI only. Nothing added to this section.

## Does not block the build

Added by the strategy pass:

- Operator: choose "Telecommunications" as the use case domain when registering (due 5 November). The domain can reportedly be changed until final submission (FAQ, per competition.md).
- Builder, not operator: UAE PDPL text (403), National AI Strategy 2031 PDF (404 / size limit), AI Ethics Guide and Adoption Guideline (size limit) and the submission template .docx could not be read in the strategy pass. The builder fetches them with a shell; any that stay unreachable are listed as missing in the KB page and the report.
- Optional: an LLM key for the narrative step. Not needed for any criterion.

All of these are operator actions. Nothing here is done by the agent.

- Registration was submitted on 2026-11-03 at https://aiforgood.itu.int/ai-for-good-sandbox-hackathon-uae-apply/. The page confirmed "Thank you for your message. It has been sent." Team Windboy, leader Alex Veciana Belmonte, domain Telecommunications, no teammates. Do not submit the form again.
- Provide team details later via the Google Sheets the organizers send. Fields unknown.
- Submit by 10 November 2026: technical report (max 5 pages, official template), GitHub repository, knowledge base. Submission channel unverified. Operator runs submit.sh.
- Optional demo video (max 7 minutes); required if shortlisted (shortlist 18 November 2026).
- Confirm availability for final onsite evaluation in Dubai on 8 December 2026 if shortlisted. Travel sponsorship is for "oversea selected teams"; selection terms unverified.
- Optionally request Sandbox access and attend mentoring (next session 7 November 2026).
