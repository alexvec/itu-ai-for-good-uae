import { ControlRow } from "../../components/StepView.tsx";
import { allControlResults, dimensionName } from "../../lib/engine.ts";
import { NO_GLOBAL_EXAMPLE, NOT_ADDRESSED } from "../../lib/types.ts";

export const metadata = { title: "Candidate gaps | Y.3172 Incident Counsel" };

export default function Page() {
  const all = allControlResults();
  const gaps = all.filter((c) => !c.addressed);
  const byDim = [...new Set(gaps.map((g) => g.dimension_id))].sort((a, b) => a - b);
  return (
    <>
      <h1>Candidate gaps</h1>
      <p className="lede">
        Each question comes from a Y.3172 node. It counts as answered only if its search terms occur in a retrievable
        chunk of the documents it searches, checked live. &quot;{NOT_ADDRESSED}&quot; describes these files. It does not
        mean UAE law is silent: the Data Protection Law returned HTTP 403 and was not read, the CPR annexes are not in the
        saved file, and no licence is in the KB. A person with legal training must review every row.
      </p>
      <div className="card" data-testid="global-note">
        <strong>Global examples: {NO_GLOBAL_EXAMPLE}.</strong> The GDPR and the EU AI Act were attempted on EUR-Lex and returned HTTP 202 with an empty body and a challenge header, so neither was retrieved. None is written from memory. The UAE documents mention some foreign practice in passing; those passages are not offered as global examples.
      </div>
      <h2>Candidates by Readiness dimension</h2>
      {byDim.map((d) => (
        <section key={d}>
          <h3>D{d} {dimensionName(d)}</h3>
          {gaps.filter((g) => g.dimension_id === d).map((c) => <ControlRow key={c.id} c={c} />)}
        </section>
      ))}
      <h2>Questions the text does address</h2>
      {all.filter((c) => c.addressed).map((c) => <ControlRow key={c.id} c={c} />)}
    </>
  );
}
