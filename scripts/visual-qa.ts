#!/usr/bin/env tsx
/**
 * scripts/visual-qa.ts — browser-side QA gate.
 *
 * For every route × locale × theme × viewport combination:
 *   1. Navigate the page in headless Chromium.
 *   2. Force the theme via `localStorage` (next-themes pattern), reload, wait for idle.
 *   3. Capture a full-page screenshot to `.agent-cache/visual-qa/`.
 *   4. Collect every console message during load + 1.5s idle.
 *   5. Run axe-core for WCAG 2.2 AA violations.
 *
 * Exits 1 if ANY of:
 *   - A `console.error` was logged.
 *   - A `console.warning` that isn't in the allowlist was logged.
 *   - axe-core returned a violation with impact `serious` or `critical`.
 *   - A React hydration mismatch string is detected.
 *
 * Designed to be called from `npm run qa:visual` (standalone) or wired into
 * `npm run qa:strict` (full gate before PR/release).
 *
 * Reads `.agent-cache/visual-qa-allowlist.json` if present.
 */
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { chromium, type ConsoleMessage } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type Theme = "light" | "dark";
type Locale = "en" | "pt" | "es";
type ViewportName = "desktop" | "mobile";

const ROUTES: ReadonlyArray<string> = [
  "/",
  "/login",
  "/signup",
  "/dashboard",
  "/admin",
  "/admin/users",
];
const LOCALES: ReadonlyArray<Locale> = ["en", "pt", "es"];
const THEMES: ReadonlyArray<Theme> = ["light", "dark"];
const VIEWPORTS: ReadonlyArray<{ name: ViewportName; width: number; height: number }> = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

const BASE_URL = process.env.VISUAL_QA_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = join(process.cwd(), ".agent-cache", "visual-qa");
const ALLOWLIST_PATH = join(process.cwd(), ".agent-cache", "visual-qa-allowlist.json");

type Allowlist = {
  readonly console_warnings: ReadonlyArray<string>;
  readonly console_errors: ReadonlyArray<string>;
};

function loadAllowlist(): Allowlist {
  const fallback: Allowlist = { console_warnings: [], console_errors: [] };
  if (!existsSync(ALLOWLIST_PATH)) return fallback;
  try {
    const raw = readFileSync(ALLOWLIST_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Allowlist>;
    return {
      console_warnings: parsed.console_warnings ?? [],
      console_errors: parsed.console_errors ?? [],
    };
  } catch {
    return fallback;
  }
}

function localizedPath(route: string, locale: Locale): string {
  // localePrefix: "as-needed" → English has no prefix, pt/es do.
  if (locale === "en") return route;
  return `/${locale}${route === "/" ? "" : route}`;
}

type RowResult = {
  route: string;
  locale: Locale;
  theme: Theme;
  viewport: ViewportName;
  url: string;
  status: number;
  consoleErrors: ReadonlyArray<string>;
  consoleWarnings: ReadonlyArray<string>;
  hydrationMismatch: boolean;
  axeViolations: ReadonlyArray<{
    id: string;
    impact: string;
    help: string;
    targets: ReadonlyArray<string>;
  }>;
  screenshotPath: string;
};

async function probeOne(
  route: string,
  locale: Locale,
  theme: Theme,
  viewport: (typeof VIEWPORTS)[number],
): Promise<RowResult> {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: theme,
  });
  // Pre-set localStorage so next-themes resolves the right class on first paint.
  await context.addInitScript((t: string) => {
    try {
      window.localStorage.setItem("theme", t);
    } catch {
      /* Storage access may be denied; theme still falls back to colorScheme. */
    }
  }, theme);

  const page = await context.newPage();
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];

  page.on("console", (msg: ConsoleMessage) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error") consoleErrors.push(text);
    else if (type === "warning") consoleWarnings.push(text);
  });
  page.on("pageerror", (err: Error) => {
    consoleErrors.push(`pageerror: ${err.message}`);
  });

  const url = `${BASE_URL}${localizedPath(route, locale)}`;
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
  const status = response?.status() ?? 0;

  // Settle: wait for network idle-ish and an idle frame.
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(1500);

  const html = await page.content();
  const hydrationMismatch = /A tree hydrated but some attributes|Hydration failed because/i.test(
    html + "\n" + consoleErrors.join("\n") + "\n" + consoleWarnings.join("\n"),
  );

  // axe-core. Skip auth-gated pages that returned a 3xx redirect — axe on the
  // landing of the redirect is fine, but rerunning is noisy.
  let axeViolations: Array<{
    id: string;
    impact: string;
    help: string;
    targets: string[];
  }> = [];
  try {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    axeViolations = results.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => ({
        id: v.id,
        impact: v.impact ?? "unknown",
        help: v.help,
        targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      }));
  } catch (err) {
    consoleErrors.push(`axe failure: ${err instanceof Error ? err.message : String(err)}`);
  }

  const safeName = `${route.replaceAll("/", "_") || "_root"}-${locale}-${theme}-${viewport.name}.png`;
  const screenshotPath = join(OUT_DIR, safeName);
  mkdirSync(dirname(screenshotPath), { recursive: true });
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await context.close();
  await browser.close();

  return {
    route,
    locale,
    theme,
    viewport: viewport.name,
    url,
    status,
    consoleErrors,
    consoleWarnings,
    hydrationMismatch,
    axeViolations,
    screenshotPath,
  };
}

