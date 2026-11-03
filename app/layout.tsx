import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Y.3172 Incident Counsel",
  description: "Policy and legal adviser agent for ML functions in a telecom network, keyed to ITU-T Y.3172, with a KB of four UAE documents. Not legal advice.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="topbar">
          <div className="inner">
            <Link className="brand" href="/">Y.3172 Incident Counsel</Link>
            <nav>
              <Link href="/">Scenario</Link>
              <Link href="/free-text">Free text</Link>
              <Link href="/kb">Knowledge base</Link>
              <Link href="/gaps">Gaps</Link>
              <Link href="/evidence">Evidence</Link>
              <Link href="/audit">Audit</Link>
            </nav>
          </div>
        </div>
        <div className="limits" data-testid="limits-banner">
          <div className="inner">
            <strong>Not legal advice.</strong> The KB holds four UAE documents: a strategy, a charter, ethics
            guidance and government-services guidance. It has <strong>no binding telecom sector law</strong>. The
            Telecom Law (Federal Law by Decree No. 3 of 2003) and the PDPL exist and were not ingested. &quot;Not
            addressed in the ingested documents&quot; says nothing about what UAE law requires. Runs with no model and
            no API key.
          </div>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
