import { defineConfig } from "@playwright/test";

// BASE_URL points the walk at a deployed site. SLOW_MO and RECORD=1 help a person record the demo.
const external = process.env.BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  timeout: 240_000,
  workers: 1,
  use: {
    baseURL: external ?? "http://localhost:3100",
    video: process.env.RECORD ? { mode: "on", size: { width: 1440, height: 900 } } : "off",
    viewport: { width: 1440, height: 900 },
    launchOptions: { slowMo: Number(process.env.SLOW_MO ?? 0) },
    acceptDownloads: true,
  },
  webServer: external ? undefined : { command: "npm run build && npx next start -p 3100", url: "http://localhost:3100", timeout: 200_000, reuseExistingServer: true },
});
