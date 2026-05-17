# Security

## Four layers (defense in depth)

1. **Env validation** — `src/env.ts` (t3-env + zod). Fails at boot, not at runtime.
2. **Middleware** — Supabase session refresh + route gating.
3. **RLS** — Row-Level Security on every Supabase table. No exceptions.
4. **Server-side zod** — re-validate every input in Server Actions / Route Handlers.

## Rules

- NEVER read `process.env.*` directly outside `src/env.ts`. Import `env` from there.
- NEVER expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It belongs in `src/supabase/server-admin.ts` only.
- ALWAYS prefix server-only modules with `import "server-only";`.
- CSP is locked in `next.config.ts`. Adding a new external script? Edit the CSP, document why.
- Cookies: HttpOnly + Secure + SameSite=Lax in production. Supabase handles this for auth.
- Webhooks: verify signatures. Stripe → `Stripe.webhooks.constructEvent`, Resend → signature header, etc.
- NEVER log secrets. The pino logger has a redact list — extend it for new sensitive fields.

## RLS quick reference

- Default-deny: `alter table x enable row level security; alter table x force row level security;`
- Policy per operation: `for select`, `for insert`, `for update`, `for delete`.
- Service-role bypasses RLS — only use in `server-admin.ts`.

## Forbidden

- Forbidden: `select('*')` on user-facing reads. Be explicit about columns.
- Forbidden: service role in a `'use client'` file or in middleware.
- Forbidden: reading secrets via `process.env` in components — always go through `env`.
