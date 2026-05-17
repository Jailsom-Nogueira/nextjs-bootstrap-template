# Key Files

## Configuration

- `package.json` — scripts, deps, lint-staged, repository metadata
- `tsconfig.json` — strict TS (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- `next.config.ts` — security headers, PostHog `/ingest` rewrites, image patterns
- `eslint.config.mjs` — flat config; bans `any`, `console.log`, deep relatives
- `prettier.config.mjs` — with Tailwind plugin
- `commitlint.config.mjs` — Conventional Commits
- `vitest.config.ts` — jsdom, `@/*` alias
- `playwright.config.ts` — chromium + webkit, global e2e setup
- `.husky/pre-push` — typecheck + CHANGELOG_GENERATED guard

## Source entry points

- `src/env.ts` — validated env. Single source of truth.
- `src/proxy.ts` — Next 16 proxy: locale routing, Supabase session refresh, route gates
- `src/app/layout.tsx` — minimal root layout
- `src/app/[locale]/layout.tsx` — locale shell, theme, PostHog, footer/header
- `src/app/globals.css` — Tailwind v4 `@theme` design tokens
- `src/app/api/health/route.ts` — liveness probe
- `src/config/site.ts` — app-level public links/config

## Supabase

- `src/supabase/client.ts` — browser client
- `src/supabase/server.ts` — request-scoped server client
- `src/supabase/server-admin.ts` — service-role admin client (`createAdminClient`)
- `src/supabase/database.types.ts` — generated via `npm run db:types`
- `supabase/migrations/` — SQL migrations

## Analytics

- `src/lib/analytics/event-names.ts` — canonical event enum
- `src/lib/analytics/{events,events-server}.ts` — `track()` / `trackServer()` wrappers
- `src/lib/analytics/scrub.ts` — PII redactor
- `src/lib/analytics/posthog-{client,server}.{tsx,ts}` — provider + singleton

## Email

- `src/lib/email/resend.ts` — Resend singleton
- `emails/*.tsx` — react-email templates for preview via `npm run email:dev`

## Auth helpers

- `src/lib/auth/get-user-role.ts` — server-side role lookup
- `src/lib/auth/is-admin.ts` — admin guard helper
