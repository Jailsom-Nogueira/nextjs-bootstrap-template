# `scripts/` — project-level scripts

The `scripts/` directory owns every project-level shell, Node, and TypeScript script the repo runs. The most important set is the **QA-in-loop gate set**: every gate that `npm run qa` enforces locally and in CI lives here.

Read `.agents/rules/qa-loop.md` and `.agents/workflows/qa-loop.md` before editing any QA-related script — those files own the contract.

## Files

### QA gates (run by `scripts/qa-loop.sh`)

| File                      | Wired via                    | Purpose                                                                                                |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `qa-loop.sh`              | `npm run qa`                 | The fix-until-green orchestrator. Runs every gate in cheapest-first order; stops at first failure.     |
| `check-text-hygiene.mjs`  | `npm run check:text-hygiene` | Fail on decorative emoji / symbols in tracked text. Pairs with `.agents/rules/qa-loop.md`.             |
| `check-plan-format.mjs`   | `npm run check:plan-format`  | Fail if implementation plans are Markdown or lack the standalone HTML/CSS plan markers.                |
| `check-mcp-sync.mjs`      | `npm run check:mcp-sync`     | Fail if `.mcp.json` and `.cursor/mcp.json` drift. See `.agents/references/repo-structure.md` (rule 3). |
| `check-bundle-budget.mjs` | strict mode only             | Parse the build log and fail if any route's First Load JS exceeds `BUNDLE_BUDGET_KB` (default 200).    |
| `qa-visual-runner.sh`     | `npm run qa:visual`          | Boot `next dev`, wait for `/api/health`, run `visual-qa.ts`, tear the dev server down on exit.         |
| `visual-qa.ts`            | invoked by runner            | Per route × locale × theme × viewport: screenshot, console scan, axe-core WCAG 2.2 AA.                 |

### Developer / agent ergonomics

| File                    | Wired via                | Purpose                                                                                                          |
| ----------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `test-agent.sh`         | `npm run test:agent`     | Fast inner-loop test runner. Vitest `--changed origin/main` (or `HEAD~1`), dot reporter, no coverage.            |
| `prompt-context.ts`     | `npm run prompt:context` | Paste-ready project snapshot (AGENTS.md verbatim, stack, tree, zod schemas, server actions) for chat-UI agents.  |
| `generate-changelog.ts` | `npm run push`           | Pre-push CHANGELOG generator. Reads commits since `upstream..HEAD`, bumps patch version, prepends a dated block. |

### Bootstrap and environment

| File                | Wired via                           | Purpose                                                                                              |
| ------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `check-env.ts`      | manual (`tsx scripts/check-env.ts`) | Trigger `src/env.ts` zod validation outside of `next build`. Useful in deploy pipelines.             |
| `generate-types.sh` | `npm run db:types`                  | Run `supabase gen types` against `SUPABASE_PROJECT_REF` to refresh `src/supabase/database.types.ts`. |

## Conventions

- **Every QA gate must run locally and in CI from the same script.** `ci.yml` calls `npm run qa`; the gate set is whatever `scripts/qa-loop.sh` runs. Do not add a CI-only check that local cannot reproduce.
- **Fail fast, fail loud.** Each gate exits non-zero with a clear, parseable error block. Anti-pattern: gates that warn-only and let bad code through.
- **Bash scripts use `set -euo pipefail`** when they can. The agent fast lane (`test-agent.sh`) intentionally uses `set -uo pipefail` only, so vitest's failure-with-no-tests-matching does not abort.
- **Node scripts target Node 22+** (per `.nvmrc` and `engines.node`). ESM modules use `.mjs`; TypeScript scripts use `tsx`.
- **Output goes to stdout / stderr, not files**, except `qa-loop.sh` which tees the build to `node_modules/.cache/qa-build.log` so `check-bundle-budget.mjs` can parse it.

## How to add a new QA gate

1. Decide whether the gate runs always (cheap, fast) or only in strict mode (slow, expensive). Cheap gates go before lint; expensive ones go in the strict block.
2. Write `scripts/check-<name>.mjs` (or `.ts` via tsx, or `.sh`). Print a clear failure block on non-zero exit.
3. Add an `npm run check:<name>` script in `package.json`.
4. Wire it into `scripts/qa-loop.sh` with `run_gate "<name>" "npm run check:<name>" npm run check:<name>`.
5. Renumber the gate comments above and below if you inserted in the middle.
6. Run `npm run qa` locally to verify the new gate fires.
7. Update `.agents/rules/qa-loop.md` if the gate has anti-patterns worth documenting.

## How to add a sync gate (for obligatory duplication)

When two files must stay byte-identical because tools require different filenames, follow rule 3 of `.agents/references/repo-structure.md`:

1. `scripts/check-<name>-sync.mjs` — read both files, exit 0 on match, exit 1 with a line-by-line diff on mismatch.
2. `npm run check:<name>-sync` in `package.json`.
3. `run_gate` entry in `scripts/qa-loop.sh` after the cheap checks.

See `check-mcp-sync.mjs` for the reference implementation.

## References

- `.agents/rules/qa-loop.md` — the iron rule, anti-patterns, escalation path.
- `.agents/workflows/qa-loop.md` — the runbook (gate order, iteration cap, summary table).
- `.agents/references/repo-structure.md` — when to add a sync gate.
- `.github/workflows/ci.yml` — calls `npm run qa` so local and CI match.
