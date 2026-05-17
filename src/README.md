# `src/` — application source

Application source for the Next.js app. The directory layout is intentionally flat at the top level so paths stay short under the `@/*` alias. AGENTS.md task router and `.agents/rules/file-organization.md` govern where new files go.

This README is a **top-level map only**. Each subfolder owns its own internal organization; some have their own deeper README (linked below).

## Top-level structure

| Path          | Purpose                                                                                                                    | Deeper README               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `app/`        | Next.js App Router. Server Components by default; locale routing under `app/[locale]/`.                                    | —                           |
| `components/` | Shared UI: shadcn primitives under `components/ui/`, app components at the top, lazy heavy ones under `lazy/`.             | `components/lazy/README.md` |
| `config/`     | Static site config (name, URL, owner, social handles).                                                                     | —                           |
| `hooks/`      | React hooks (must run client-side).                                                                                        | —                           |
| `i18n/`       | next-intl routing, request loader, locale-aware navigation helpers.                                                        | —                           |
| `lib/`        | Pure utility modules grouped by concern: `analytics/`, `auth/`, `email/`, `logger/`, `perf/`, plus `utils.ts`, `lazy.tsx`. | —                           |
| `supabase/`   | Supabase clients (4-way split) and generated DB types.                                                                     | —                           |
| `types/`      | App-wide TypeScript types (`database.ts` re-export, etc.).                                                                 | —                           |
| `env.ts`      | `@t3-oss/env-nextjs` + zod boot-time validation. Single source of truth for `process.env` access.                          | —                           |
| `proxy.ts`    | Request proxy (renamed middleware in Next 16): session refresh, locale routing, admin gate.                                | —                           |

## `app/`

| Path                                                 | Purpose                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| `app/layout.tsx`                                     | Root layout. Loads PostHog, theme provider, sets html lang.              |
| `app/globals.css`                                    | Tailwind v4 `@theme` tokens (light + dark), CSS variables.               |
| `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts` | Generated metadata files (PWA manifest, robots.txt, sitemap.xml).        |
| `app/api/health/route.ts`                            | Liveness probe used by the visual QA runner and external monitors.       |
| `app/[locale]/layout.tsx`                            | Locale-scoped layout. NextIntl provider, theme, PostHog wiring, Toaster. |
| `app/[locale]/page.tsx`                              | Home page (lazyClient demo).                                             |
| `app/[locale]/loading.tsx`                           | Streaming skeleton.                                                      |
| `app/[locale]/(auth)/login/page.tsx`                 | Login form.                                                              |
| `app/[locale]/(auth)/signup/page.tsx`                | Signup form.                                                             |
| `app/[locale]/(auth)/callback/route.ts`              | Supabase OAuth callback handler.                                         |
| `app/[locale]/(dashboard)/dashboard/page.tsx`        | Gated user dashboard.                                                    |
| `app/[locale]/(admin)/admin/layout.tsx`              | Role-gated server component (calls `isAdmin()`).                         |
| `app/[locale]/(admin)/admin/page.tsx`                | Admin home.                                                              |
| `app/[locale]/(admin)/admin/users/page.tsx`          | Admin users list.                                                        |
| `app/[locale]/(admin)/admin/loading.tsx`             | Admin route skeleton.                                                    |

Route groups in parentheses (`(auth)`, `(dashboard)`, `(admin)`) do not appear in URLs; they exist to scope layouts without polluting the URL space.

## `components/`

| Path                             | Purpose                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `components/ui/`                 | shadcn/ui primitives (button, dialog, dropdown, form, input, sheet, etc.). Inventory in `.agents/references/shared-components.md`. |
| `components/html-lang-sync.tsx`  | Keeps the `<html lang>` attribute in sync with the active locale.                                                                  |
| `components/locale-switcher.tsx` | Locale switcher dropdown.                                                                                                          |
| `components/site-header.tsx`     | Site header (brand, nav, theme toggle, locale switcher).                                                                           |
| `components/site-footer.tsx`     | Site footer.                                                                                                                       |
| `components/theme-provider.tsx`  | next-themes provider.                                                                                                              |
| `components/theme-toggle.tsx`    | One-click theme toggle.                                                                                                            |
| `components/lazy/`               | Components that must be lazy-loaded. See `components/lazy/README.md`.                                                              |

