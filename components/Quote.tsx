// data-testid and the raw text node let the e2e test compare displayed text with the chunk byte for byte.
export function Quote(p: { quote: string; chunkId: string; page: number; short: string; heading?: string; ocr?: boolean }) {
  return (
    <figure style={{ margin: ".4rem 0" }}>
      <blockquote className="quote" data-testid="quote" data-chunk={p.chunkId}>{p.quote}</blockquote>
      <figcaption className="cite">
        {p.short}, PDF p. {p.page}
        {p.heading ? `, ${p.heading}` : ""} <span className="mono">{p.chunkId}</span>
        {p.ocr && <span className="tag ocr" style={{ marginLeft: 4 }}>OCR-derived</span>}
      </figcaption>
    </figure>
  );
}
