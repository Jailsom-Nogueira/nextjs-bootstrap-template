---
description: Generate a Supabase migration following project conventions
argument-hint: <short-description>
---

Create a new Supabase migration. `$ARGUMENTS` is the short description.

1. Read `.agents/rules/supabase.md` and `.agents/rules/admin.md` for conventions.
2. Compute UTC timestamp `YYYYMMDDHHMMSS` (use `date -u +%Y%m%d%H%M%S`).
3. Derive a kebab-case slug from `$ARGUMENTS`.
4. Write the file to `supabase/migrations/<YYYYMMDDHHMMSS>_<slug>.sql`.

The migration MUST:

- Use `create table if not exists`, `create index if not exists`.
- Drop policies idempotently before recreating: `drop policy if exists "..." on public.<table>; create policy "..." on ...`.
- `alter table public.<table> enable row level security;` for every new table.
- Define explicit RLS policies for select/insert/update/delete with `using` and `with check` clauses.
- List columns explicitly in any DML (`insert into ... (col1, col2) values (...)`). NEVER `*`.
- Use Postgres types deliberately (`uuid`, `timestamptz`, `text`, `jsonb`).
- Default timestamps via `timestamp with time zone default now()`.
- Auto-update `updated_at` via a `before update` trigger when applicable.

At the bottom of the file, add a `-- Rollback notes:` comment block describing how to undo this migration in dev. Production rollbacks go via a new forward migration, never by editing this file.

After writing, suggest running `npm run db:types` to regenerate `src/supabase/database.types.ts`.
