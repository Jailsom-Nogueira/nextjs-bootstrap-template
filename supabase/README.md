# `supabase/` — Supabase project configuration and SQL migrations

[Supabase CLI](https://supabase.com/docs/guides/cli/local-development) project files. Read `.agents/rules/supabase.md` for client-split, RLS, and service-role conventions, and `.agents/rules/admin.md` for role-gate rules. This README focuses on what lives here and how to operate the directory.

## Files

| File / directory                              | Purpose                                                                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `config.toml`                                 | Local-dev config: ports (API 54321, DB 54322, Studio 54323), auth redirects, JWT expiry, signup flag.                               |
| `migrations/`                                 | Versioned SQL migrations. Filenames use UTC timestamps (`YYYYMMDDHHMMSS_<slug>.sql`).                                               |
| `migrations/20260515003000_profiles_role.sql` | The bundled admin-panel migration: `public.profiles` table, role enum, RLS policies, role-guard trigger, `handle_new_user` trigger. |
| `seed.sql`                                    | Seed data applied by `supabase db reset` after migrations. Currently a stub.                                                        |

## How migrations run

- **Local:** `supabase db reset` re-runs every migration in order against the local DB. Use this aggressively in dev.
- **Production:** push migrations through your team's deploy pipeline (Supabase dashboard, GitHub Actions with the Supabase CLI, or Vercel build hooks). The template does not enforce a deploy flow — pick one that fits your workflow.
- **Types:** after adding or editing a migration, run `npm run db:types` (see `scripts/generate-types.sh`) to regenerate `src/supabase/database.types.ts` against the linked project. Requires `SUPABASE_PROJECT_REF` and the `supabase` CLI.

## Migration conventions

Every migration in this directory MUST:

- Use the `YYYYMMDDHHMMSS_<slug>.sql` filename. Generate the timestamp with `date -u +%Y%m%d%H%M%S`. Slug is kebab-case.
- Be **idempotent**: `create table if not exists`, `create index if not exists`, `drop policy if exists "..." on public.<table>` before `create policy`.
- `alter table public.<table> enable row level security;` for every new table.
- Define explicit RLS policies per operation (select / insert / update / delete) with `using` and `with check` clauses.
- List columns explicitly in DML. No `*` in `select` or `insert`.
- Use Postgres types deliberately: `uuid`, `timestamptz`, `text`, `jsonb`. Avoid `varchar(n)` unless the constraint matters.
- Default timestamps via `timestamp with time zone default now()`.
- Add an `-- Rollback notes:` comment block at the bottom describing how to undo in dev. Production rollbacks happen via a new forward migration, never by editing this file.

See `.agents/rules/supabase.md` for the full rule sheet and `.claude/commands/migration.md` for the slash-command scaffold Claude Code uses.

## How to add a new migration

The fastest path is to ask Claude Code: `/migration <short-description>`. It will:

1. Read the rules and compute the timestamp.
2. Write `migrations/<timestamp>_<slug>.sql` following all conventions above.
3. Suggest running `npm run db:types` after.

Manually:

```bash
ts=$(date -u +%Y%m%d%H%M%S)
slug="add-orders-table"   # kebab-case
$EDITOR "supabase/migrations/${ts}_${slug}.sql"
supabase db reset         # local
npm run db:types          # regenerate types
```

## When templating a new app

After generating a project from this template:

- Update `config.toml` `project_id` and `site_url` / `additional_redirect_urls` to match your app.
- Decide whether to keep the bundled `profiles_role` migration. If your app does not need an admin panel, remove it AND remove `src/lib/auth/is-admin.ts`, `src/app/[locale]/(admin)/`, the `.agents/rules/admin.md` rule references, and the `admin-gate` e2e spec.
- Link the local CLI to a real Supabase project: `supabase link --project-ref <ref>`.

## References

- Supabase CLI: https://supabase.com/docs/guides/cli
- `.agents/rules/supabase.md` — 4-client split, RLS, types, migration conventions.
- `.agents/rules/admin.md` — admin routes, role gates, service-role rules.
- `.claude/commands/migration.md` — slash command for new migrations.
- `scripts/generate-types.sh` — type generation script (`npm run db:types`).
- `src/supabase/` — TypeScript clients consumed by the app.
