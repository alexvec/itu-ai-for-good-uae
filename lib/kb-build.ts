// Deterministic chunker. Every chunk is a slice of one stored page of extracted text,
// so its page number is exact and the verbatim check is a plain substring comparison.
import type { Chunk, DocumentMeta, NodeId } from "./types.ts";

export const CHUNK_WORDS = 256; // reference repo config.py chunk_size
export const CHUNK_OVERLAP = 30; // reference repo config.py chunk_overlap
export const INGESTED_AT = "2026-11-03";

export interface ExtractedPage {
  page: number;
  method: "text-layer" | "ocr" | "html-text" | "none";
  text: string;
}
export interface Extracted {
  sha256: string;
  page_count: number;
  pages: ExtractedPage[];
}

const words = (s: string) => (s.match(/\S+/g) ?? []).length;

/** Split one page into [start,end) slices on line boundaries: about 256 words, about 30 words of overlap. */
export function slicePage(text: string): { start: number; end: number }[] {
  const lines: { start: number; end: number; n: number }[] = [];
  let pos = 0;
  for (const raw of text.split("\n")) {
    const end = pos + raw.length;
    if (raw.trim()) lines.push({ start: pos, end, n: words(raw) });
    pos = end + 1;
  }
  if (!lines.length) return [];
  const out: { start: number; end: number }[] = [];
  let i = 0;
  while (i < lines.length) {
    let j = i;
    let n = 0;
    while (j < lines.length && n < CHUNK_WORDS) n += lines[j++].n;
    out.push({ start: lines[i].start, end: lines[j - 1].end });
    if (j >= lines.length) break;
    let back = j;
    let overlap = 0;
    while (back > i + 1 && overlap < CHUNK_OVERLAP) overlap += lines[--back].n;
    i = back;
  }
  return out;
}

export interface Slice { start: number; end: number; article: string | null }

function capToWords(text: string, from: number, to: number, article: string | null): Slice[] {
  return slicePage(text.slice(from, to)).map((s, i) => ({
    start: from + s.start,
    end: from + s.end,
    article: i === 0 || !article ? article : `${article} (continued)`,
  }));
}

/** Cuts one page at numbered sub-articles printed at the start of a line, such as "24.6." State carries the open clause across pages. */
export function sliceClauses(text: string, doc: DocumentMeta, page: number, state: { label: string | null }): Slice[] {
  const prefix = doc.clause_prefix && page >= doc.clause_prefix.from_page ? doc.clause_prefix.prefix : "";
  let from = 0;
  if (doc.page_header_end) {
    const m = new RegExp(doc.page_header_end, "m").exec(text);
    if (m) from = m.index + m[0].length;
  }
  const marks: { at: number; label: string | null }[] = [];
  let pos = 0;
  let heading: number | null = null;
  for (const raw of text.split("\n")) {
    if (pos >= from) {
      const line = raw.trim();
      const clause = /^(\d{1,2}\.\d{1,2})\.(\s|$)/.exec(line);
      if (clause) {
        marks.push({ at: heading ?? pos, label: prefix + clause[1] });
        heading = null;
      } else if (/^\d{1,2}\.\s*[A-Z]/.test(line) && !/\.{4,}/.test(line) && line.length < 90) {
        heading = pos;
      } else if (/^\d{1,2}\.\s*$/.test(line)) {
        heading = pos;
      }
    }
    pos += raw.length + 1;
  }
  const out: Slice[] = [];
  const firstAt = marks.length ? marks[0].at : text.length;
  if (text.slice(from, firstAt).trim()) out.push(...capToWords(text, from, firstAt, state.label ? `${state.label} (continued)` : null));
  marks.forEach((m, i) => {
    out.push(...capToWords(text, m.at, i + 1 < marks.length ? marks[i + 1].at : text.length, m.label));
    state.label = m.label;
  });
  return out;
}

