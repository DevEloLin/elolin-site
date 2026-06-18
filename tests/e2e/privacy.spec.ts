import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/products", "/projects", "/about", "/contact",
                "/zh/", "/zh/products", "/zh/projects", "/zh/about", "/zh/contact",
                "/projects/evoclaw"];

for (const route of ROUTES) {
  test(`${route} does not leak real name`, async ({ page }) => {
    await page.goto(route);
    const html = await page.content();
    expect(html).not.toMatch(/Elo lin/i);
    expect(html).not.toMatch(/wei\.li/i);
  });
}
