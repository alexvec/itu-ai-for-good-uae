import scenario from "../data/scenarios/primary.json" with { type: "json" };
import { ScenarioRunner } from "../components/ScenarioRunner.tsx";
import { useCase } from "../lib/evidence.ts";

export default function Home() {
  return (
    <>
      <h1>Y.3172 Incident Counsel</h1>
      <p className="lede">
        A policy and legal adviser agent for ML functions in a telecom network. {useCase} Every event is mapped to the
        ITU-T Y.3172 pipeline and the AI Readiness dimensions, and every quote is a verbatim slice of a stored source.
      </p>
      <ScenarioRunner title={scenario.title} disclaimer={scenario.disclaimer} events={scenario.events} />
    </>
  );
}
