import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { extractLawText } from "../lib/law-html.ts";
import { parseSourceHashes, type Extracted } from "../lib/kb-build.ts";
import type { DocumentMeta } from "../lib/types.ts";

export const ROOT = join(import.meta.dirname, "..");
export const readJson = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
export const documents = (): DocumentMeta[] => readJson("data/documents.json");

/**
 * Fails on a mismatch: every row of the table in sources/README.md must match the bytes on disk,
 * every document in data/documents.json needs a row, and every file in sources/ needs a row.
 */
export function verifySourceHashes(sourcesDir = join(ROOT, "sources")): Record<string, string> {
  const expected = parseSourceHashes(readFileSync(join(sourcesDir, "README.md"), "utf8"));
  const seen: Record<string, string> = {};
  for (const doc of documents()) if (!expected[doc.file]) throw new Error(`sources/README.md lists no hash for ${doc.file}`);
  for (const file of readdirSync(sourcesDir)) {
    if (file !== "README.md" && !expected[file]) throw new Error(`sources/${file} has no row in sources/README.md`);
  }
  for (const [file, want] of Object.entries(expected)) {
    if (!existsSync(join(sourcesDir, file))) throw new Error(`sources/README.md lists ${file}, which is missing`);
    const got = createHash("sha256").update(readFileSync(join(sourcesDir, file))).digest("hex");
    if (got !== want) throw new Error(`SHA-256 mismatch for ${file}: README ${want}, file ${got}`);
    seen[file] = got;
  }
  return seen;
}

export function loadExtracted(): Record<string, Extracted> {
  const out: Record<string, Extracted> = {};
  for (const doc of documents()) out[doc.file] = readJson(`kb/extracted/${doc.file.replace(/\.(pdf|txt)$/, "")}.json`);
  return out;
}

/** The extracted law text must be exactly what the saved HTML yields. */
export function verifyLawExtraction(sourcesDir = join(ROOT, "sources")): void {
  const html = readFileSync(join(sourcesDir, "uae-telecom-law-2003-wipo-en.html"), "utf8");
  const stored = readFileSync(join(sourcesDir, "uae-telecom-law-2003-wipo-en-extracted.txt"), "utf8");
  if (extractLawText(html) !== stored) throw new Error("the extracted Telecom Law text is not what the saved HTML yields");
}
