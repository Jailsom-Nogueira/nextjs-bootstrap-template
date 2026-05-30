# Documentation Drift Guard — adopted from Carevia (2026-05-30)

## What this is

A summary of doc/retrieval-integrity improvements developed in the downstream
**Carevia** repo on 2026-05-30 and the subset that was replicated upstream into
this template. Only the **generic, repo-resident** improvements are adopted here;
Carevia-specific content (its product overview, GitNexus code-graph, QMD index)
is intentionally left out.

## Context: what happened in Carevia

A full audit of Carevia's agent docs found **documentation drift** — docs that
referenced files/values which no longer matched the code:

- A removed feature-flag provider (LaunchDarkly → PostHog) was still documented,
  pointing at two deleted source files. The removal commit claimed it fixed the
  docs but missed `.agents/**` entirely.
- Reference docs pointed at moved/renamed paths (`design-system/` →
  `admin/design-system/`, `supabase/server.ts` → `src/supabase/server.ts`, a
  deleted `name-validation.ts`).
- `PRODUCT_OVERVIEW.md` / `README.md` carried stale facts (Next.js 15 vs 16,
  "17 notification types" vs 31) and an undocumented shipped feature.

Root cause: nothing **mechanically** verified that doc references stayed true, and
the doc-trigger checklist pointed authors at the wrong owner files. Because these
docs are also indexed for semantic retrieval, a stale/dead reference becomes a
silently-served falsehood to every future agent.

## What was replicated here (generic + repo-resident)

1. **`scripts/check-doc-references.mjs`** — a deterministic guard that fails the
   build if any core doc (`AGENTS.md`, `README.md`, `CONCEPTS.md`, `CLAUDE.md`,
   `GEMINI.md`, `CONTRIBUTING.md`, `CONVENTIONS.md`, `SECURITY.md`, `AUTHORS.md`,
   `.agents/**`) references a **concrete repo file that no longer exists**.
   - Tuned for a seed template: only verifies refs that look like real files
     (known source extension). Directory conventions (`src/lib/admin/`,
     `public/`), placeholders (`<topic>.md`, `.plans/...`), globs, command spans,
     and fenced code blocks are skipped so aspirational/structural guidance does
     not false-positive.
2. **Gate wiring** — added as `check:doc-refs`, run inside `npm run check`
   (→ `ci-check`) and as a dedicated gate in `scripts/qa-loop.sh` (→ `npm run qa`).
   It travels with the repo, so it runs on every machine/agent that runs the gate
   — no per-machine cron or hook required.
3. **Self-review protocol** — `.agents/workflows/self-review.md` now instructs:
   on delete/rename, grep the docs for the old path; the guard enforces concrete
   file paths but **semantic drift** (versions, counts, renamed concepts) stays
   the author's responsibility.

## What was NOT replicated (and why)

- **GitNexus freshness hook** — this template has no GitNexus index or usage;
  imposing it would add tooling the seed repo does not need.
- **QMD index / collections** — QMD is a local, per-machine personal retrieval
  layer, not a repo artifact. Index config belongs to the developer's machine,
  not the template.
- **Carevia content fixes** (PRODUCT_OVERVIEW, NFS-e, provider specifics) — those
  are product-specific and do not belong in a generic bootstrap template.

## Drift fixed here while adopting the guard

- `.agents/rules/clean-code.md`: `supabase/server.ts` → `src/supabase/server.ts`
  (the only real dead-file reference the guard caught in this repo).

## How to use

```bash
npm run check:doc-refs   # standalone
npm run check            # includes doc-refs + lint + typecheck + format
npm run qa               # full gate (doc-refs runs as an early gate)
```

When the guard fails it prints each `file:line` with the dead reference. Fix the
doc (update or remove the reference) — do not weaken the guard to pass.
