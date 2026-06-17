import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  webServer: { command: "pnpm dev", url: "http://localhost:4321", reuseExistingServer: true },
  use: { baseURL: "http://localhost:4321" },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
