import { test } from "@playwright/test";

// TODO(admin-gate-e2e): seed an admin user in CI before enabling.
// This spec is intentionally skipped until the e2e setup provisions a
// `profiles.role = 'admin'` user we can authenticate as.
test.describe.skip("admin gate", () => {
  test("non-admin user is redirected away from /admin", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/^.*\/(en|pt|es)?\/?$/);
  });

  test("admin user can access /admin", async ({ page }) => {
    await page.goto("/admin");
    // Expect the admin dashboard heading to render.
  });
});
