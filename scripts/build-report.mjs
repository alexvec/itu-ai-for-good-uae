#!/usr/bin/env node
// Fills a copy of sources/submission-template.docx from Part B of docs/submission.md.
// Keeps the template's styles, numbering, page setup and node table; replaces its sample content.
//
//   node scripts/build-report.mjs [--in docs/submission.md] [--out docs/technical-report.docx]
//                                 [--team NAME] [--leader NAME] [--members TEXT] [--contact TEXT] [--github URL]
//
// Part B input, in Markdown:
//   - it starts at the first line after "# Part B" that begins with "**" (the report title) and runs to the first
//     line of "---" after "## 1.", or to the end of the file;
//   - "## N. Title" lines are the eight section headings (the template numbers them, so N is dropped);
//   - a table whose first column header is "Node" fills the template's node table: 4 columns, rows SRC to SINK;
//   - other tables, "- " bullets, "1. " items and paragraphs are supported, with **bold** and `code` inline.
// Quote text is copied as written; only Markdown markers and the \| escape are removed.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const IN = resolve(opt("in", join(ROOT, "docs/submission.md")));
const OUT = resolve(opt("out", join(ROOT, "docs/technical-report.docx")));
const TEMPLATE = join(ROOT, "sources/submission-template.docx");
const TEAM = opt("team", "Windboy");
const LEADER = opt("leader", "Alex Veciana Belmonte");
const MEMBERS = opt("members", "none");
const CONTACT = opt("contact", "through the GitHub repository below");
const GITHUB = opt("github", "https://github.com/alexvec/itu-ai-for-good-uae");
const NODES = ["SRC", "C", "PP", "M", "P", "D", "SINK"];
const SAMPLE = [/smart.?pen/i, /stylus/i, /classroom/i, /handwriting/i, /learning disabilit/i, /in-app/i, /Team Name/, /Solution Name/, /NOTE:/];

const die = (m) => {
  console.error(`build-report: ${m}`);
  process.exit(1);
};

// ---- Part B ----
export function partB(md) {
  const lines = md.split("\n");
  const at = lines.findIndex((l) => /^# Part B/.test(l));
  if (at < 0) die('no "# Part B" heading');
  const from = lines.findIndex((l, i) => i > at && l.startsWith("**"));
  if (from < 0) die("no report title after # Part B");
  const first = lines.findIndex((l, i) => i > from && /^## 1\./.test(l));
  if (first < 0) die('no "## 1." section');
  let to = lines.findIndex((l, i) => i > first && /^---\s*$/.test(l));
  if (to < 0) to = lines.length;
  return lines.slice(from, to);
}

function blocks(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim() || /^---\s*$/.test(l)) { i++; continue; }
    if (/^##\s/.test(l)) { out.push({ t: "h", text: l.replace(/^##\s+(\d+\.\s*)?/, "").trim() }); i++; continue; }
    if (/^###\s/.test(l)) { out.push({ t: "p", text: `**${l.replace(/^###\s+/, "").trim()}**` }); i++; continue; }
    if (l.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|[\s:|-]+\|\s*$/.test(lines[i])) rows.push(lines[i].trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, "|").trim()));
        i++;
      }
      out.push({ t: "table", rows });
      continue;
    }
    const buf = [l];
    i++;
    if (!/^(- |\d+\. )/.test(l)) while (i < lines.length && lines[i].trim() && !/^(#|\||- |\d+\. |---)/.test(lines[i])) buf.push(lines[i++]);
    const text = buf.join(" ").trim();
    if (text.startsWith("- ")) out.push({ t: "p", text: `• ${text.slice(2)}` });
    else out.push({ t: "p", text });
  }
  return out;
}

// ---- XML ----
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clean = (p) => p.replace(/ (w14:paraId|w14:textId|w:rsid\w*)="[^"]*"/g, "");
const pPrOf = (p) => /<w:pPr>[\s\S]*?<\/w:pPr>/.exec(p)?.[0] ?? "";
const rPrOf = (p) => /<w:r[ >][\s\S]*?(<w:rPr>[\s\S]*?<\/w:rPr>)/.exec(p)?.[1] ?? "<w:rPr/>";
const bolded = (rPr) => (rPr.includes("<w:b/>") ? rPr : rPr === "<w:rPr/>" ? "<w:rPr><w:b/><w:bCs/></w:rPr>" : rPr.replace(/(<w:rFonts[^>]*\/>)|<w:rPr>(?!<w:rFonts)/, (m) => (m.startsWith("<w:rFonts") ? `${m}<w:b/><w:bCs/>` : "<w:rPr><w:b/><w:bCs/>")));

