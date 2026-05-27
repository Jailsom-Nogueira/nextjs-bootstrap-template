# Repository structure conventions

How agent-facing directories are organized in this repo, what the contract is for each, and the meta-rules that govern future additions. AGENTS.md routes agents to this file when they create new directories, add new tool adapters, or add config that must stay in sync across tools.

## The four meta-rules

These rules govern the whole agent surface. AGENTS.md links here from "What belongs where"; CONTRIBUTING.md links here from "Quality bar".

### 1. Every agent-facing directory has a `README.md` index

If a directory contains files that an AI agent (or a new human contributor) might need to discover, it MUST contain a `README.md` that:

- States the directory's purpose in one or two sentences.
- Lists every tracked file with a one-line purpose.
- Says when the directory is loaded (always / glob-triggered / on-demand / installed).
- Includes a "How to extend" section.
- Cross-links to AGENTS.md and to any related canonical files.

Why: a contributor entering a folder cold should never need to grep, run blind, or read AGENTS.md from the top to know what is in front of them. The folder describes itself.

Exceptions: a directory holding ONE generated or self-evident file (for example `emails/welcome.tsx` alone) may skip the README until a second file is added. When in doubt, add the README — they are cheap.

**`.github/` exception:** GitHub renders any `README.md` placed inside `.github/` as the **profile/repo README on the homepage**, overriding the root `README.md`. Do not name the `.github/` index `README.md` — use `INDEX.md` (or any other name) so the root README stays canonical. The index still lists every workflow, template, and config file with its purpose; just the filename changes. Same trade-off may apply to any other directory GitHub treats specially in the future.

### 2. Canonical content lives in `.agents/`; everything else is a thin adapter

`.agents/rules/`, `.agents/references/`, `.agents/workflows/`, and `.agents/skills/` are the canonical home for project rules, lookup catalogs, repeatable procedures, and installed skills. AGENTS.md at the repo root is the routing hub that points into them.

Every per-tool config (`CLAUDE.md`, `GEMINI.md`, `.cursor/rules/*`, `.clinerules/*`, `.aider.conf.yml`, `CONVENTIONS.md`, `.codex/setup.sh`, `.claude/commands/*`) is a **thin adapter** that:

- Loads or points back to AGENTS.md.
- Auto-attaches by glob or always-on flag if the tool supports it.
- May add a one-line conflict rule ("if this disagrees with AGENTS.md, AGENTS.md wins").
- Does NOT restate canonical rule content.

When a per-tool adapter starts to grow real content, move that content into `.agents/rules/` (or `.agents/references/`, etc.) and replace the body with a pointer. The Cursor rule stubs at `.cursor/rules/10-nextjs.mdc`, `20-supabase.mdc`, `30-tests.mdc`, `40-a11y-i18n.mdc` are reference examples of the thin-adapter shape.

### 3. Obligatory duplication needs a QA gate

