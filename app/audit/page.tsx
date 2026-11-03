import { AuditView } from "../../components/AuditView.tsx";

export const metadata = { title: "Audit | Y.3172 Incident Counsel" };

export default function Page() {
  return (
    <>
      <h1>Audit log</h1>
      <p className="lede">A hash-chained, append-only record of this session: each input, class, rule fired, query, chunk id with score, quote checked, and output. The trace is the agent&apos;s structured reasoning. With no model there is no hidden monologue to show.</p>
      <AuditView />
    </>
  );
}
