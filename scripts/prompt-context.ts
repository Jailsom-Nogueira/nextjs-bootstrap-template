#!/usr/bin/env -S npx tsx
/**
 * Print a paste-ready project snapshot for chat-UI agents (ChatGPT, Claude web, etc.).
 * Run with `npm run prompt:context`. Output goes to stdout — pipe or copy as needed.
 * Cap: ≤ 2000 lines. Uses only Node stdlib + tsx.
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, basename } from "node:path";

const repoRoot = resolve(process.cwd());
const MAX_LINES = 2000;
const lines: string[] = [];

function out(line = ""): void {
  if (lines.length < MAX_LINES) lines.push(line);
}

function safeExec(cmd: string): string {
  try {
    return execSync(cmd, { cwd: repoRoot, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

function safeRead(path: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

// ─── 1. Header ────────────────────────────────────────────────────────────────
type PackageJson = {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
const pkgRaw = safeRead(join(repoRoot, "package.json"));
const pkg: PackageJson = pkgRaw ? (JSON.parse(pkgRaw) as PackageJson) : {};
const sha = safeExec("git rev-parse --short HEAD") || "(no git)";
const branch = safeExec("git rev-parse --abbrev-ref HEAD") || "(no git)";

out("===== PROJECT SNAPSHOT =====");
out(`repo: ${pkg.name ?? basename(repoRoot)}`);
out(`version: ${pkg.version ?? "0.0.0"}`);
out(`branch: ${branch}`);
out(`commit: ${sha}`);
out(`generated: ${new Date().toISOString()}`);
out("");

// ─── 2. Stack summary ─────────────────────────────────────────────────────────
out("===== STACK =====");
const keyDeps = [
  "next",
  "react",
  "react-dom",
  "typescript",
  "@supabase/ssr",
  "@supabase/supabase-js",
  "tailwindcss",
  "zod",
  "next-intl",
  "next-themes",
  "posthog-js",
  "posthog-node",
  "resend",
  "vitest",
  "playwright",
];
const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
for (const d of keyDeps) {
  if (deps[d]) out(`${d}: ${deps[d]}`);
}
out("");
out("scripts:");
for (const [name, body] of Object.entries(pkg.scripts ?? {})) {
  out(`  ${name}: ${body}`);
}
out("");

// ─── 3. Directory tree (depth 3) ──────────────────────────────────────────────
out("===== TREE (depth 3) =====");
const ignored = new Set([
  ".next",
  "node_modules",
  ".git",
  "coverage",
  ".agent-cache",
  "playwright-report",
  "test-results",
  "dist",
  "build",
  "out",
  ".turbo",
]);

function walk(dir: string, depth: number, prefix: string): void {
  if (depth > 3) return;
  if (lines.length >= MAX_LINES) return;
  let entries: string[];
  try {
    entries = readdirSync(dir).sort();
  } catch {
    return;
  }
  for (const name of entries) {
    if (lines.length >= MAX_LINES) return;
    if (ignored.has(name) || name.startsWith(".DS_Store")) continue;
    // Exclude archived plans for noise reduction
    if (relative(repoRoot, join(dir, name)) === ".plans/archived") continue;
    const full = join(dir, name);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    const isDir = s.isDirectory();
    out(`${prefix}${isDir ? "[dir] " : "[file] "}${name}`);
    if (isDir) walk(full, depth + 1, prefix + "  ");
  }
}
walk(repoRoot, 1, "");
out("");

// ─── 4. AGENTS.md verbatim ────────────────────────────────────────────────────
out("===== AGENTS.md =====");
const agentsMd = safeRead(join(repoRoot, "AGENTS.md"));
if (agentsMd) {
  for (const ln of agentsMd.split("\n")) out(ln);
} else {
  out("(missing)");
}
out("");

// ─── 5. Rules / refs / workflows index ────────────────────────────────────────
out("===== .agents/ INDEX =====");
function listDirWithFirstLine(dir: string, label: string): void {
  out(`-- ${label} (${dir}) --`);
  const full = join(repoRoot, dir);
  if (!existsSync(full)) {
    out("(missing)");
    return;
  }
  for (const name of readdirSync(full).sort()) {
    const filePath = join(full, name);
    if (!statSync(filePath).isFile()) continue;
    const first =
      safeRead(filePath)
        .split("\n")
        .find((l) => l.trim().length > 0) ?? "";
    out(`${name} — ${first.replace(/^#+\s*/, "").slice(0, 100)}`);
  }
  out("");
}
listDirWithFirstLine(".agents/rules", "rules");
listDirWithFirstLine(".agents/references", "references");
listDirWithFirstLine(".agents/workflows", "workflows");

// ─── 6. Zod schemas ───────────────────────────────────────────────────────────
out("===== ZOD SCHEMAS =====");
const schemaGrep = safeExec(
  "git ls-files 'src/**/*.ts' 'src/**/*.tsx' | xargs grep -nE 'export const [A-Za-z0-9_]+Schema' 2>/dev/null || true",
);
if (schemaGrep) {
  for (const ln of schemaGrep.split("\n").slice(0, 100)) out(ln);
} else {
  out("(none found)");
}
out("");

// ─── 7. Server actions ────────────────────────────────────────────────────────
out("===== SERVER ACTIONS =====");
const useServerFiles = safeExec(
  "git ls-files 'src/**/*.ts' 'src/**/*.tsx' | xargs grep -lE \"^['\\\"]use server['\\\"]\" 2>/dev/null || true",
);
if (useServerFiles) {
  for (const file of useServerFiles.split("\n").filter(Boolean)) {
    out(`# ${file}`);
    const named = safeExec(
      `grep -nE 'export (async )?function [A-Za-z0-9_]+|export const [A-Za-z0-9_]+ = (async )?\\(' ${file} 2>/dev/null || true`,
    );
    for (const ln of named.split("\n").slice(0, 20)) if (ln) out(`  ${ln}`);
  }
} else {
  out("(none found)");
}
out("");

// ─── 8. Migrations ────────────────────────────────────────────────────────────
out("===== SUPABASE MIGRATIONS =====");
const migDir = join(repoRoot, "supabase/migrations");
if (existsSync(migDir)) {
  for (const name of readdirSync(migDir).sort()) out(name);
} else {
  out("(none)");
}
out("");

// ─── 9. Changelog tail ────────────────────────────────────────────────────────
out("===== CHANGELOG (last 30 lines) =====");
const cl = safeRead(join(repoRoot, "CHANGELOG.md"));
if (cl) {
  for (const ln of cl.split("\n").slice(-30)) out(ln);
} else {
  out("(empty)");
}
out("");

// ─── 10. Footer ───────────────────────────────────────────────────────────────
out("===== HOW TO USE =====");
out("Paste this into your chat UI. Then paste the file contents you want to discuss.");
out("Generated by `npm run prompt:context`.");

// Emit
console.log(lines.join("\n"));
