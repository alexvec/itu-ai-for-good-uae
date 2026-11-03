// Walks docs/demo-path.md. Run: npx playwright test
// Against the live site: BASE_URL=https://itu-ai-for-good-uae.vercel.app npx playwright test
// To record: RECORD=1 SLOW_MO=400 npx playwright test --headed
import { expect, test, type Page } from "@playwright/test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Every quote on screen must be a substring of the chunk it names. Compares raw DOM text with the KB export. */
async function checkQuotes(page: Page, kb: Map<string, string>) {
  const quotes = await page.getByTestId("quote").evaluateAll((els) => els.map((e) => ({ id: (e as HTMLElement).dataset.chunk!, text: e.textContent! })));
  for (const q of quotes) expect(kb.get(q.id), `chunk ${q.id}`).toContain(q.text);
  return quotes.length;
}

test("demo path", async ({ page, request }) => {
  const res = await request.get("/api/kb.jsonl");
  expect(res.ok()).toBe(true);
  const kb = new Map<string, string>((await res.text()).trim().split("\n").map((l) => JSON.parse(l)).map((c) => [c.id, c.text]));
  expect(kb.size).toBeGreaterThan(100);

  // Step 1: the knowledge base and its limits.
  await page.goto("/kb");
  await expect(page.getByTestId("limits-banner")).toContainText("no binding telecom sector law");
  await expect(page.getByTestId("kb-table").locator("tbody tr")).toHaveCount(4);
  await expect(page.getByTestId("kb-table")).toContainText("79e05c502d1fc1247165fc744205984675d6422a490a70201dc4c05bf9aed693");
  await expect(page.getByTestId("not-ingested")).toContainText("Telecom Law");
  await expect(page.getByTestId("not-ingested")).toContainText("PDPL");
  await expect(page.getByTestId("term-counts")).toContainText("telecom");
  expect(await checkQuotes(page, kb)).toBeGreaterThan(0);

  // Step 2: the scenario, one event at a time.
  await page.goto("/");
  await expect(page.getByTestId("synthetic")).toBeVisible();
  await expect(page.getByTestId("running-state")).toContainText("No model or key is used");
  const events = ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9"];
  for (const id of events) {
    await page.getByTestId("release").click();
    await expect(page.getByTestId(`event-${id}`)).toBeVisible();
    await expect(page.getByTestId(`event-${id}`).getByTestId("headline")).not.toBeEmpty();
    if (id === "e2") await expect(page.getByTestId("event-e2")).toContainText("PR-03");
    if (id === "e4") await expect(page.getByTestId("event-e4").getByTestId("decision")).toContainText("crowd challenge");
    if (id === "e6") {
      const decision = page.getByTestId("event-e6").getByTestId("decision");
      await expect(decision.getByTestId("outcomes")).toContainText("Requires purpose limitation");
      await expect(decision.getByTestId("outcomes")).toContainText("not addressed in the ingested documents");
      await expect(decision).toContainText("by analogy");
    }
  }
  await expect(page.getByTestId("release")).toBeDisabled();
  await checkQuotes(page, kb);

  // Step 3: a typed event.
  await page.goto("/free-text");
  await page.getByTestId("free-text").fill("A law enforcement request asks for stored communications metadata that the pre-processor has already transformed.");
  await page.getByTestId("free-submit").click();
  await expect(page.getByTestId("free-result").first()).toContainText("not addressed in the ingested documents");
  await checkQuotes(page, kb);

  // Step 4: gaps.
  await page.goto("/gaps");
  await expect(page.getByTestId("global-note")).toContainText("no global example in KB");
  await expect(page.getByTestId("control-gap").first()).toContainText("candidate, needs human legal review");
  await checkQuotes(page, kb);

  // Step 5: the evidence table, in template order.
  await page.goto("/evidence");
  const nodes = await page.getByTestId("evidence-table").locator("tbody tr td:first-child").allInnerTexts();
  expect(nodes.map((n) => n.trim())).toEqual(["SRC", "C", "PP", "M", "P", "D", "SINK"]);
  await expect(page.getByTestId("non-data-table")).toContainText("Strategy alignment");
  await expect(page.getByTestId("non-data-table")).toContainText("Interface design");
  await expect(page.getByTestId("non-data-table")).toContainText("Collaboration between AI and a human");
  await checkQuotes(page, kb);

  // Step 6: the audit log, in the browser and with the script.
  await page.goto("/audit");
  await page.getByTestId("verify").click();
  await expect(page.getByTestId("verify-result")).toContainText("VERIFIED");
  await page.getByTestId("tamper").click();
  await expect(page.getByTestId("verify-result")).toContainText("FAILED");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("export").click()]);
  const dir = mkdtempSync(join(tmpdir(), "demo-"));
  const file = join(dir, "audit.jsonl");
  await download.saveAs(file);
  expect(execFileSync("node", ["scripts/verify-audit.ts", file], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })).toContain("VERIFIED");
  const bytes = readFileSync(file);
  bytes[200] ^= 0x01;
  writeFileSync(file, bytes);
  expect(spawnSync("node", ["scripts/verify-audit.ts", file]).status).toBe(1);
});
