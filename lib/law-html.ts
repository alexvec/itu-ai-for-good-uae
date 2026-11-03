// Deterministic text extraction from the saved WIPO Lex HTML of the Telecom Law.
// The HTML is parsed as text and never executed: scripts and styles are dropped, tags are removed.
// Only the span from the law's own title line to its signature line is kept, so WIPO's site navigation
// and WIPO's editorial notes are not treated as law.

const START = "*Federal Law by Decree No. 3 of 2003-Telecom Law";
const END = "Corresponding to: 15/11/2003";

function decode(s: string): string {
  const named: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return String.fromCodePoint(code);
    }
    return named[e.toLowerCase()] ?? m;
  });
}

export function extractLawText(html: string): string {
  const text = decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<(br|\/p|\/div|\/li|\/tr|\/h\d)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  );
  const lines = text
    .split("\n")
    .map((l) => l.replace(/[ \t ]+/g, " ").trim())
    .filter(Boolean);
  const from = lines.findIndex((l) => l.startsWith(START));
  const to = lines.findIndex((l, i) => i > from && l.includes(END));
  if (from < 0 || to < 0) throw new Error("law text markers not found in the saved HTML");
  return lines.slice(from, to + 1).join("\n") + "\n";
}

const RUNNING_HEADER = "Federal Law by Decree No. 3 of 2003-Telecom Law";

/** Splits the extracted text on the printed running header, which is followed by the printed page number. */
export function splitLawPages(text: string): { page: number; text: string }[] {
  const lines = text.split("\n");
  const pages: { page: number; text: string }[] = [];
  let page = 1; // The cover carries no printed number.
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) pages.push({ page, text: buf.join("\n") + "\n" });
    buf = [];
  };
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === RUNNING_HEADER && /^\d+$/.test(lines[i + 1] ?? "")) {
      flush();
      page = Number(lines[i + 1]);
      i++;
    } else if (lines[i] !== "") {
      buf.push(lines[i]);
    }
  }
  flush();
  return pages;
}
