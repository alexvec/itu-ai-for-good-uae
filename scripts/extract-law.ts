// Writes the Telecom Law's extracted text and per-page JSON from the saved HTML. Deterministic; check-kb re-runs it.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { extractLawText, splitLawPages } from "../lib/law-html.ts";
import { ROOT } from "./kb-io.ts";

const text = extractLawText(readFileSync(join(ROOT, "sources/uae-telecom-law-2003-wipo-en.html"), "utf8"));
writeFileSync(join(ROOT, "sources/uae-telecom-law-2003-wipo-en-extracted.txt"), text);
const sha256 = createHash("sha256").update(text).digest("hex");
const pages = splitLawPages(text).map((p) => ({ page: p.page, method: "html-text", text: p.text }));
writeFileSync(join(ROOT, "kb/extracted/uae-telecom-law-2003-wipo-en-extracted.json"), JSON.stringify({ sha256, page_count: pages.length, extractor: "lib/law-html.ts", pages }, null, 1));
console.log(`extracted ${text.length} characters, ${pages.length} printed pages, sha256 ${sha256}`);
