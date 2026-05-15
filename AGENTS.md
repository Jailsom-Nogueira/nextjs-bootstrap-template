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
- next-intl v4 (pt-br, es, en-us; default en; localePrefix as-needed)
- next-themes (light/dark/system)
- posthog (client + server, reverse-proxied via `/ingest`)
- resend + react-email
- vitest + @testing-library + playwright
- eslint 9 flat + prettier + husky + commitlint
- auth gating: middleware + layout role check via `profiles.role`
- changelog: Carevia-style `npm run push` (no changesets)
</stack>

## Mandatory pre-flight checklist

| NEVER                                                                    | ALWAYS                                                                                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| use `any` (use `unknown` or a real type)                                 | type everything; prefer inference where readable                                                    |
| `console.log` (warn/error OK)                                            | use `logger` from `@/lib/logger/logger`                                                             |
| inline hex/rgb in JSX                                                    | use design tokens (`bg-background`, `text-foreground`, etc.)                                        |
| `../../*` imports                                                        | use `@/*` path alias                                                                                |
| `.select('*')`                                                           | list columns explicitly                                                                             |
| expose `SUPABASE_SERVICE_ROLE_KEY` to client                             | gate behind `import "server-only"` in `server-admin.ts`                                             |
| call `posthog.capture()` directly                                        | use `track()` / `trackServer()` wrappers                                                            |
| read `process.env.*` outside `src/env.ts`                                | import `env` from `@/env`                                                                           |
| `className={\`a ${b}\`}`                                                 | `cn("a", b)`                                                                                        |
| keep exported types inline                                               | extract to `types.ts`                                                                               |
| add a new external script silently                                       | update CSP in `next.config.ts` and document it                                                      |
| install MUI / Emotion / Pigment / styled-components                      | stick to Tailwind + shadcn                                                                          |
| ship UI that breaks at <360px width                                      | design mobile-first; test breakpoints sm/md/lg/xl; use container queries when sibling-aware         |
| ship interactive elements with <44x44px touch targets                    | meet WCAG 2.2 AA touch target (44px min, 48px preferred)                                            |
| ship without keyboard navigation + visible focus rings                   | every interactive element keyboard-reachable; tab order logical; `focus-visible:ring-2`             |
| ship images without alt text                                             | meaningful alt (or `alt=""` for decorative) + width/height props                                    |
| use color alone to convey state                                          | pair color with icon + text                                                                         |
| hardcode user-facing strings                                             | i18n keys via `useTranslations()` / `getTranslations()`; messages in `messages/{en,pt,es}.json`     |
| write plans/specs at repo root or arbitrary locations                    | active plans in `.plans/`; archived plans in `.plans/archived/`; technical/product docs in `.docs/` |
| skip the changelog flow                                                  | use `npm run push` to generate CHANGELOG + push (pre-push hook blocks direct push)                  |
| leave functions >50 lines or files mixing 3+ unrelated concerns          | small composable units; single responsibility; pure functions where possible                        |
| leave commented-out code, `console.log`s, TODO without ticket            | clean code on every commit; reference the issue/ticket for any TODO                                 |
| implement an admin route without role gate at BOTH middleware AND layout | defense in depth — middleware redirects + server component double-check via `isAdmin()`             |

## Domain rules

Load the file relevant to your task:

- `.agents/rules/styling.md` — Tailwind v4, design tokens, `cn()`, dark mode
- `.agents/rules/file-organization.md` — naming, layout, paths
- `.agents/rules/forms.md` — react-hook-form + zod pattern
- `.agents/rules/security.md` — 4-layer defense, env, RLS, CSP
- `.agents/rules/i18n.md` — next-intl v4 setup (en/pt/es)
- `.agents/rules/error-handling.md` — logger, error boundaries
- `.agents/rules/supabase.md` — 4-client split, RLS, types
- `.agents/rules/analytics.md` — wrappers, event names, scrubbing
- `.agents/rules/responsiveness.md` — mobile-first, breakpoints, container queries
- `.agents/rules/accessibility.md` — WCAG 2.2 AA, focus, contrast, motion
- `.agents/rules/clean-code.md` — function size, naming, immutability, comments
- `.agents/rules/admin.md` — admin route gate, role model, service-role rules

## Documentation locations

- `.plans/` — active project plans. One markdown file per plan; name format `YYYY-MM-DD-slug.md`.
- `.plans/archived/` — completed or superseded plans. **Move** files here, never delete.
- `.docs/` — technical and product documentation. Subfolders: `architecture/`, `runbooks/`, `decisions/` (ADRs), `product/`.
- `CHANGELOG.md` — auto-generated by `npm run push`. **Do NOT edit manually.**

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

Commit format: Conventional Commits. Pushing is done via `npm run push` (Carevia-style) which auto-generates the changelog and runs the pre-push gate.