/** Cuts one page of the law at "Article (N)" headings. Only N = previous + 1 counts, so articles of an older law quoted inside Article (80) are not mistaken for this law's articles. */
export function sliceArticles(text: string, state: { next: number; label: string | null }): Slice[] {
  const marks: { at: number; label: string }[] = [];
  let pos = 0;
  for (const raw of text.split("\n")) {
    const m = /^Article \((\d+)\)\s*$/.exec(raw.trim());
    if (m && Number(m[1]) === state.next) {
      marks.push({ at: pos, label: `Article (${m[1]})` });
      state.next++;
    }
    pos += raw.length + 1;
  }
  const out: Slice[] = [];
  const firstAt = marks.length ? marks[0].at : text.length;
  if (text.slice(0, firstAt).trim()) out.push(...capToWords(text, 0, firstAt, state.label ? `${state.label} (continued)` : null));
  marks.forEach((m, i) => {
    out.push(...capToWords(text, m.at, i + 1 < marks.length ? marks[i + 1].at : text.length, m.label));
    state.label = m.label;
  });
  return out;
}

export function termMatches(textLower: string, term: string): boolean {
  let at = textLower.indexOf(term);
  while (at !== -1) {
    if (at === 0 || !/[a-z0-9]/.test(textLower[at - 1])) return true;
    at = textLower.indexOf(term, at + 1);
  }
  return false;
}

export function buildChunks(
  doc: DocumentMeta,
  extracted: Extracted,
  tags: { nodes: Record<string, string[]>; dimensions: Record<string, string[]> },
): Chunk[] {
  const headingRe = new RegExp(doc.heading_pattern);
  const notIngested = new Set(doc.not_ingested_pages.map((p) => p.page));
  const partial: Omit<Chunk, "chunk_index" | "total_chunks">[] = [];
  const clauseState = { label: null as string | null };
  const articleState = { next: 1, label: null as string | null };
  for (const page of extracted.pages) {
    if (notIngested.has(page.page) || page.method === "none") continue;
    const headings = page.text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length < 110 && headingRe.test(l));
    const slices: Slice[] =
      doc.chunker === "clauses" ? sliceClauses(page.text, doc, page.page, clauseState)
      : doc.chunker === "articles" ? sliceArticles(page.text, articleState)
      : slicePage(page.text).map((s) => ({ ...s, article: null }));
    slices.forEach((s, idx) => {
      const text = page.text.slice(s.start, s.end);
      const lower = text.toLowerCase().replace(/\s+/g, " ");
      partial.push({
        id: `${doc.chunk_prefix}-p${String(page.page).padStart(2, "0")}-c${idx + 1}`,
        doc_id: doc.id,
        source_file: doc.file,
        source_type: doc.source_type,
        country: "UAE",
        ingested_at: INGESTED_AT,
        document_category: doc.document_category,
        article: s.article,
        source_url: doc.source_url,
        retrieved_on: doc.retrieved_on,
        sha256: extracted.sha256,
        page: page.page,
        char_start: s.start,
        char_end: s.end,
        extraction: page.method as "text-layer" | "ocr" | "html-text",
        retrievable: !doc.non_retrievable_pages.includes(page.page),
        page_headings: [...new Set(headings)],
        y3172_nodes: Object.entries(tags.nodes)
          .filter(([, ts]) => ts.some((t) => termMatches(lower, t)))
          .map(([n]) => n as NodeId),
        dimension_ids: Object.entries(tags.dimensions)
          .filter(([, ts]) => ts.some((t) => termMatches(lower, t)))
          .map(([d]) => Number(d)),
        text,
      });
    });
  }
  return partial.map((c, i) => ({ ...c, chunk_index: i, total_chunks: partial.length }));
}

/** Throws unless every chunk is a verbatim slice of the stored text of its page. */
export function assertChunksVerbatim(chunks: Chunk[], extractedByFile: Record<string, Extracted>): void {
  for (const c of chunks) {
    const page = extractedByFile[c.source_file]?.pages.find((p) => p.page === c.page);
    if (!page) throw new Error(`chunk ${c.id}: no stored page ${c.page}`);
    if (page.text.slice(c.char_start, c.char_end) !== c.text) {
      throw new Error(`chunk ${c.id}: not a verbatim slice of stored text for page ${c.page}`);
    }
  }
}

/** Reads the SHA-256 table in sources/README.md: | `file` | ... | `hash` | */
export function parseSourceHashes(readme: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of readme.split("\n")) {
    const m = line.match(/^\|\s*`([^`]+)`\s*\|.*\|\s*`([0-9a-f]{64})`\s*\|\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}
