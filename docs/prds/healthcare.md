# PRD: Healthcare (not chosen)

## User
A health-informatics or compliance officer at a UAE provider considering an AI function that touches patient data.

## Job to be done
For an incident involving an AI function and health data (for example a model update or a data-sharing request), say which published UAE rules apply, with citations and an audit record.

## Partner capability that does the work
Y.3172 pipeline as a data-flow lens for health AI (SRC and C for record intake, PP for de-identification, M for the model, P for clinical guardrails, D and SINK for delivery). Readiness dimensions 1, 11 and 12 and factor "data". Repo KB schema.

## Sources actually reached
Opened: u.ae ICT in the health sector page, which states what Federal Law No. 2 of 2019 does (confidentiality, integrity, availability, national collection by the Ministry of Health and Prevention) and mentions the DOH Abu Dhabi Policy on Digital Health without a number or year. u.ae Data protection laws page. Not opened: the text of Federal Law No. 2 of 2019, the DOH policy, the PDPL. Search results reported that the PDPL excludes health personal data; I did not verify this against the law text. No clinical-safety AI guidance was found or read.

## Demo on real input
Would run a data-sharing scenario against two portal pages. That is too thin to demonstrate knowledge-base quality.

## Who pays
Unvalidated hypothesis: provider compliance teams. No evidence gathered.

## Wrapper risk
High. With only summary pages, answers about health data would look like a general chatbot with a few links, and health stakes make unsourced statements worse. The healthcare Y.3172 fit is also by analogy.

## No-key behaviour
Same as the chosen PRD.

## Decision
Do not build.