When a single piece of config must exist in two places because tools require different filenames (for example `.mcp.json` for Claude Code / Codex CLI and `.cursor/mcp.json` for Cursor — see https://cursor.com/docs/mcp), you do not delete one. You:

1. Pick the canonical file (root-level usually wins).
2. Copy it byte-for-byte to the required alternate location.
3. Add a CI gate that fails the build if they drift.
4. Document the canonical location in a `_comment` field (JSON) or top-of-file comment so future editors know which to edit.

The `mcp-sync` gate (`scripts/check-mcp-sync.mjs`, wired into `npm run qa`) is the reference implementation. New duplications should follow the same pattern: dedicated `scripts/check-<name>-sync.mjs`, a `npm run check:<name>-sync` script, and a `run_gate` entry in `scripts/qa-loop.sh`.

### 4. READMEs are indexes — if a listed file does not exist, fix the index

A directory README that names a file that no longer exists is worse than no README. When you delete or rename a tracked file, update the README in the same commit. Reviewers should reject PRs where the README and the directory contents disagree.

Symmetrically: do not invent a file because a README lists it. If you find the inconsistency, fix the README to match reality and surface the question to the author.

## Directory map

Agent-facing directories and their state. "agent-facing" means a tool (human or AI) needs to navigate this directory to do work.

| Directory      | Has README          | What it holds                                                             | Notes                                                                                                                                                  |
| -------------- | ------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.agents/`     | Yes                 | Canonical rules, references, workflows, skills.                           | Hub for agent guidance. See `.agents/README.md`.                                                                                                       |
| `.claude/`     | Yes                 | Claude Code slash commands.                                               | Thin adapter; project memory is `CLAUDE.md` at root.                                                                                                   |
| `.clinerules/` | Yes                 | Cline base rules.                                                         | Thin adapter; points back to AGENTS.md.                                                                                                                |
| `.codex/`      | Yes                 | Codex Cloud sandbox bootstrap.                                            | Bootstrap layer, not rules.                                                                                                                            |
| `.cursor/`     | Yes                 | Cursor MCP config + auto-attaching rule stubs.                            | Thin adapters; obligatory `mcp.json` duplication guarded by `mcp-sync` gate.                                                                           |
| `.docs/`       | Yes                 | Durable product/technical docs, specs, architecture, decisions, runbooks. | Has its own taxonomy. See `.docs/README.md`.                                                                                                           |
| `.husky/`      | Yes                 | Git hooks (commit-msg, pre-commit, pre-push) installed by Husky.          | Last-line local gate before code leaves the dev machine.                                                                                               |
| `.plans/`      | Yes                 | Active implementation plans; archived plans under `.plans/archived/`.     | One standalone HTML/CSS file per plan, slug-dated; enforced by `plan-format`.                                                                          |
| `.github/`     | Yes (as `INDEX.md`) | CI workflows, issue/PR templates, CODEOWNERS, Dependabot.                 | GitHub conventions. Index file is `INDEX.md`, NOT `README.md` — see rule 1 exception (GitHub renders `.github/README.md` as the repo homepage README). |
| `e2e/`         | Yes                 | Playwright end-to-end tests.                                              | Pair with `playwright.config.ts` at root.                                                                                                              |
| `emails/`      | Yes                 | react-email preview entry points (re-exports of canonical templates).     | Two-layer pattern documented in `emails/README.md`.                                                                                                    |
| `messages/`    | Yes                 | next-intl translation bundles (en/pt/es).                                 | Editing rule: add the same key to all three files in one commit.                                                                                       |
| `scripts/`     | Yes                 | QA loop, prompt-context, hygiene checks, changelog, bundle budget, etc.   | Owns the QA-in-loop gate set.                                                                                                                          |
| `src/`         | Yes                 | Application source: App Router, components, lib, hooks, Supabase clients. | Top-level README documents the subfolder map; deeper structure self-evident.                                                                           |
| `supabase/`    | Yes                 | Supabase CLI config, SQL migrations, seed.                                | Pair with `.agents/rules/supabase.md` for migration conventions.                                                                                       |

Tool-specific stub files at the repo root (`CLAUDE.md`, `GEMINI.md`, `CONVENTIONS.md`, `.aider.conf.yml`, `.clineignore`, `.mcp.json`, `skills-lock.json`, `.editorconfig`, `.gitattributes`, `.gitignore`, `.npmrc`, `.nvmrc`, `.prettierignore`, `commitlint.config.mjs`, `components.json`, `eslint.config.mjs`, `next.config.ts`, `package.json`, `playwright.config.ts`, `postcss.config.mjs`, `prettier.config.mjs`, `tsconfig.json`, `vercel.json`, `vitest.config.ts`, `vitest.setup.ts`) do not need READMEs; the README at the repo root indexes them in its "Root files — by purpose" section.

## How to add a new directory

When you add a tracked directory to the repo:

1. Decide if it is agent-facing. If a human or AI may need to navigate it, yes.
2. Add `README.md` with the shape described in rule 1.
3. Register the directory in this file's "Directory map" table.
4. If the directory is a per-tool adapter, also list it in AGENTS.md "Tool-specific adapters".
5. If the directory contains config that must stay in sync with another file, add a `scripts/check-<name>-sync.mjs` and wire it into the QA loop (see rule 3).

## How to add a new per-tool adapter

When a new AI coding tool needs project-scoped configuration:

1. Add the smallest possible adapter file or directory the tool requires.
2. Make it a thin pointer to AGENTS.md (see rule 2).
3. If the tool needs auto-attach by file pattern, encode the patterns in the adapter and let the body point to the canonical `.agents/rules/*` file.
4. Register the adapter in AGENTS.md "Tool-specific adapters" and in `.agents/references/repo-structure.md` (this file) "Directory map".
5. If the adapter duplicates an existing file (because the tool uses a different filename), add a sync gate per rule 3.

## Anti-patterns

- A directory with 5+ tracked files and no README. Reviewers should ask for one.
- A per-tool adapter that grows past 30 lines of rule content. Move that content into `.agents/rules/`.
- Two files that "happen to" hold the same JSON / YAML / TOML and rely on humans to keep them in sync. Add a `check:*-sync` gate.
- A README that drifts from the directory contents. Fix the README in the same commit as the rename/delete.
- A new rule pasted into AGENTS.md instead of the appropriate `.agents/rules/<topic>.md`. AGENTS.md is a router, not a rules dump.