## `lib/`

| Path                                    | Purpose                                                             |
| --------------------------------------- | ------------------------------------------------------------------- |
| `lib/utils.ts`                          | `cn()` (clsx + tailwind-merge).                                     |
| `lib/lazy.tsx`                          | `lazyClient` typed wrapper around `next/dynamic`.                   |
| `lib/analytics/`                        | PostHog client + server wrappers, event-name enum, PII scrub.       |
| `lib/auth/`                             | `getUser`, `getUserRole`, `isAdmin` helpers.                        |
| `lib/email/resend.ts`                   | Resend transactional email client.                                  |
| `lib/logger/logger.ts`                  | pino structured logger.                                             |
| `lib/perf/start-transition-navigate.ts` | `useTransitionRouter()` — wraps `router.push` in `startTransition`. |

Tests colocated next to source: `lib/utils.test.ts`, `lib/lazy.test.tsx`, `lib/auth/is-admin.test.ts`, `lib/analytics/scrub.test.ts`.

## `i18n/`, `supabase/`, `hooks/`, `config/`, `types/`

Single-purpose modules; each file is self-documenting via a top-of-file JSDoc block. Pair them with the canonical rules:

- `i18n/` ↔ `.agents/rules/i18n.md` and `messages/README.md`.
- `supabase/` ↔ `.agents/rules/supabase.md` and the root `supabase/README.md`.
- `hooks/` — client-only hooks. Add `"use client";` at the top of each.
- `config/` — static site config; no runtime branching.
- `types/` — app-wide TS types. Generated Supabase types live in `supabase/database.types.ts`.

## Conventions (summary — full rules in `.agents/rules/`)

- **Server Components by default.** Push `"use client"` to the leaves.
- **`@/*` path alias only.** No `../../*` imports.
- **No `console.log`.** Use `lib/logger/logger.ts`.
- **No `.select('*')`.** List columns explicitly.
- **`SUPABASE_SERVICE_ROLE_KEY` is server-only.** `supabase/server-admin.ts` starts with `import "server-only"`.
- **All `process.env` access through `src/env.ts`.** Never `process.env.X!` elsewhere.
- **i18n keys via `useTranslations()` / `getTranslations()`.** Never hardcode user-facing strings.

## How to add a new module

See `.agents/rules/file-organization.md` for the full decision tree. Quick guide:

| Adding…                        | Goes in                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------ |
| A page or route                | `app/[locale]/<route>/page.tsx` (locale-scoped) or `app/api/<route>/route.ts`. |
| A reusable UI component        | `components/<kebab-name>.tsx`. shadcn primitives go in `components/ui/`.       |
| A heavy / below-fold component | `components/lazy/<kebab-name>.tsx`. Import via `lazyClient`.                   |
| A pure utility                 | `lib/<concern>/<name>.ts`. Colocate `<name>.test.ts` next to it.               |
| A React hook                   | `hooks/use-<name>.ts`. Mark `"use client";` at the top.                        |
| A Supabase client variant      | Don't. Use the 4 existing ones (`client`, `server`, `server-admin`, `proxy`).  |
| A new env var                  | Add to BOTH `env.ts` AND `.env.example`. The build fails fast if you miss one. |

## References

- `AGENTS.md` (repo root) — task router and routing protocol.
- `.agents/rules/file-organization.md` — full layout rules.
- `.agents/references/key-files.md` — annotated map of the most important files.
- `.agents/references/shared-components.md` — shadcn primitive inventory.
- `CONCEPTS.md` (repo root) — the "why" behind every pattern.
