import { expect, test } from "@playwright/test";

// Intentionally skipped until the e2e setup provisions and authenticates a
// `profiles.role = 'admin'` user. Keep the cases here as the contract for that fixture.
test.describe.skip("admin gate (requires seeded admin session)", () => {
  test("non-admin user is redirected away from /admin", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/^.*\/(en|pt|es)?\/?$/);
  });

  test("admin user can access /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: /admin dashboard/i })).toBeVisible();
  });
});
