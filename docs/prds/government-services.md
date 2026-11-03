# PRD: Government services (not chosen; runner-up)

## User
A digital-service or AI-programme lead in a UAE government entity deciding whether and how a citizen-facing AI assistant may handle a service request.

## Job to be done
Given a service request or failure event, say which published rules and guidance bear on the automated handling, with citations, and record how the answer was reached.

## Partner capability that does the work
Y.3172 applied by analogy: pipeline nodes mapped to the stages of a service-handling workflow (intake as SRC/C, redaction as PP, assistant as M, rules as P, response as D/SINK). AI Readiness dimensions 5 (integration in workflows), 7 (strategy alignment) and 10 (AI and policies) as the gap taxonomy. Repo KB schema as in the chosen PRD.

## Sources actually reached
Opened: u.ae AI-in-government-policies page (UAE Council for AI, AI CEO role, BRAIN), u.ae AI resources page (index), u.ae Data protection laws page, u.ae Cyber laws page, UAE AI Charter page. Not opened: AI Adoption Guideline in Government Services, AI Ethics Guide, National AI Strategy PDF, PDPL text. No primary binding text on citizen-service AI was read.

## Demo on real input
A service-failure scenario run against the pages above, with quotes and a trace.

## Who pays
Unvalidated hypothesis: government digital teams. No evidence gathered.

## Wrapper risk
High. The central guidance document could not be read, so the KB would rest on portal summary pages. Y.3172 is a network ML architecture; mapping it to service workflows is a stretch a judge on criterion 5 would likely see through. Loses to telecom because of weaker evidence and a weaker standards fit.

## No-key behaviour
Same design as the chosen PRD: BM25 retrieval, rules, optional model behind env vars.

## Decision
Do not build. Revisit only if the Adoption Guideline text becomes readable and the operator prefers this domain; the form domain can change until final submission.
