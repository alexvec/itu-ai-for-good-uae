// Regenerates kb/chunks.json and the JSONL export from the stored per-page text.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildChunks, assertChunksVerbatim } from "../lib/kb-build.ts";
import { ROOT, documents, loadExtracted, readJson, verifySourceHashes } from "./kb-io.ts";

const hashes = verifySourceHashes();
const extracted = loadExtracted();
const tags = readJson("data/node-tags.json");
const chunks = documents().flatMap((d) => {
  if (extracted[d.file].sha256 !== hashes[d.file]) throw new Error(`stored text for ${d.file} came from different bytes`);
  return buildChunks(d, extracted[d.file], tags);
});
assertChunksVerbatim(chunks, extracted);
writeFileSync(join(ROOT, "kb/chunks.json"), JSON.stringify(chunks, null, 1) + "\n");
writeFileSync(join(ROOT, "kb/kb.jsonl"), chunks.map((c) => JSON.stringify(c)).join("\n") + "\n");
console.log(`built ${chunks.length} chunks from ${documents().length} documents`);
