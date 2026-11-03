// Backs the "verify" button: re-finds a displayed quote in its chunk, and the chunk in the stored text of its source file.
import law from "../kb/extracted/uae-telecom-law-2003-wipo-en-extracted.json" with { type: "json" };
import cpr from "../kb/extracted/tdra-consumer-protection-regulations-v2.0-2023.json" with { type: "json" };
import uec from "../kb/extracted/tdra-unsolicited-electronic-communications-policy-2009.json" with { type: "json" };
import strategy from "../kb/extracted/uae-ai-strategy-2031.json" with { type: "json" };
import charter from "../kb/extracted/uae-ai-charter-methaq.json" with { type: "json" };
import ethics from "../kb/extracted/uae-ai-ethics-principles-2022.json" with { type: "json" };
import guideline from "../kb/extracted/uae-ai-adoption-guideline-government-services.json" with { type: "json" };
import y3172 from "../kb/extracted/itu-t-y3172-2019.json" with { type: "json" };
import readiness from "../kb/extracted/itu-ai-readiness-framework-report-2.0-2026.json" with { type: "json" };
import { chunkById, docById } from "./data.ts";

const stored: Record<string, { sha256: string; pages: { page: number; text: string }[] }> = { law, cpr, uec, strategy, charter, ethics, guideline, y3172, readiness };

export interface VerifyResult { found: boolean; reason?: string; chunk_id?: string; file?: string; sha256?: string; page?: number; char_start?: number; char_end?: number; article?: string | null; document?: string }

export function verifyQuote(chunkId: string, quote: string): VerifyResult {
  const c = chunkById.get(chunkId);
  if (!c) return { found: false, reason: "no such chunk" };
  const inChunk = c.text.indexOf(quote);
  if (inChunk < 0) return { found: false, reason: "the quote is not in the chunk" };
  const src = stored[c.doc_id];
  const page = src?.pages.find((p) => p.page === c.page);
  if (!src || !page || page.text.slice(c.char_start, c.char_end) !== c.text) return { found: false, reason: "the chunk is not a slice of the stored text" };
  const start = c.char_start + inChunk;
  return { found: true, chunk_id: c.id, file: c.source_file, sha256: src.sha256, page: c.page, char_start: start, char_end: start + quote.length, article: c.article, document: docById.get(c.doc_id)!.short };
}
