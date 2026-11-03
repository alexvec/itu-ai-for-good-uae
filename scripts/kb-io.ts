import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseSourceHashes, type Extracted } from "../lib/kb-build.ts";
import type { DocumentMeta } from "../lib/types.ts";

export const ROOT = join(import.meta.dirname, "..");
export const readJson = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
export const documents = (): DocumentMeta[] => readJson("data/documents.json");

/** Fails on a mismatch: the bytes in sources/ must equal the hashes in sources/README.md. */
export function verifySourceHashes(sourcesDir = join(ROOT, "sources")): Record<string, string> {
  const expected = parseSourceHashes(readFileSync(join(sourcesDir, "README.md"), "utf8"));
  const seen: Record<string, string> = {};
  for (const doc of documents()) {
    const want = expected[doc.file];
    if (!want) throw new Error(`sources/README.md lists no hash for ${doc.file}`);
    const got = createHash("sha256").update(readFileSync(join(sourcesDir, doc.file))).digest("hex");
    if (got !== want) throw new Error(`SHA-256 mismatch for ${doc.file}: README ${want}, file ${got}`);
    seen[doc.file] = got;
  }
  return seen;
}

export function loadExtracted(): Record<string, Extracted> {
  const out: Record<string, Extracted> = {};
  for (const doc of documents()) out[doc.file] = readJson(`kb/extracted/${doc.file.replace(/\.pdf$/, "")}.json`);
  return out;
}
