# GEMINI.md

**READ `AGENTS.md` FIRST.** Compressed rules below. The **"Mandatory reading — task-type index"** in `AGENTS.md` tells you which `.agents/rules/*.md` files to load for your task — consult it BEFORE writing code.

## NEVER / ALWAYS

| ❌ NEVER                      | ✅ ALWAYS                                            |
| ----------------------------- | ---------------------------------------------------- |
| `any`                         | `unknown` or real type                               |
| `console.log`                 | `logger` from `@/lib/logger/logger`                  |
| inline hex/rgb                | design token classes                                 |
| `../../*` imports             | `@/*` alias                                          |
| `.select('*')`                | explicit columns                                     |
| service role in client        | `server-admin.ts` + `import "server-only"`           |
| raw `posthog.capture`         | `track()` / `trackServer()`                          |
| raw `process.env`             | `env` from `@/env`                                   |
| template-string classes       | `cn(...)`                                            |
| MUI / Emotion / Pigment       | Tailwind + shadcn                                    |
| `'use client'` on layout/page | push boundary DOWN; Server Components by default     |
| eager heavy lib imports       | `next/dynamic` / `lazyClient` from `@/lib/lazy`      |
| `await` non-critical pre-nav  | `void` + `startTransition` / `useTransitionRouter()` |
| skip `npm run qa`             | run it until exit 0 before declaring done            |

## Stack (locked)

next 16.2.6 · react 19.2.6 · TS 5.6+ strict · Tailwind v4 · shadcn/ui · @supabase/ssr · @t3-oss/env-nextjs · PostHog · Resend · vitest · playwright · eslint 9 flat

## Web Vitals targets

LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1 · per-route First Load JS ≤ 200KB

## Before finishing

Run the QA loop until it exits 0. That's the definition of done. See AGENTS.md → "The QA-in-loop iron rule".

```
npm run qa            # iterate until exit 0
npm run qa:strict     # before PR / release (adds e2e + bundle budget)
```

## Conventions

- Plans in `.plans/` (archived in `.plans/archived/`). Docs in `.docs/`. Push via `npm run push` (pre-push hook blocks raw `git push`).
- Bundle-analyzer wired: `npm run analyze` opens the treemap.
