import { FreeText } from "../../components/FreeText.tsx";

export const metadata = { title: "Free text | Y.3172 Incident Counsel" };

export default function Page() {
  return (
    <>
      <h1>Free-text event</h1>
      <p className="lede">Type an event. It runs through the same rules, retrieval and gap check as the scenario, and joins the same audit log.</p>
      <FreeText />
    </>
  );
}