function runs(text, rPr) {
  const out = [];
  for (const part of text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)) {
    if (!part) continue;
    if (part.startsWith("**")) out.push(`<w:r>${bolded(rPr)}<w:t xml:space="preserve">${esc(part.slice(2, -2))}</w:t></w:r>`);
    else if (part.startsWith("`")) out.push(`<w:r>${rPr}<w:t xml:space="preserve">${esc(part.slice(1, -1))}</w:t></w:r>`);
    else out.push(`<w:r>${rPr}<w:t xml:space="preserve">${esc(part)}</w:t></w:r>`);
  }
  return out.join("");
}
const para = (proto, text, rPr = rPrOf(proto)) => `<w:p>${pPrOf(proto)}${runs(text, rPr)}</w:p>`;

function fillRow(rowProto, cells) {
  const tcs = rowProto.match(/<w:tc>[\s\S]*?<\/w:tc>/g);
  const pProtoRun = rowProto.match(/<w:p[ >][\s\S]*?<\/w:p>/g).find((p) => p.includes("<w:r>") || p.includes("<w:r ")) ?? rowProto.match(/<w:p[ >][\s\S]*?<\/w:p>/)[0];
  const open = /^<w:tr[^>]*>/.exec(rowProto)[0].replace(/ (w14:paraId|w14:textId|w:rsid\w*)="[^"]*"/g, "");
  const trPr = /<w:trPr>[\s\S]*?<\/w:trPr>/.exec(rowProto)?.[0] ?? "";
  const body = tcs.map((tc, i) => `<w:tc>${/<w:tcPr>[\s\S]*?<\/w:tcPr>/.exec(tc)[0]}${para(pProtoRun, cells[i] ?? "")}</w:tc>`).join("");
  return `${open}${trPr}${body}</w:tr>`;
}

