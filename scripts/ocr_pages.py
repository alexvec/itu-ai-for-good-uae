#!/usr/bin/env python3
"""OCR pages that have no usable text layer and write the result into the stored per-page JSON.

Usage: python3 -I scripts/ocr_pages.py <sources_dir> <extracted_dir>

Only pages listed in TARGETS are touched. Each target crops decorative artwork
(binary-digit texture, page furniture) that OCR would otherwise turn into noise.
The stored text is raw tesseract output and is never hand-edited. Chunks built
from these pages carry extraction "ocr" and are labelled OCR-derived on screen.
"""
import json, os, subprocess, sys, tempfile
import pypdfium2 as pdfium
from PIL import ImageOps

GUIDE = "uae-ai-adoption-guideline-government-services"
# (file stem, page, crop box as fractions left/top/right/bottom, invert for dark pages, tesseract psm)
TARGETS = [
    ("uae-ai-strategy-2031", 1, (0.0, 0.38, 1.0, 1.0), False, 11),
    ("uae-ai-strategy-2031", 25, (0.1, 0.93, 0.9, 1.0), False, 6),
    ("uae-ai-ethics-principles-2022", 25, (0.0, 0.0, 0.85, 0.12), False, 6),
    (GUIDE, 36, (0.0, 0.22, 1.0, 0.82), True, 11),
    (GUIDE, 56, (0.03, 0.2, 1.0, 0.83), True, 11),
]
src_dir, out_dir = sys.argv[1], sys.argv[2]
version = subprocess.run(["tesseract", "--version"], capture_output=True, text=True).stdout.splitlines()[0]
for stem, number, box, invert, psm in TARGETS:
    path = os.path.join(out_dir, stem + ".json")
    data = json.load(open(path, encoding="utf-8"))
    img = pdfium.PdfDocument(os.path.join(src_dir, stem + ".pdf"))[number - 1].render(scale=4).to_pil().convert("L")
    w, h = img.size
    img = img.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    if invert:
        img = ImageOps.invert(img)
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, "page.png")
        img.save(png)
        text = subprocess.run(["tesseract", png, "stdout", "-l", "eng", "--psm", str(psm)], capture_output=True, text=True).stdout
    lines = [ln.rstrip() for ln in text.splitlines() if ln.strip()]
    page = data["pages"][number - 1]
    page.update({"method": "ocr", "ocr_tool": version, "ocr_crop": list(box), "text": "\n".join(lines) + "\n"})
    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"=== {stem} p{number} ({len(page['text'])} chars)\n{page['text']}")
