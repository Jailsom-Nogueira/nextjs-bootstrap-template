import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/Social Platform Template/i);
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.ok).toBe(true);
});
