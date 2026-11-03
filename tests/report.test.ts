import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT } from "../scripts/kb-io.ts";

const NODE_ROWS = ["SRC", "C", "PP", "M", "P", "D", "SINK"].map((n) => `| ${n} | use ${n} | D1 name | "quote for ${n}" |`).join("\n");
const heads = ["Short introduction", "Use case", "Requirements", "Mapping to ITU-T Y.3172", "Readiness", "Local policies", "Scenario", "Gaps"];
const section = (i: number) => `## ${i + 1}. ${heads[i]}\n\nBody of **section** ${i + 1}, with \`a-chunk-id\` & an ampersand.\n\n${i === 3 ? `| Node | Use case | Readiness dimension | Policy document |\n|---|---|---|---|\n${NODE_ROWS}\n` : ""}${i === 5 ? "| Rule | Quote |\n|---|---|\n| TL-12 | \"must obtain\" |\n" : ""}`;
const fixture = (n = 8) => `# Part B. Technical report\n\nNotes that must not appear.\n\n---\n\n**Test Solution: a report**\n\n${Array.from({ length: n }, (_, i) => section(i)).join("\n")}\n---\n\nAfter the report, must not appear.\n`;

function build(md: string) {
  const dir = mkdtempSync(join(tmpdir(), "report-test-"));
  const input = join(dir, "in.md");
  const out = join(dir, "out.docx");
  writeFileSync(input, md);
  const r = spawnSync("node", [join(ROOT, "scripts/build-report.mjs"), "--in", input, "--out", out], { encoding: "utf8" });
  return { r, out };
}
const part = (docx: string, name: string) => execFileSync("unzip", ["-p", docx, name], { encoding: "utf8", maxBuffer: 1e8 });
const template = join(ROOT, "sources/submission-template.docx");

describe("report pipeline", () => {
  it("fills a copy of the template, keeping its styles, numbering and page setup", () => {
    const { r, out } = build(fixture());
    expect(r.status, r.stderr).toBe(0);
    for (const name of ["word/styles.xml", "word/numbering.xml", "word/settings.xml", "word/theme/theme1.xml"]) expect(part(out, name)).toBe(part(template, name));
    const doc = part(out, "word/document.xml");
    const sect = /<w:sectPr[\s\S]*?<\/w:sectPr>/;
    expect(sect.exec(doc)![0]).toBe(sect.exec(part(template, "word/document.xml"))![0]);
    expect(doc).toContain('<w:tblGrid><w:gridCol w:w="1541"/><w:gridCol w:w="2300"/><w:gridCol w:w="2300"/><w:gridCol w:w="3218"/></w:tblGrid>');
    expect((doc.match(/<w:numId w:val="4"\/>/g) ?? []).length).toBe(8);
  });

  it("leaves none of the sample, and takes only the report out of Part B", () => {
    const { out } = build(fixture());
    const text = part(out, "word/document.xml").replace(/<[^>]+>/g, "");
    for (const s of [/smart.?pen/i, /stylus/i, /classroom/i, /handwriting/i, /Team Name/, /NOTE:/, /Notes that must not/, /After the report/]) expect(text).not.toMatch(s);
    expect(text).toContain("Test Solution");
    expect(text).toContain("&amp; an ampersand");
    expect(part(out, "docProps/core.xml")).not.toContain("Meng");
  });

  it("puts no email address in the document", () => {
    const { out } = build(fixture());
    expect(part(out, "word/document.xml").replace(/<[^>]+>/g, "")).not.toMatch(/[\w.-]+@[\w-]+\.\w+/);
  });

  it("refuses a report without the eight sections or the node rows", () => {
    expect(build(fixture(7)).r.status).toBe(1);
    expect(build(fixture().replace("| PP | use PP", "| XX | use PP")).r.status).toBe(1);
  });

  it("writes the content types part first", () => {
    const { out } = build(fixture());
    const names = execFileSync("unzip", ["-Z1", out], { encoding: "utf8" }).trim().split("\n");
    expect(names[0]).toBe("[Content_Types].xml");
    expect(readFileSync(out).subarray(0, 2).toString()).toBe("PK");
  });
});
