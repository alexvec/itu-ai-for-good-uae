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
  article: null;
  source_url: string;
  retrieved_on: string;
  sha256: string;
  page: number;
  char_start: number;
  char_end: number;
  extraction: "text-layer" | "ocr";
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
}
