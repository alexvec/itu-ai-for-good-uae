#!/usr/bin/env node
// Renders a docx to PDF through Pages.app and counts pages. Does not save over the docx.
//
//   node scripts/measure-report.mjs docs/technical-report.docx [--pdf /path/out.pdf]
//
// Primary count: mdls kMDItemNumberOfPages. Fallback: page objects in the PDF, which can undercount, so look at the
// pages too. Pages and Word paginate differently: the pass bar is at most 5 pages with the last no more than half full.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const docx = resolve(args[0] ?? "docs/technical-report.docx");
const i = args.indexOf("--pdf");
const pdf = i >= 0 ? resolve(args[i + 1]) : join(mkdtempSync(join(tmpdir(), "report-pdf-")), "report.pdf");
if (!existsSync(docx)) { console.error(`no such file: ${docx}`); process.exit(1); }

const script = `
tell application "Pages"
  activate
  delay 4
  set d to open POSIX file ${JSON.stringify(docx)}
  delay 2
  export d to POSIX file ${JSON.stringify(pdf)} as PDF
  close d saving no
end tell`;
execFileSync("osascript", ["-e", script], { stdio: "inherit", timeout: 180000 });
if (!existsSync(pdf)) { console.error("Pages did not write a PDF: page count unmeasured"); process.exit(1); }

let count = null;
let method = "";
for (let tries = 0; tries < 8 && count === null; tries++) {
  const out = execFileSync("mdls", ["-name", "kMDItemNumberOfPages", pdf], { encoding: "utf8" });
  const m = /=\s*(\d+)/.exec(out);
  if (m) { count = Number(m[1]); method = "mdls kMDItemNumberOfPages"; } else execFileSync("sleep", ["1"]);
}
const objects = (readFileSync(pdf).toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
if (count === null) { count = objects; method = "page objects in the PDF (can undercount; confirm by eye)"; }
console.log(JSON.stringify({ docx, pdf, renderer: "Pages.app", pages: count, method, page_objects: objects, date: new Date().toISOString().slice(0, 10) }, null, 1));
