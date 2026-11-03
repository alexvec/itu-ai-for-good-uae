// Runs before `next build`. A hash mismatch or a non-verbatim chunk stops the build.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildChunks, assertChunksVerbatim } from "../lib/kb-build.ts";
import { ROOT, documents, loadExtracted, readJson, verifySourceHashes } from "./kb-io.ts";

try {
  const hashes = verifySourceHashes();
  const extracted = loadExtracted();
  const stored = readFileSync(join(ROOT, "kb/chunks.json"), "utf8");
  const chunks = JSON.parse(stored);
  assertChunksVerbatim(chunks, extracted);
  const rebuilt = documents().flatMap((d) => {
    if (extracted[d.file].sha256 !== hashes[d.file]) throw new Error(`stored text for ${d.file} came from different bytes`);
    return buildChunks(d, extracted[d.file], readJson("data/node-tags.json"));
  });
  if (JSON.stringify(rebuilt) !== JSON.stringify(chunks)) throw new Error("kb/chunks.json is stale: run npm run kb:build");
  console.log(`source hashes OK (${Object.keys(hashes).length} files); ${chunks.length} chunks are verbatim slices`);
} catch (e) {
  console.error(`KB check failed: ${(e as Error).message}`);
  process.exit(1);
}