function nodeTable(tplTable, rows) {
  if (rows.some((r) => r.length !== 4)) die("the node table must have 4 columns: Node, Use case, Readiness dimension, Policy document");
  const got = rows.slice(1).map((r) => r[0].replace(/[*`]/g, ""));
  if (got.join() !== NODES.join()) die(`the node table rows must be ${NODES.join(", ")}; got ${got.join(", ")}`);
  const head = /^<w:tbl>[\s\S]*?<\/w:tblGrid>/.exec(tplTable)[0];
  const trs = tplTable.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g);
  return `${head}${fillRow(trs[1], rows[0])}${rows.slice(1).map((r, i) => fillRow(trs[i + 1], r)).join("")}</w:tbl>`;
}

function otherTable(tplTable, rows) {
  const n = Math.max(...rows.map((r) => r.length));
  const total = Number(/<w:tblW w:w="(\d+)"/.exec(tplTable)[1]);
  const weight = Array.from({ length: n }, (_, c) => Math.max(8, Math.min(60, Math.max(...rows.map((r) => (r[c] ?? "").length)))));
  const sum = weight.reduce((a, b) => a + b, 0);
  const widths = weight.map((w) => Math.floor((w / sum) * total));
  const tblPr = /<w:tblPr>[\s\S]*?<\/w:tblPr>/.exec(tplTable)[0];
  const tcMar = /<w:tcMar>[\s\S]*?<\/w:tcMar>/.exec(tplTable)?.[0] ?? "";
  // The template's second row holds its plain body cells; its header row is bold.
  const pProto = tplTable.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g)[1].match(/<w:p[ >][\s\S]*?<\/w:p>/g).find((p) => /<w:r[ >]/.test(p));
  const cell = (text, head) => (head ? `<w:p>${pPrOf(pProto)}${runs(text, bolded(rPrOf(pProto)))}</w:p>` : para(pProto, text));
  const grid = `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>`;
  const trs = rows.map((r, i) => `<w:tr>${widths.map((w, c) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${tcMar}</w:tcPr>${cell(r[c] ?? "", i === 0)}</w:tc>`).join("")}</w:tr>`);
  return `<w:tbl>${tblPr}${grid}${trs.join("")}</w:tbl>`;
}

export function fill(xml, lines) {
  const start = xml.indexOf("<w:body>") + 8;
  const end = xml.lastIndexOf("</w:body>");
  const body = xml.slice(start, end);
  const items = [...body.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>|<w:p[ >][\s\S]*?<\/w:p>|<w:sectPr[\s\S]*?<\/w:sectPr>/g)].map((m) => m[0]);
  const sect = items.find((i) => i.startsWith("<w:sectPr"));
  const tbl = items.find((i) => i.startsWith("<w:tbl>"));
  const ps = items.filter((i) => i.startsWith("<w:p"));
  const [titleP, leaderP, membersP, githubP, spacerP] = ps;
  const headingP = ps.find((p) => p.includes('w:val="ListParagraph"') && p.includes("<w:numPr>"));
  const bodyP = ps[ps.indexOf(headingP) + 1];
  const out = [];

  const titleLine = lines[0].replace(/\*\*/g, "").trim();
  const solution = titleLine.split(":")[0].trim();
  out.push(para(titleP, `AI for Good Sandbox Hackathon – ${TEAM} – ${solution}`, rPrOf(titleP)));
  const fieldR = rPrOf(membersP);
  out.push(para(leaderP, `Team leader: ${LEADER}`, fieldR));
  out.push(`<w:p>${pPrOf(membersP)}<w:r>${fieldR}<w:t xml:space="preserve">${esc(`Team members: ${MEMBERS}`)}</w:t></w:r><w:r><w:br/></w:r><w:r>${fieldR}<w:t xml:space="preserve">${esc(`Contact details: ${CONTACT}`)}</w:t></w:r></w:p>`);
  out.push(para(githubP, `Github link: ${GITHUB}`, fieldR));
  out.push(clean(spacerP));

  const bs = blocks(lines.slice(1));
  const heads = bs.filter((b) => b.t === "h");
  if (heads.length !== 8) die(`expected the 8 sections in docs/template-shape.md, found ${heads.length}`);
  let nodeTables = 0;
  let seenHeading = false;
  for (const b of bs) {
    if (b.t === "h") { seenHeading = true; out.push(para(headingP, b.text).replace('<w:pStyle w:val="ListParagraph"/>', '<w:pStyle w:val="ListParagraph"/><w:keepNext/>')); continue; }
    if (b.t === "p") { out.push(para(seenHeading ? bodyP : leaderP, b.text, seenHeading ? undefined : fieldR)); continue; }
    if (b.rows[0][0].replace(/[*`]/g, "").trim() === "Node" && b.rows.length === 8) { nodeTables++; out.push(nodeTable(tbl, b.rows)); } else out.push(otherTable(tbl, b.rows));
    out.push(clean(spacerP));
  }
  if (nodeTables !== 1) die(`expected one node table with rows ${NODES.join(", ")}, found ${nodeTables}`);
  return xml.slice(0, start) + out.join("") + sect + xml.slice(end);
}

function main() {
  const lines = partB(readFileSync(IN, "utf8"));
  const dir = mkdtempSync(join(tmpdir(), "report-build-"));
  try {
    const work = join(dir, "docx");
    mkdirSync(work);
    execFileSync("unzip", ["-q", TEMPLATE, "-d", work]);
    const docPath = join(work, "word/document.xml");
    const filled = fill(readFileSync(docPath, "utf8"), lines);
    for (const re of SAMPLE) if (re.test(filled.replace(/<[^>]+>/g, ""))) die(`template sample text remains: ${re}`);
    writeFileSync(docPath, filled);
    const corePath = join(work, "docProps/core.xml");
    writeFileSync(corePath, readFileSync(corePath, "utf8").replace(/<dc:creator>[^<]*<\/dc:creator>/, `<dc:creator>${esc(LEADER)}</dc:creator>`).replace(/<cp:lastModifiedBy>[^<]*<\/cp:lastModifiedBy>/, `<cp:lastModifiedBy>${esc(LEADER)}</cp:lastModifiedBy>`));
    mkdirSync(dirname(OUT), { recursive: true });
    rmSync(OUT, { force: true });
    execFileSync("zip", ["-X", "-q", OUT, "[Content_Types].xml"], { cwd: work });
    execFileSync("zip", ["-X", "-q", "-r", OUT, ".", "-x", "[Content_Types].xml"], { cwd: work });
    console.log(`wrote ${OUT}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
main();
