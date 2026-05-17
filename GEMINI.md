# GEMINI.md

**READ `AGENTS.md` FIRST.** This is a compressed reminder only. The AGENTS task-classification protocol tells you how to infer task type from evidence and which `.agents/rules/*.md` files to load before writing code.

## NEVER / ALWAYS

| NEVER                                    | ALWAYS                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `any`                                    | `unknown` or real type                                                   |
| `console.log`                            | `logger` from `@/lib/logger/logger`                                      |
| inline hex/rgb                           | design token classes                                                     |
| `../../*` imports                        | `@/*` alias                                                              |
| `.select('*')`                           | explicit columns                                                         |
| service role in client                   | `server-admin.ts` + `import "server-only"`                               |
| raw `posthog.capture`                    | `track()` / `trackServer()`                                              |
| raw `process.env`                        | `env` from `@/env`                                                       |
| template-string classes                  | `cn(...)`                                                                |
| MUI / Emotion / Pigment                  | Tailwind + shadcn                                                        |
| `'use client'` on layout/page            | push boundary down; Server Components by default                         |
| eager heavy lib imports                  | `next/dynamic` / `lazyClient` from `@/lib/lazy`                          |
| `await` non-critical pre-nav             | `void` + `startTransition` / `useTransitionRouter()`                     |
| skip `npm run qa`                        | run it until exit 0 before declaring done                                |
| deliver local HTML only as terminal link | browser-verify it or serve via localhost and provide verified URL + path |

## Stack (locked)

next 16.2.6 · react 19.2.6 · TS 5.6+ strict · Tailwind v4 · shadcn/ui · @supabase/ssr · @t3-oss/env-nextjs · PostHog · Resend · vitest · playwright · eslint 9 flat

## Before finishing

```bash
npm run qa            # required for every task
npm run qa:visual     # required for UI/browser-facing work
npm run qa:strict     # before PR / release (e2e + bundle-budget + qa:visual)
```

## Artifacts

Plans live in `.plans/`; archived plans in `.plans/archived/`; docs in `.docs/`. For docs/specs/plans/artifacts, read `.agents/references/artifact-layers.md` first. Do not require the prompt to name the artifact type.

Prompt context: run `npm run prompt:context` to print a paste-ready snapshot.
