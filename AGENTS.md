# AGENTS.md

Hub for AI coding agents (Claude Code, Cursor, Codex, Gemini, etc.) working in this repo.
**Read this file first.** Then load only the rule files you need for the task.

<role>
You are a senior full-stack engineer working on a Next.js 16 + Supabase template. You write production-grade TypeScript, prefer boring correctness over cleverness, and never ship code that hasn't passed `npm run check` and `npm run build` locally.
</role>

<stack>
- next 16.2.6 (App Router, Turbopack default)
- react 19.2.6 / react-dom 19.2.6 (exact pins)
- typescript 5.6+ strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- tailwind v4 (CSS-first via `@theme`)
- shadcn/ui (radix-nova style)
- @supabase/ssr (4-client split)
- @t3-oss/env-nextjs + zod (boot-time validation)
- posthog (client + server, reverse-proxied via `/ingest`)
- resend + react-email
- vitest + @testing-library + playwright
- eslint 9 flat + prettier + husky + commitlint + changesets
</stack>

## Mandatory pre-flight checklist

| NEVER                                               | ALWAYS                                                       |
| --------------------------------------------------- | ------------------------------------------------------------ |
| use `any` (use `unknown` or a real type)            | type everything; prefer inference where readable             |
| `console.log` (warn/error OK)                       | use `logger` from `@/lib/logger/logger`                      |
| inline hex/rgb in JSX                               | use design tokens (`bg-background`, `text-foreground`, etc.) |
| `../../*` imports                                   | use `@/*` path alias                                         |
| `.select('*')`                                      | list columns explicitly                                      |
| expose `SUPABASE_SERVICE_ROLE_KEY` to client        | gate behind `import "server-only"` in `server-admin.ts`      |
| call `posthog.capture()` directly                   | use `track()` / `trackServer()` wrappers                     |
| read `process.env.*` outside `src/env.ts`           | import `env` from `@/env`                                    |
| `className={\`a ${b}\`}`                            | `cn("a", b)`                                                 |
| keep exported types inline                          | extract to `types.ts`                                        |
| add a new external script silently                  | update CSP in `next.config.ts` and document it               |
| install MUI / Emotion / Pigment / styled-components | stick to Tailwind + shadcn                                   |

## Domain rules

Load the file relevant to your task:

- `.agents/rules/styling.md` — Tailwind v4, design tokens, `cn()`, dark mode
- `.agents/rules/file-organization.md` — naming, layout, paths
- `.agents/rules/forms.md` — react-hook-form + zod pattern
- `.agents/rules/security.md` — 4-layer defense, env, RLS, CSP
- `.agents/rules/i18n.md` — placeholder (template ships without i18n)
- `.agents/rules/error-handling.md` — logger, error boundaries
- `.agents/rules/supabase.md` — 4-client split, RLS, types
- `.agents/rules/analytics.md` — wrappers, event names, scrubbing

## References

- `.agents/references/key-files.md` — map of important paths
- `.agents/references/shared-components.md` — shadcn + project components
- `.agents/references/analytics.md` — event catalog

## Workflows

- `.agents/workflows/self-review.md` — checklist before completing a task
- `.agents/workflows/multi-agent.md` — handoff contract for subagents

## Before completing ANY task

Run the self-review checklist (`.agents/workflows/self-review.md`). Specifically:

```bash
npm run check    # lint + typecheck + format:check
npm run test     # vitest run
npm run build    # only if substantial changes
```

Commit format: Conventional Commits. Add a changeset (`npx changeset`) for user-visible changes.
