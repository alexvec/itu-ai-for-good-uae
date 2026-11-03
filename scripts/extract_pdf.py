#!/usr/bin/env python3
"""Extract per-page text from one PDF into a JSON file.

Usage: python3 -I scripts/extract_pdf.py <input.pdf> <output.json>

PDF content is treated as data only. Nothing in it is interpreted. Text comes
from the PDF text layer via pypdf; pages with no text layer stay empty here and
are handled by scripts/ocr_pages.py.
"""
import hashlib, json, logging, sys
from pypdf import PdfReader

logging.getLogger("pypdf").setLevel(logging.ERROR)

src, out = sys.argv[1], sys.argv[2]
with open(src, "rb") as fh:
    digest = hashlib.sha256(fh.read()).hexdigest()
reader = PdfReader(src)
pages = []
for number, page in enumerate(reader.pages, 1):
    text = page.extract_text() or ""
    pages.append({"page": number, "method": "text-layer" if text.strip() else "none", "text": text})
with open(out, "w", encoding="utf-8") as fh:
    json.dump({"sha256": digest, "page_count": len(pages), "extractor": "pypdf", "pages": pages}, fh, ensure_ascii=False, indent=1)
