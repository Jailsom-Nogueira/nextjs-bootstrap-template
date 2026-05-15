# GEMINI.md

**READ `AGENTS.md` FIRST.** Compressed rules below.

## NEVER / ALWAYS

| ❌ NEVER                | ✅ ALWAYS                                  |
| ----------------------- | ------------------------------------------ |
| `any`                   | `unknown` or real type                     |
| `console.log`           | `logger` from `@/lib/logger/logger`        |
| inline hex/rgb          | design token classes                       |
| `../../*` imports       | `@/*` alias                                |
| `.select('*')`          | explicit columns                           |
| service role in client  | `server-admin.ts` + `import "server-only"` |
| raw `posthog.capture`   | `track()` / `trackServer()`                |
| raw `process.env`       | `env` from `@/env`                         |
| template-string classes | `cn(...)`                                  |
| MUI / Emotion / Pigment | Tailwind + shadcn                          |
| skip `npm run check`    | run it before declaring done               |

## Stack (locked)

next 16.2.6 · react 19.2.6 · TS 5.6+ strict · Tailwind v4 · shadcn/ui · @supabase/ssr · @t3-oss/env-nextjs · PostHog · Resend · vitest · playwright · eslint 9 flat

## Before finishing

```
npm run check && npm run test
```

## Conventions

- Plans in `.plans/` (archived in `.plans/archived/`). Docs in `.docs/`. Push via `npm run push` (pre-push hook blocks raw `git push`).
