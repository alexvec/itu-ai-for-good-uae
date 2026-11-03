// Single loading point for the data files the app reads. The evidence export uses the same imports.
import chunksJson from "../kb/chunks.json" with { type: "json" };
import documentsJson from "../data/documents.json" with { type: "json" };
import type { Chunk, DocumentMeta } from "./types.ts";

export const chunks = chunksJson as unknown as Chunk[];
export const documents = documentsJson as unknown as DocumentMeta[];
export const chunkById = new Map(chunks.map((c) => [c.id, c]));
export const docById = new Map(documents.map((d) => [d.id, d]));

export const NOT_INGESTED = [
  {
    name: "Federal Law by Decree No. 3 of 2003 (the Telecom Law)",
    note: "Exists and was not ingested. A direct fetch of the WIPO Lex PDF returned an HTML page, not the law (sources/README.md). No text of it is in this product.",
  },
  {
    name: "UAE Personal Data Protection Law (PDPL)",
    note: "Exists and was not ingested. No text of it is in this product.",
  },
  {
    name: "sources/submission-template.docx",
    note: "The event's report template, with a sample story. Not a policy document, so it is not chunked into the KB.",
  },
];

export function chunksForDoc(docId: string): Chunk[] {
  return chunks.filter((c) => c.doc_id === docId);
}

/** Occurrences of a phrase across the whole KB, whitespace-insensitive. Used to show absences honestly. */
export function countInKb(term: string): number {
  const t = term.toLowerCase();
  const pages = new Set<string>();
  for (const c of chunks) {
    if (c.text.toLowerCase().replace(/\s+/g, " ").includes(t)) pages.add(`${c.doc_id}:${c.page}`);
  }
  return pages.size;
}

export function selfDescriptionChunk(doc: DocumentMeta): Chunk | undefined {
  const q = doc.self_description?.quote;
  if (!q) return undefined;
  return chunksForDoc(doc.id).find((c) => c.page === doc.self_description!.page && c.text.includes(q));
}
