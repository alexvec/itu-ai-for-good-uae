import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertChunksVerbatim, buildChunks } from "../lib/kb-build.ts";
import { chunks, chunksForDoc, countInKb, documents, selfDescriptionChunk } from "../lib/data.ts";
import { parseSourceHashes } from "../lib/kb-build.ts";
import { ROOT, documents as docsOnDisk, loadExtracted, readJson, verifyLawExtraction, verifySourceHashes } from "../scripts/kb-io.ts";

const DOC_FILES = documents.map((d) => d.file);
const ALL_ROWS = Object.keys(parseSourceHashes(readFileSync(join(ROOT, "sources/README.md"), "utf8")));

function copyOfSources(replace: Record<string, string> = {}, extra: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), "src-"));
  writeFileSync(join(dir, "README.md"), readFileSync(join(ROOT, "sources/README.md"), "utf8"));
  for (const f of ALL_ROWS) {
    if (replace[f]) writeFileSync(join(dir, f), replace[f]);
    else symlinkSync(join(ROOT, "sources", f), join(dir, f));
  }
  for (const [f, t] of Object.entries(extra)) writeFileSync(join(dir, f), t);
  return dir;
}

describe("source hash check", () => {
  it("passes for every row in sources/README.md, and every ingested file has a row", () => {
    const seen = Object.keys(verifySourceHashes());
    expect(seen.sort()).toEqual([...ALL_ROWS].sort());
    for (const f of DOC_FILES) expect(seen).toContain(f);
  });

  it("fails when the bytes of an ingested file do not match the README", () => {
    expect(() => verifySourceHashes(copyOfSources({ "tdra-consumer-protection-regulations-v2.0-2023.pdf": "not the regulations" }))).toThrow(/SHA-256 mismatch for tdra-consumer/);
  });

  it("fails when a listed file that is not chunked changes", () => {
    expect(() => verifySourceHashes(copyOfSources({ "uae-telecom-law-2003-wipo-en.html": "changed" }))).toThrow(/SHA-256 mismatch for uae-telecom-law-2003-wipo-en.html/);
  });

  it("fails on a file in sources/ with no row", () => {
    expect(() => verifySourceHashes(copyOfSources({}, { "unlisted.pdf": "x" }))).toThrow(/unlisted.pdf has no row/);
  });

  it("the extracted law text is exactly what the saved HTML yields", () => {
    expect(() => verifyLawExtraction()).not.toThrow();
    const dir = copyOfSources({ "uae-telecom-law-2003-wipo-en-extracted.txt": "edited" });
    expect(() => verifyLawExtraction(dir)).toThrow(/not what the saved HTML yields/);
  });
});

describe("knowledge base", () => {
  const extracted = loadExtracted();

  it("holds the nine documents, and never the template or a file saved only for reference", () => {
    expect([...new Set(chunks.map((c) => c.source_file))].sort()).toEqual([...DOC_FILES].sort());
    expect(DOC_FILES).toHaveLength(9);
    expect(chunks.some((c) => /submission-template/.test(c.source_file) || /smart.?pen/i.test(c.text))).toBe(false);
    expect(chunks.some((c) => /wipo-ar|wipo-en\.(pdf|html)/.test(c.source_file))).toBe(false);
  });

  it("the law's articles run 1 to 84 from the text, and articles quoted inside Article (80) are not counted", () => {
    const labels = new Set(chunks.filter((c) => c.doc_id === "law" && c.article && !c.article.includes("continued")).map((c) => c.article));
    expect(labels.size).toBe(84);
    for (let n = 1; n <= 84; n++) expect(labels.has(`Article (${n})`), String(n)).toBe(true);
    const a21 = chunks.find((c) => c.doc_id === "law" && c.article === "Article (21)")!;
    expect(a21.text).toContain("exempted from all Government fees");
  });

  it("the law text excludes WIPO navigation and editorial notes", () => {
    const law = chunks.filter((c) => c.doc_id === "law").map((c) => c.text).join("\n");
    expect(law).not.toContain("PATENTSCOPE");
    expect(law).not.toContain("It provides for the establishment");
  });

  it("says the Arabic prevails only because the document says so", () => {
    const law = documents.find((d) => d.id === "law")!;
    expect(selfDescriptionChunk(law)?.text).toContain("THE ARABIC VERSION OF THE TELECOMMUNICATIONS LAW SHALL PREVAIL IN CASE OF ANY DISCREPANCY");
    for (const d of documents) if (d.id !== "law") expect(d.caveat ?? "", d.id).not.toMatch(/Arabic/);
  });

  it("every document's PA-01 rank basis is a verbatim quote from that document", () => {
    for (const d of documents) {
      expect(chunksForDoc(d.id).some((c) => c.page === d.rank_basis.page && c.text.includes(d.rank_basis.quote)), d.id).toBe(true);
    }
  });

  it("every chunk is a verbatim slice of the stored text of its page", () => {
    expect(chunks.length).toBeGreaterThan(0);
    for (const c of chunks) {
      const page = extracted[c.source_file].pages.find((p) => p.page === c.page)!;
      expect(page.text.slice(c.char_start, c.char_end)).toBe(c.text);
      expect(page.text.includes(c.text)).toBe(true);
    }
    expect(() => assertChunksVerbatim(chunks, extracted)).not.toThrow();
  });

  it("the verbatim check rejects a chunk changed by one character", () => {
    const bad = chunks.map((c, i) => (i === 7 ? { ...c, text: c.text.slice(0, -1) + "#" } : c));
    expect(() => assertChunksVerbatim(bad, extracted)).toThrow(/not a verbatim slice/);
  });

  it("chunks are reproducible from the stored text", () => {
    const rebuilt = docsOnDisk().flatMap((d) => buildChunks(d, extracted[d.file], readJson("data/node-tags.json")));
    expect(rebuilt).toEqual(chunks);
  });

  it("OCR chunks are labelled in the data and match pages stored as OCR", () => {
    const ocr = chunks.filter((c) => c.extraction === "ocr").map((c) => `${c.doc_id}:${c.page}`);
    expect([...new Set(ocr)].sort()).toEqual(["ethics:25", "guideline:36", "guideline:56", "strategy:1", "strategy:25"]);
  });

  it("records the page with no words as not ingested", () => {
    expect(chunks.some((c) => c.doc_id === "guideline" && c.page === 2)).toBe(false);
    expect(documents.find((d) => d.id === "guideline")!.not_ingested_pages.map((p) => p.page)).toEqual([2]);
  });

  it("each document's self-description is a verbatim quote", () => {
    for (const d of documents) {
      if (d.self_description) expect(selfDescriptionChunk(d)?.text).toContain(d.self_description.quote);
    }
  });

  it("the words the gap statements depend on are absent where they are said to be", () => {
    const uae = ["law", "cpr", "uec", "strategy", "charter", "ethics", "guideline"];
    for (const t of ["purpose limitation", "sandbox"]) expect(countInKb(t, uae), t).toBe(0);
    expect(countInKb("telecom", ["strategy"])).toBe(0);
    expect(countInKb("machine learning", ["law", "cpr", "uec"])).toBe(0);
    expect(countInKb("subscriber information", ["cpr"])).toBeGreaterThan(0);
  });
});
