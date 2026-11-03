// Single loading point for the data files the app reads. The evidence export uses the same imports.
import chunksJson from "../kb/chunks.json" with { type: "json" };
import documentsJson from "../data/documents.json" with { type: "json" };
import attemptsJson from "../data/source-attempts.json" with { type: "json" };
import type { Chunk, DocumentMeta } from "./types.ts";

export const chunks = chunksJson as unknown as Chunk[];
export const documents = documentsJson as unknown as DocumentMeta[];
export const chunkById = new Map(chunks.map((c) => [c.id, c]));
export const docById = new Map(documents.map((d) => [d.id, d]));

export interface SourceAttempt { document: string; url: string; result: string; status: string; note: string }
export const sourceAttempts = attemptsJson as unknown as SourceAttempt[];

export function chunksForDoc(docId: string): Chunk[] {
  return chunks.filter((c) => c.doc_id === docId);
}

/** Pages holding a phrase, whitespace-insensitive. Optionally limited to some documents. Used to show absences honestly. */
export function countInKb(term: string, docIds?: string[]): number {
  const t = term.toLowerCase();
  const pages = new Set<string>();
  for (const c of chunks) {
    if (docIds && !docIds.includes(c.doc_id)) continue;
    if (c.text.toLowerCase().replace(/\s+/g, " ").includes(t)) pages.add(`${c.doc_id}:${c.page}`);
  }
  return pages.size;
}

export function selfDescriptionChunk(doc: DocumentMeta): Chunk | undefined {
  const q = doc.self_description?.quote;
  if (!q) return undefined;
  return chunksForDoc(doc.id).find((c) => c.page === doc.self_description!.page && c.text.includes(q));
}
