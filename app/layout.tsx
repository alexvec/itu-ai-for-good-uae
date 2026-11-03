import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Y.3172 Incident Counsel",
  description: "Policy and legal adviser agent for ML functions in a telecom network, keyed to ITU-T Y.3172, with a KB of UAE telecom law, regulator text and AI guidance. Not legal advice.",
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
            <strong>Not legal advice.</strong> The KB holds the Telecom Law (English text from a secondary host; the
            document says the Arabic version prevails), TDRA regulator text, UAE AI guidance and two ITU framework
            documents. The Data Protection Law returned HTTP 403 and is <strong>not in the KB</strong>. &quot;Not
            addressed in the ingested documents&quot; says nothing about what UAE law requires outside these files. Runs
            with no model and no API key.
          </div>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
