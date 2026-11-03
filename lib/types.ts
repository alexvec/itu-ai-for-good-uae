export type NodeId = "SRC" | "C" | "PP" | "M" | "P" | "D" | "SINK" | "MLFO" | "Sandbox";
export const PIPELINE: NodeId[] = ["SRC", "C", "PP", "M", "P", "D", "SINK"];
export const NOT_ADDRESSED = "not addressed in the ingested documents";
export const NO_GLOBAL_EXAMPLE = "no global example in KB";
export const CANDIDATE = "candidate, needs human legal review";

export interface Chunk {
  id: string;
  doc_id: string;
  // Reference-repo schema
  source_file: string;
  source_type: string;
  country: string;
  chunk_index: number;
  total_chunks: number;
  ingested_at: string;
  document_category: string;
  // Additive fields
  article: string | null;
  source_url: string;
  retrieved_on: string;
  sha256: string;
  page: number;
  char_start: number;
  char_end: number;
  extraction: "text-layer" | "ocr" | "html-text";
  retrievable: boolean;
  page_headings: string[];
  y3172_nodes: NodeId[];
  dimension_ids: number[];
  text: string;
}

export interface DocumentMeta {
  id: string;
  file: string;
  title: string;
  short: string;
  instrument_type: string;
  source_type: string;
  document_category: string;
  source_url: string;
  source_note: string;
  retrieved_on: string;
  analogy_note: string | null;
  status_note: string;
  self_description: { page: number; quote: string } | null;
  chunk_prefix: string;
  heading_pattern: string;
  non_retrievable_pages: number[];
  not_ingested_pages: { page: number; reason: string }[];
  reading_notes: string[];
  /** How the document is cut: "page" (slices of a page), "clauses" (numbered sub-articles), "articles" (Article (N) headings). */
  chunker: "page" | "clauses" | "articles";
  /** Clause chunker only: everything up to the end of this match is the running page header. */
  page_header_end?: string;
  /** Clause chunker only: pages at or after this number carry this prefix on their clause labels. */
  clause_prefix?: { from_page: number; prefix: string };
  /** primary | secondary host | framework | national guidance | foreign */
  status: "primary" | "secondary host" | "framework" | "national guidance" | "foreign";
  publisher: string;
  language: string;
  extraction_method: string;
  page_label: string;
  /** PA-01 rank, lower outranks higher. Read from the document's own text; the quote is in rank_basis. */
  rank: number;
  rank_label: string;
  rank_basis: { page: number; quote: string };
  caveat: string | null;
  license_status: string;
}
