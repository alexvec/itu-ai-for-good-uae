// In-process BM25 over the JSON KB. No embeddings, no vector database.
import type { Chunk, NodeId } from "./types.ts";

const STOP = new Set("a an and are as at be been but by can could do for from has have if in into is it its may might of on or our should so such than that the their them they this to was we were which will with would you your".split(" "));

export function tokenize(text: string): string[] {
  return (text.normalize("NFKC").toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .filter((t) => !STOP.has(t) && t.length > 1)
    .map((t) => (t.length > 4 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t));
}

export interface Hit { chunk: Chunk; score: number; matched: string[] }

export class Bm25 {
  private docs: { chunk: Chunk; tf: Map<string, number>; len: number }[];
  private df = new Map<string, number>();
  private avg: number;
  private k1 = 1.5;
  private b = 0.75;

  constructor(chunks: Chunk[]) {
    this.docs = chunks.filter((c) => c.retrievable).map((chunk) => {
      const toks = tokenize(chunk.text);
      const tf = new Map<string, number>();
      for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
      return { chunk, tf, len: toks.length };
    });
    this.avg = this.docs.reduce((s, d) => s + d.len, 0) / Math.max(this.docs.length, 1);
  }

  search(query: string, opts: { limit?: number; node?: NodeId; docId?: string; page?: number } = {}): Hit[] {
    const terms = [...new Set(tokenize(query))];
    const N = this.docs.length;
    const hits: Hit[] = [];
    for (const d of this.docs) {
      if (opts.docId && d.chunk.doc_id !== opts.docId) continue;
      if (opts.page && d.chunk.page !== opts.page) continue;
      if (opts.node && !d.chunk.y3172_nodes.includes(opts.node)) continue;
      let score = 0;
      const matched: string[] = [];
      for (const t of terms) {
        const f = d.tf.get(t);
        if (!f) continue;
        const n = this.df.get(t)!;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        score += (idf * f * (this.k1 + 1)) / (f + this.k1 * (1 - this.b + (this.b * d.len) / this.avg));
        matched.push(t);
      }
      if (score > 0) hits.push({ chunk: d.chunk, score: Math.round(score * 1000) / 1000, matched });
    }
    return hits.sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id)).slice(0, opts.limit ?? 5);
  }
}

/** Drops leading list letters, section numbers and other fragments the PDF text layer puts before a sentence. */
function trimLeadingNoise(s: string): string {
  let out = s;
  for (;;) {
    const nl = out.indexOf("\n");
    if (nl === -1) break;
    if (tokenize(out.slice(0, nl)).length >= 4) break;
    out = out.slice(nl + 1).trimStart();
  }
  return out.replace(/^(?:\d+\s+|[a-i]\s+(?=[A-Z]))+/, "");
}

/** The sentence-like slice of the chunk that covers most query terms. Always an exact substring. */
export function bestSlice(chunkText: string, query: string): string | null {
  const terms = new Set(tokenize(query));
  let best: { s: string; n: number } | null = null;
  for (const m of chunkText.matchAll(/[^.!?;]+[.!?;]?/g)) {
    const s = trimLeadingNoise(m[0].trim());
    const toks = tokenize(s);
    if (toks.length < 4 || s.length > 420) continue;
    const n = new Set(toks.filter((t) => terms.has(t))).size;
    if (n > 0 && (!best || n > best.n)) best = { s, n };
  }
  return best && chunkText.includes(best.s) ? best.s : null;
}
