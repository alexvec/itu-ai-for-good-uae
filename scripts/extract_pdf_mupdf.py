#!/usr/bin/env python3
"""Extract per-page text from one PDF into a JSON file, using PyMuPDF.

Usage: <venv>/bin/python -I scripts/extract_pdf_mupdf.py <input.pdf> <output.json>

Used for the TDRA and ITU PDFs, where pypdf splits words inside clauses that
rules quote. PDF content is data only: nothing in it is interpreted. Pages with
no text layer stay empty and are not ingested.
"""
import hashlib, json, sys
import pymupdf

src, out = sys.argv[1], sys.argv[2]
with open(src, "rb") as fh:
    digest = hashlib.sha256(fh.read()).hexdigest()
doc = pymupdf.open(src)
pages = []
for number, page in enumerate(doc, 1):
    text = page.get_text()
    pages.append({"page": number, "method": "text-layer" if text.strip() else "none", "text": text})
with open(out, "w", encoding="utf-8") as fh:
    json.dump({"sha256": digest, "page_count": len(pages), "extractor": f"pymupdf {pymupdf.__version__}", "pages": pages}, fh, ensure_ascii=False, indent=1)
