#!/usr/bin/env node
// check-doc-references.mjs
// Guards against documentation drift: every repo path referenced in the core
// docs must still exist. Catches the dangerous, deterministic drift class —
// a file is deleted/renamed but a doc still points at the old path, which then
// silently misleads agents and downstream retrieval.
//
// Scope: backtick-wrapped `path` refs and markdown [..](path) links that point
// at in-repo locations (src/, docs/, scripts/, supabase/, workers/, .agents/,
// .plans/, e2e/, public/). External URLs, anchors, and prose are ignored.
//
// Tolerances (so legitimate references don't false-positive):
//   - `file.ts:symbolOrLine`      -> ':...' anchor stripped before existence check
//   - directory refs (trailing slash) and extension-less refs -> treated as
//     conventions and skipped (a seed template documents dirs that may not exist yet)
//   - glob/placeholder refs containing * { } < > or ... -> skipped (not literal paths)
//   - command spans like `scripts/qa-loop.sh --strict` -> only first token checked
//   - route-group/dynamic segments like (authenticated) and [locale] are real
//     on disk, so they are checked as-is.
//
// Exit 1 with a list of dead references; exit 0 with a one-line summary.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

// Docs we treat as authoritative surfaces. Keep in sync with the doc set the repo ships.
const DOC_GLOBS = [
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "README.md",
  "CONCEPTS.md",
  "CONTRIBUTING.md",
  "CONVENTIONS.md",
  "SECURITY.md",
  "AUTHORS.md",
  ".agents/**/*.md",
];

// Path prefixes that denote an in-repo location worth verifying.
const REPO_PREFIXES = [
  "src/",
  "docs/",
  "scripts/",
  "supabase/",
  "workers/",
  ".agents/",
  ".plans/",
  "e2e/",
  "public/",
];

function trackedDocs() {
  const out = execFileSync("git", ["ls-files", "-z", ...DOC_GLOBS], {
    encoding: "utf8",
  });
  return out.split("\0").filter(Boolean);
}

function isRepoPath(p) {
  return REPO_PREFIXES.some((prefix) => p.startsWith(prefix));
}

// Pull candidate references out of a single line.
function extractRefs(line) {
  const refs = [];
  // 1) backtick-wrapped: `something`
  for (const m of line.matchAll(/`([^`]+)`/g)) refs.push(m[1].trim());
  // 2) markdown links: [text](target)
  for (const m of line.matchAll(/\]\(([^)]+)\)/g)) refs.push(m[1].trim());
  return refs;
}

// Normalize a raw ref into a checkable filesystem path, or null to skip.
function toCheckablePath(raw) {
  let ref = raw.trim();
  if (!ref) return null;

  // Strip markdown link anchors / query (#section).
  ref = ref.replace(/#.*$/, "");

  // Leading ./ is fine; drop it.
  ref = ref.replace(/^\.\//, "");

  if (!isRepoPath(ref)) return null;

  // Skip glob-ish or templated/placeholder refs — not literal paths.
  // Covers globs (* **), brace expansions ({a,b}), angle placeholders (<topic>),
  // and ellipsis placeholders (.plans/..., docs/…).
  if (/[*{}<>]/.test(ref)) return null;
  if (/\.{3}|…/.test(ref)) return null;

  // A backtick span can hold a command, not a path (e.g. `scripts/qa-loop.sh --strict`
  // or `npm run x`). Take only the first whitespace-delimited token and verify that.
  ref = ref.split(/\s+/)[0];

  // Strip a trailing ":symbol" or ":12" or ":12-34" anchor (code references).
  const colonIdx = ref.indexOf(":");
  if (colonIdx !== -1) {
    ref = ref.slice(0, colonIdx);
  }

  // Directory reference (trailing slash). In a bootstrap/seed template, directory
  // *conventions* are routinely documented for folders that don't exist yet
  // (e.g. `src/lib/admin/`, `public/`). Enforcing those would be aspirational, not
  // drift. So we only verify CONCRETE FILE references — paths with a known source
  // extension. Directory and extension-less refs are treated as conventions and skipped.
  if (ref.endsWith("/")) return null;
  const CHECKABLE_EXT =
    /\.(md|mdx|ts|tsx|js|jsx|mjs|cjs|sh|json|sql|css|scss|yml|yaml|html|toml)$/i;
  if (!CHECKABLE_EXT.test(ref)) return null;

  if (!ref) return null;
  return { path: ref, expectDir: false };
}

const docs = trackedDocs();
const failures = [];
let checked = 0;

for (const doc of docs) {
  let content;
  try {
    content = readFileSync(doc, "utf8");
  } catch {
    continue;
  }
  const lines = content.split("\n");
  let inFence = false;
  lines.forEach((line, i) => {
    // Track fenced code blocks: skip ASCII-tree / shell snippets (```...```),
    // which contain illustrative, non-literal paths (e.g. trees with comments).
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    for (const raw of extractRefs(line)) {
      const c = toCheckablePath(raw);
      if (!c) continue;
      checked += 1;
      if (!existsSync(c.path)) {
        failures.push(`${doc}:${i + 1}: dead reference \`${raw}\` → ${c.path} does not exist`);
      }
    }
  });
}

if (failures.length > 0) {
  process.stderr.write("doc-references: failed — docs point at paths that no longer exist\n");
  for (const f of failures) process.stderr.write(`- ${f}\n`);
  process.stderr.write(
    "\nFix the doc (update or remove the reference). See .agents/workflows/self-review.md (Artifacts and docs).\n",
  );
  process.exit(1);
}

process.stdout.write(
  `doc-references: ok — ${checked} in-repo reference(s) across ${docs.length} doc(s) all resolve.\n`,
);
