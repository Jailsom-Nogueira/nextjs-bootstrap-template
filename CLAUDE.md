# CLAUDE.md

**READ `AGENTS.md` FIRST.** All canonical rules live there. This file only adds Claude-Code-specific notes.

## Claude Code tips

- Use the `Read` tool on `AGENTS.md`. Then consult the **"Mandatory reading — task-type index"** section to identify which `.agents/rules/*.md` files to load for the task at hand. Do not load all rules eagerly, but DO load every rule the index lists for your task type.
- Prefer `Edit` over `Write` for targeted changes — preserves history cleaner.
- After editing, run `npm run qa` via `Bash` and iterate until it exits 0. Before declaring any task complete, `npm run qa` MUST exit 0. See AGENTS.md → "The QA-in-loop iron rule" and `.agents/rules/qa-loop.md`.
- Conventional Commits are enforced by commitlint. Bad subjects will fail the `commit-msg` hook.

## Tool usage

- For multi-file refactors, use `Grep` first to find call sites, then batch edits.
- For new components, check `.agents/references/shared-components.md` before reinventing shadcn primitives.
- For new env vars, edit BOTH `src/env.ts` and `.env.example`. The CI will silently pass even if `.env.example` lags; you have to remember.

## Slash command suggestions (project-local)

None defined yet. If you find yourself repeating a workflow more than 3 times, add it under `.claude/commands/`.

## Common gotchas

- Next 16 made Turbopack the default — do NOT pass `--turbopack` flags; they're already implicit.
- The `middleware.ts` convention is being renamed to `proxy.ts` in Next 16+. We're staying on `middleware.ts` until shadcn/Supabase docs migrate.
- Tailwind v4 uses `@theme` in CSS, NOT a `tailwind.config.ts`. Don't create one.
- Plans go in `.plans/` (archived ones in `.plans/archived/`); docs go in `.docs/`. Push with `npm run push` (the pre-push hook blocks raw `git push`).
- Heavy components belong in `src/components/lazy/` and are loaded via `lazyClient()` from `@/lib/lazy`. See `.agents/rules/lazy-loading.md` and `.agents/rules/performance.md`.
