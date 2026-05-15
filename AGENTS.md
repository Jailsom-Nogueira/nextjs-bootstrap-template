# AGENTS.md

Hub for AI coding agents (Claude Code, Cursor, Codex, Gemini, Hermes, etc.) working in this repo.
**Read this file first.** Then load EVERY rule listed under your task type below.

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

## Mandatory reading — task-type index

BEFORE doing any task, identify its type and load EVERY listed rule file. "I already know this" is not an excuse — the project-specific rules override your priors.

| Task type                        | Rules to load (in order)                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| UI / styling / components        | styling.md → responsiveness.md → accessibility.md → clean-code.md → performance.md → lazy-loading.md     |
| Forms / inputs                   | forms.md → accessibility.md → i18n.md → clean-code.md                                                    |
| Data fetching / Supabase queries | supabase.md → security.md → performance.md → error-handling.md                                           |
| Auth / role gates                | security.md → admin.md → supabase.md → clean-code.md                                                     |
| API routes / server actions      | security.md → supabase.md → error-handling.md → performance.md                                           |
| Analytics / tracking             | analytics.md → security.md                                                                               |
| New page / route                 | file-organization.md → performance.md → lazy-loading.md → accessibility.md → responsiveness.md → i18n.md |
| Admin features                   | admin.md → security.md → supabase.md → accessibility.md                                                  |
| New i18n strings                 | i18n.md (all 3 locales: en, pt, es) → accessibility.md                                                   |
| Performance / interaction work   | performance.md → lazy-loading.md → clean-code.md                                                         |
| Refactor / cleanup               | clean-code.md → file-organization.md → applicable-domain-rules                                           |
| Bug fix                          | applicable-domain-rules → clean-code.md → error-handling.md                                              |
| Tests                            | self-review.md → applicable-domain-rules                                                                 |

If your task spans multiple types, load the union of their rules. Don't pick and choose.

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
| add `'use client'` to a layout or page when a leaf could be client       | push the client boundary DOWN; keep Server Components as the default                                |
| import heavy libs (charts, editors, maps, PDF, 3D, rich-text) eagerly    | lazy-load via `next/dynamic` or the `lazyClient` helper from `@/lib/lazy`                           |
| ship a route without checking its First Load JS in `next build` output   | keep per-route bundle ≤ 200KB compressed; inspect treemap via `npm run analyze` if over             |
| `await` non-critical work before navigation/interaction                  | `void` fire-and-forget + `startTransition(() => router.push(...))` (or `useTransitionRouter()`)     |
| call `router.refresh()` in event handlers without measuring              | prefer `revalidatePath` / `revalidateTag` from a mutation server action                             |
| ignore Core Web Vitals targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)         | verify on PostHog Web Vitals dashboard before declaring "done"                                      |

## Domain rules — read the file BEFORE you write the code

| File                                 | One-line                                                 | Read when                                                                 |
| ------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `.agents/rules/styling.md`           | Tailwind v4, design tokens, `cn()`, dark mode            | Touching any `.tsx` with `className`                                      |
| `.agents/rules/responsiveness.md`    | Mobile-first, breakpoints, container queries             | ANY UI change                                                             |
| `.agents/rules/accessibility.md`     | WCAG 2.2 AA, focus, contrast, motion                     | ANY UI change                                                             |
| `.agents/rules/performance.md`       | Web Vitals, Server Components, INP, bundle budget        | ANY code that runs in the browser or builds a page                        |
| `.agents/rules/lazy-loading.md`      | `next/dynamic`, `Suspense`, route `loading.tsx`          | Components >5KB, below-the-fold sections, third-party widgets, heavy libs |
| `.agents/rules/clean-code.md`        | Function size, naming, immutability, comments            | ANY code change                                                           |
| `.agents/rules/file-organization.md` | Naming, layout, path alias, `types.ts`                   | New files / moves                                                         |
| `.agents/rules/forms.md`             | react-hook-form + zod pattern                            | Forms / inputs                                                            |
| `.agents/rules/i18n.md`              | next-intl setup, messages, locale routing                | Any user-facing string                                                    |
| `.agents/rules/security.md`          | 4-layer defense, env, RLS, CSP                           | Auth, API, env, third-party                                               |
| `.agents/rules/error-handling.md`    | Logger, error boundaries, catch blocks                   | Any `catch` / async failure path                                          |
| `.agents/rules/supabase.md`          | 4-client split, RLS, types                               | Any DB query / migration                                                  |
| `.agents/rules/analytics.md`         | `track()` / `trackServer()` wrappers, event names, scrub | Any user action that should be measured                                   |
| `.agents/rules/admin.md`             | Admin routes, role gates, service role rules             | Anything under `(admin)/` or touching `profiles.role`                     |

## References (lookup material, not rules)

| File                                      | What's in it                  |
| ----------------------------------------- | ----------------------------- |
| `.agents/references/key-files.md`         | Map of important paths        |
| `.agents/references/shared-components.md` | shadcn components + locations |
| `.agents/references/analytics.md`         | Event catalog                 |

## Workflows

| File                               | When                                             |
| ---------------------------------- | ------------------------------------------------ |
| `.agents/workflows/self-review.md` | Before declaring ANY task complete               |
| `.agents/workflows/multi-agent.md` | When handing work to / receiving from a subagent |

## Skills (model-specific)

If a model-specific skill folder exists in this repo, load relevant skills BEFORE writing code. Hermes loads its skills automatically; other agents must load them explicitly.

| Location            | Audience                                    |
| ------------------- | ------------------------------------------- |
| `.claude/skills/`   | Claude Code skill files (if present)        |
| `.cursor/rules/`    | Cursor IDE rules (if present)               |
| `~/.hermes/skills/` | Hermes agent skills (auto-loaded by Hermes) |

## Documentation locations

- `.plans/` — active project plans. One markdown file per plan; name format `YYYY-MM-DD-slug.md`.
- `.plans/archived/` — completed or superseded plans. **Move** files here, never delete.
- `.docs/` — technical and product documentation. Subfolders: `architecture/`, `runbooks/`, `decisions/` (ADRs), `product/`.
- `CHANGELOG.md` — auto-generated by `npm run push`. **Do NOT edit manually.**

## Before completing ANY task

Run the self-review checklist (`.agents/workflows/self-review.md`). Specifically:

```bash
npm run check    # lint + typecheck + format:check
npm run test     # vitest run
npm run build    # only if substantial changes
npm run analyze  # only if you suspect a bundle regression
```

Commit format: Conventional Commits. Pushing is done via `npm run push` (Carevia-style) which auto-generates the changelog and runs the pre-push gate.

## Self-check anti-pattern

If you're tempted to skip reading a rule because "this is a small change", **stop**. The Carevia analysis showed agents skip rules ~40% more often on small changes than large ones, and small changes are where regressions hide. ALWAYS load the task-type index above before touching code.
