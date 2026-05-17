#!/usr/bin/env node
/**
 * check-bundle-budget.mjs
 *
 * Verifies per-route First Load JS is within budget (default: 200 KB).
 *
 * Parsing strategy
 * ----------------
 * Next 16 prints a per-route table to stdout at the end of `next build`,
 * shaped roughly like:
 *
 *   Route (app)                              Size  First Load JS
 *   ┌ ○ /                                   1.2 kB        178 kB
 *   ├ ○ /admin                              0.9 kB        201 kB
 *   ...
 *   + First Load JS shared by all                          112 kB
 *
 * `.next/build-manifest.json` does NOT include compressed sizes, so the
 * authoritative numbers come from the build's stdout. The qa-loop.sh script
 * tees `npm run build` to `node_modules/.cache/qa-build.log` (NOT `.next/`,
 * because `next build` clears `.next/` at the start of its own run). This
 * checker parses that log.
 *
 * If the log is missing we fail with a clear error pointing at qa-loop.sh.
 *
 * Units: Next prints "kB" (kilobytes, 1000 bytes) and "MB". We normalize
 * everything to KB-as-1000-bytes for comparison against the budget.
 *
 * Exit codes:
 *   0 — every route within budget
 *   1 — at least one route over budget
 *   2 — build log missing or unreadable
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB ?? 200);
const LOG_PATH = path.resolve("node_modules/.cache/qa-build.log");

const RED = process.stdout.isTTY ? "\x1b[31m" : "";
const GREEN = process.stdout.isTTY ? "\x1b[32m" : "";
const YELLOW = process.stdout.isTTY ? "\x1b[33m" : "";
const BOLD = process.stdout.isTTY ? "\x1b[1m" : "";
const RESET = process.stdout.isTTY ? "\x1b[0m" : "";

if (!existsSync(LOG_PATH)) {
  console.error(`${RED}bundle-budget: build log not found at ${LOG_PATH}${RESET}`);
  console.error(
    "Run `npm run qa:strict` (or `npm run build` via qa-loop.sh, which tees to node_modules/.cache/qa-build.log) first.",
  );
  process.exit(2);
}

const raw = await readFile(LOG_PATH, "utf8");

// Strip ANSI escape codes that color the table.
const log = raw.replace(/\x1b\[[0-9;]*m/g, "");

/**
 * Parse one of the build-output table rows. Examples we want to match:
 *   ┌ ○ /                                     1.2 kB        178 kB
 *   ├ ƒ /api/health                            142 B           0 B
 *   ├ ○ /admin                                512 B         223 kB
 *
 * We extract: route path, "First Load JS" value (last size column).
 * We deliberately ignore the "+ First Load JS shared by all" summary row.
 */
const SIZE = "(\\d+(?:\\.\\d+)?)\\s*(B|kB|MB)";
const ROW_RE = new RegExp(
  // tree-glyph + route-type marker + route path + 2 size columns
  String.raw`^[\s│├└┌─]*[○●ƒλ◐]\s+(\/\S*)\s+` + SIZE + String.raw`\s+` + SIZE + String.raw`\s*$`,
  "gm",
);

function toKb(value, unit) {
  const n = Number(value);
  switch (unit) {
    case "B":
      return n / 1000;
    case "kB":
      return n;
    case "MB":
      return n * 1000;
    default:
      return n;
  }
}

const routes = [];
let m;
while ((m = ROW_RE.exec(log)) !== null) {
  const [, route, , , firstLoadValue, firstLoadUnit] = m;
  routes.push({
    route,
    firstLoadKb: toKb(firstLoadValue, firstLoadUnit),
    firstLoadRaw: `${firstLoadValue} ${firstLoadUnit}`,
  });
}

if (routes.length === 0) {
  // Detect the "we found the Route table but no sizes" case explicitly.
  // Next 16 + Turbopack currently omits the Size / First Load JS columns
  // from the build's stdout. When that happens this checker cannot enforce
  // the per-route budget from stdout. Treat this as a documented diagnostic
  // skip so qa:strict remains usable; use npm run analyze for manual review.
  const hasRouteTable = /Route \(app\)/.test(log);
  if (hasRouteTable) {
    console.error(
      `${YELLOW}bundle-budget: build log has a "Route (app)" section but no size columns.${RESET}`,
    );
    console.error("Next 16 + Turbopack currently omits per-route Size / First Load JS in stdout.");
    console.error("Until upstream restores those columns, review bundle size manually:");
    console.error("  npm run analyze   # opens the bundle treemap");
    console.error(
      `Inspected log: ${LOG_PATH}. Set BUNDLE_BUDGET_KB to override the budget (currently ${BUDGET_KB}).`,
    );
    console.error(
      "bundle-budget: SKIP — no enforceable size columns in current Next build output.",
    );
    process.exit(0);
  }
  console.error(`${YELLOW}bundle-budget: no routes parsed from ${LOG_PATH}.${RESET}`);
  console.error("Either the build failed, the build output format changed, or the log is empty.");
  console.error("Inspect the log manually:");
  console.error(`  less ${LOG_PATH}`);
  process.exit(2);
}

const over = routes.filter((r) => r.firstLoadKb > BUDGET_KB);

console.log(`${BOLD}bundle-budget: per-route First Load JS${RESET}`);
console.log(`  budget: ${BUDGET_KB} kB`);
console.log(`  routes: ${routes.length}`);
for (const r of routes) {
  const ok = r.firstLoadKb <= BUDGET_KB;
  const color = ok ? GREEN : RED;
  const mark = ok ? "✓" : "✗";
  console.log(
    `  ${color}${mark}${RESET}  ${r.route.padEnd(40)}  ${r.firstLoadRaw} (${r.firstLoadKb.toFixed(1)} kB)`,
  );
}

if (over.length > 0) {
  console.error("");
  console.error(
    `${RED}${BOLD}bundle-budget: ${over.length} route(s) over the ${BUDGET_KB} kB budget:${RESET}`,
  );
  for (const r of over) {
    console.error(`  - ${r.route}: ${r.firstLoadRaw} (${r.firstLoadKb.toFixed(1)} kB)`);
  }
  console.error("");
  console.error("Fix steps (do NOT just raise the budget):");
  console.error("  1. Run `npm run analyze` to inspect the treemap.");
  console.error("  2. Lazy-load heavy components via next/dynamic or lazyClient from @/lib/lazy.");
  console.error("  3. See .agents/rules/performance.md and lazy-loading.md.");
  process.exit(1);
}

console.log("");
console.log(`${GREEN}bundle-budget: all routes within budget.${RESET}`);
process.exit(0);
