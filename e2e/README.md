# `e2e/` — Playwright end-to-end tests

End-to-end browser tests that exercise the running application. Unit tests live next to their source under `src/**/*.test.{ts,tsx}` — keep those there. Use this directory only for tests that need a full browser, real navigation, and the actual Next.js server.

Configuration lives in `playwright.config.ts` at the repo root.

## Files

| File / directory           | Purpose                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `global-setup.ts`          | Playwright global setup hook. Currently a no-op stub; place DB seeding, admin user provisioning, and shared fixtures here. |
| `fixtures/`                | Reserved for test fixtures (seed data, mock files, auth tokens). Currently a `.gitkeep` placeholder.                       |
| `tests/smoke.spec.ts`      | Home page loads with the expected title; `/api/health` responds 200 with `{ ok: true }`.                                   |
| `tests/admin-gate.spec.ts` | Admin route gating contract. Suite is `test.describe.skip` until the fixture provisions an admin user.                     |

## How tests run

- **Local:** `npm run test:e2e` (or `npm run test:e2e:ui` for interactive mode). Playwright reuses an existing dev server on `http://localhost:3000` if one is running, otherwise it spawns `npm run dev` and waits up to 120s.
- **CI:** `.github/workflows/e2e.yml` runs on every pull request with `--with-deps` (installs Chromium + WebKit), uploads the HTML report as an artifact, retains for 7 days.
- **Pre-PR:** `npm run qa:strict` runs the e2e suite as part of the strict gate set.

## Conventions

- **One file per feature surface.** `smoke.spec.ts` for liveness, `admin-gate.spec.ts` for admin role gating. Add a new file when the surface is distinct.
- **Use auto-waiting locators.** `await expect(locator).toBeVisible()`, `await page.waitForURL(/.../)`. Do not sprinkle `page.waitForTimeout(N)` — those are flaky and forbidden by `.agents/rules/qa-loop.md`.
- **Never `.skip()` to dodge a failure.** Use `test.describe.skip` only for suites that genuinely cannot run until a missing fixture is provisioned, and document the gate (see `admin-gate.spec.ts`).
- **Tests against both Chromium and WebKit.** The config runs both projects. Do not write platform-specific assertions; fix the underlying issue.
- **Determinism.** Avoid wall-clock dependencies. If a test needs a fixed time, inject it via fixture, not via `Date.now()`.

## How to add a new e2e test

1. Decide the surface: home, auth, dashboard, admin, API, etc.
2. Create `tests/<feature>.spec.ts`. Group related cases in `test.describe`.
3. Use `page.goto("/route")` (the `baseURL` is set to `http://localhost:3000`).
4. Use semantic locators: `page.getByRole("button", { name: /save/i })`, `page.getByLabel("Email")`, etc. Avoid raw CSS unless the page genuinely lacks accessible names.
5. Run locally: `npm run test:e2e -- <feature>.spec.ts`.
6. Open `playwright-report/index.html` if a run fails.

## How to add a shared fixture

1. Create `fixtures/<name>.ts` (or `.json` / SQL / etc.).
2. Wire it into `global-setup.ts` so it loads once before the suite.
3. Update this README's "Files" table.
4. Update `.gitignore` if the fixture is generated and should not be committed.

## References

- Playwright docs: https://playwright.dev
- `.agents/rules/qa-loop.md` — forbidden patterns (no `waitForTimeout`, no `.skip()` as escape hatch).
- `playwright.config.ts` (repo root) — projects, retries, web server config.
- `.github/workflows/e2e.yml` — CI run.
