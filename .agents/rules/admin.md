# Admin panel

The admin panel lives at `src/app/[locale]/(admin)/admin/`. Access is gated by `profiles.role = 'admin'`.

## Role model

- `public.profiles.role` is a `text` column with a check constraint `in ('user','admin')`.
- A row is auto-inserted on `auth.users` insert via the `handle_new_user` trigger; default role is `'user'`.
- Role changes are guarded: a BEFORE UPDATE trigger raises if a non-admin tries to change `role`.
- RLS:
  - SELECT — own row OR any row if you are admin.
  - UPDATE — own row, but role-column changes are guarded by trigger.

## How the gate works (defense in depth)

1. **Middleware** (`src/middleware.ts`):
   - Refreshes the Supabase session.
   - If the URL matches `/(<locale>)?/admin/.*` and the user is not admin, redirects to the localized `/`.
2. **Layout** (`src/app/[locale]/(admin)/admin/layout.tsx`):
   - Calls `isAdmin()` (server-only). If false, `redirect("/")`.
3. **API routes** that mutate as admin must call `isAdmin()` before invoking the service-role client.

Two layers because a misconfigured middleware matcher (or a forgotten `_next` skip) cannot leak the admin UI.

## Adding an admin route

1. Drop the page under `src/app/[locale]/(admin)/admin/<your-route>/page.tsx`.
2. It will inherit the layout's role check automatically.
3. If it has its own API route, add `if (!(await isAdmin())) return new Response("Forbidden", { status: 403 });` at the top.

## Service-role client rules

- `createAdminClient()` lives in `src/supabase/server-admin.ts` with `import "server-only"`.
- Use ONLY after `isAdmin()` has confirmed the caller is admin (or in trusted contexts — cron, webhooks with HMAC).
- Never pass admin-client results directly to the client without scrubbing.

## Audit log

- TODO: implement an `admin_audit_log` table that records every admin action (actor, action, target, timestamp, ip).
- Until then, log admin mutations via `logger.warn({ admin: true, action, target })` so we can grep production logs.

## Client-side role state

- NEVER trust a `role` value cached on the client.
- Always re-check on the server before performing privileged work.
- The Zustand store may cache `role` for UI hints (showing the "Admin" nav link) — but only the server enforces it.

## Making a user admin

**In dev (SQL editor):**

```sql
update public.profiles set role = 'admin' where id = '<uuid>';
```

**In CI / staging seed:**

Use `supabase/seed.sql` to upsert a known admin email mapping. Never seed an admin in production via a public migration; promote manually.

## Naming

- Route group: `(admin)` — parentheses make it group-only, no URL segment.
- All admin URLs start with `/admin/`.
- All admin DB helpers live in `src/lib/auth/` and `src/lib/admin/`.
