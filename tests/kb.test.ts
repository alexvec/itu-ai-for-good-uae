import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertChunksVerbatim, buildChunks } from "../lib/kb-build.ts";
import { chunks, countInKb, documents, selfDescriptionChunk } from "../lib/data.ts";
import { ROOT, documents as docsOnDisk, loadExtracted, readJson, verifySourceHashes } from "../scripts/kb-io.ts";

const FILES = ["uae-ai-strategy-2031.pdf", "uae-ai-charter-methaq.pdf", "uae-ai-ethics-principles-2022.pdf", "uae-ai-adoption-guideline-government-services.pdf"];

describe("source hash check", () => {
  it("passes for the four files in sources/README.md", () => {
    expect(Object.keys(verifySourceHashes()).sort()).toEqual([...FILES].sort());
  });

  it("fails when the bytes do not match the README", () => {
    const dir = mkdtempSync(join(tmpdir(), "src-"));
    const readme = readFileSync(join(ROOT, "sources/README.md"), "utf8");
    // Keep the real README and swap in a file with different bytes for one PDF.
    writeFileSync(join(dir, "README.md"), readme);
    for (const f of FILES) {
      if (f === FILES[1]) writeFileSync(join(dir, f), "not the charter");
      else symlinkSync(join(ROOT, "sources", f), join(dir, f));
    }
    expect(() => verifySourceHashes(dir)).toThrow(/SHA-256 mismatch for uae-ai-charter-methaq/);
  });
});

describe("knowledge base", () => {
  const extracted = loadExtracted();

  it("holds exactly the four policy files, and never the submission template", () => {
    expect([...new Set(chunks.map((c) => c.source_file))].sort()).toEqual([...FILES].sort());
    expect(chunks.some((c) => /submission-template/.test(c.source_file) || /smart.?pen/i.test(c.text))).toBe(false);
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

  it("the words the honesty statements depend on are in fact absent", () => {
    for (const t of ["telecom", "subscriber", "interception", "purpose limitation", "sandbox", "emergency", "breach"]) expect(countInKb(t)).toBe(0);
  });
});
