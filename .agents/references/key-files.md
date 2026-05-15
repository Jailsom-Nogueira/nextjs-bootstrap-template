# Key Files

## Configuration

- `package.json` — scripts, deps, lint-staged
- `tsconfig.json` — strict TS (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- `next.config.ts` — security headers, PostHog `/ingest` rewrites, image patterns
- `eslint.config.mjs` — flat config; bans `any`, `console.log`, deep relatives
- `prettier.config.mjs` — with tailwind plugin
- `commitlint.config.mjs` — conventional commits
- `vitest.config.ts` — jsdom, `@/*` alias
- `playwright.config.ts` — chromium + webkit
- `.changeset/config.json` — release automation

## Source entry points

- `src/env.ts` — VALIDATED ENV. Single source of truth.
- `src/middleware.ts` — edge middleware (Supabase session refresh + route gating)
- `src/app/layout.tsx` — root layout (ThemeProvider, PostHogProvider, fonts)
- `src/app/globals.css` — Tailwind v4 `@theme` design tokens
- `src/app/api/health/route.ts` — liveness probe

## Supabase

- `src/supabase/{client,server,server-admin,middleware}.ts` — 4 clients
- `src/supabase/database.types.ts` — generated via `npm run db:types`

## Analytics

- `src/lib/analytics/event-names.ts` — canonical event enum
- `src/lib/analytics/{events,events-server}.ts` — `track()` / `trackServer()` wrappers
- `src/lib/analytics/scrub.ts` — PII redactor
- `src/lib/analytics/posthog-{client,server}.{tsx,ts}` — provider + singleton

## Email

- `src/lib/email/resend.ts` — Resend singleton
- `src/lib/email/templates/*.tsx` — react-email templates
- `emails/*.tsx` — dev-server scanned re-exports

## Auth helpers

- `src/lib/auth/get-user.ts` — server-side current user
- `src/hooks/use-supabase-user.ts` — client-side subscription