function applyAllowlist(messages: ReadonlyArray<string>, allow: ReadonlyArray<string>): string[] {
  return messages.filter((m) => !allow.some((needle) => m.includes(needle)));
}

function pad(s: string, w: number): string {
  return s.length >= w ? s.slice(0, w) : s + " ".repeat(w - s.length);
}

async function main(): Promise<void> {
  console.warn(
    `Visual QA: ${ROUTES.length} routes × ${LOCALES.length} locales × ${THEMES.length} themes × ${VIEWPORTS.length} viewports = ${
      ROUTES.length * LOCALES.length * THEMES.length * VIEWPORTS.length
    } pages.`,
  );
  console.warn(`Base URL: ${BASE_URL}`);
  console.warn(`Screenshots: ${OUT_DIR}\n`);

  const allow = loadAllowlist();
  const rows: RowResult[] = [];

  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      for (const theme of THEMES) {
        for (const viewport of VIEWPORTS) {
          const r = await probeOne(route, locale, theme, viewport);
          rows.push(r);
        }
      }
    }
  }

  // Print compact table.
  console.warn(
    `\n${pad("ROUTE", 14)} ${pad("LOC", 4)} ${pad("THEME", 6)} ${pad("STATUS", 7)} ${pad("CON-E", 6)} ${pad("CON-W", 6)} ${pad("AXE", 4)} ${pad("HYD", 4)}  PATH`,
  );
  console.warn("-".repeat(120));

  let failed = 0;
  for (const r of rows) {
    const remainingErrors = applyAllowlist(r.consoleErrors, allow.console_errors);
    const remainingWarnings = applyAllowlist(r.consoleWarnings, allow.console_warnings);
    const isFailed =
      remainingErrors.length > 0 ||
      remainingWarnings.length > 0 ||
      r.hydrationMismatch ||
      r.axeViolations.length > 0;
    if (isFailed) failed += 1;
    console.warn(
      `${pad(r.route, 14)} ${pad(r.locale, 4)} ${pad(r.theme, 6)} ${pad(r.viewport, 8)} ${pad(String(r.status), 7)} ${pad(
        String(remainingErrors.length),
        6,
      )} ${pad(String(remainingWarnings.length), 6)} ${pad(String(r.axeViolations.length), 4)} ${pad(
        r.hydrationMismatch ? "Y" : "-",
        4,
      )}  ${isFailed ? "FAIL" : "ok  "}  ${r.screenshotPath}`,
    );
  }

  if (failed > 0) {
    console.error(`\n${failed} visual-QA row(s) failed. Details:\n`);
    for (const r of rows) {
      const remainingErrors = applyAllowlist(r.consoleErrors, allow.console_errors);
      const remainingWarnings = applyAllowlist(r.consoleWarnings, allow.console_warnings);
      if (
        remainingErrors.length === 0 &&
        remainingWarnings.length === 0 &&
        !r.hydrationMismatch &&
        r.axeViolations.length === 0
      ) {
        continue;
      }
      console.error(`URL ${r.url}  (theme=${r.theme}, viewport=${r.viewport})`);
      if (r.hydrationMismatch) console.error(`    HYDRATION mismatch detected`);
      for (const e of remainingErrors) console.error(`    [error] ${e}`);
      for (const w of remainingWarnings) console.error(`    [warn]  ${w}`);
      for (const v of r.axeViolations) {
        console.error(`    [axe ${v.impact}] ${v.id}: ${v.help}`);
        for (const target of v.targets) {
          console.error(`        target: ${target}`);
        }
      }
    }
    process.exitCode = 1;
    return;
  }

  console.warn(`\nAll ${rows.length} visual-QA rows passed.`);
}

main().catch((err: unknown) => {
  console.error("visual-qa script crashed:", err);
  process.exitCode = 1;
});
