# Supabase

## Client split (memorize this)

| Client                | File                           | Use in                                       | Auth                        |
| --------------------- | ------------------------------ | -------------------------------------------- | --------------------------- |
| Browser               | `src/supabase/client.ts`       | Client Components                            | Anon (RLS)                  |
| Server                | `src/supabase/server.ts`       | Server Components / Actions / Route Handlers | Anon + user cookies (RLS)   |
| Admin                 | `src/supabase/server-admin.ts` | Cron / webhooks / admin APIs                 | Service role (BYPASSES RLS) |
| Proxy session refresh | `src/proxy.ts`                 | Request-time locale/auth/admin gates         | Anon + user cookies         |

## Rules

- ALWAYS enable RLS on every new table.
- NEVER `.select('*')` — list columns explicitly. (Bundle size + accidental PII exposure.)
- Service role usage MUST be gated behind `import "server-only"` and live in `server-admin.ts`.
- Use `database.types.ts` for typed queries. Regenerate via `npm run db:types`.
- The only sanctioned try/catch around cookie `set`/`setAll` is the one in `src/supabase/server.ts`. Don't replicate elsewhere.

## Auth flow

1. User clicks "Sign in" → goes through Supabase OAuth or magic link.
2. Provider redirects to `/[locale]/callback?code=...`.
3. Callback route exchanges code for session.
4. `src/proxy.ts` refreshes session on every matched subsequent request.
5. Server Components fetch user via `getUser()` (`@/lib/auth/get-user`).

## Forbidden

- ❌ Service role in a `'use client'` file.
- ❌ Importing `server-admin` from anywhere except trusted server contexts.
- ❌ `select('*')` (use explicit columns).
- ❌ Bypassing RLS by routing user queries through the admin client.
