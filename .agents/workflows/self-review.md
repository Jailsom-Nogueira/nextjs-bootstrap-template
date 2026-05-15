# Self-Review Checklist

Run BEFORE marking a task complete.

## Code

- [ ] No `any` types. Use `unknown` or a real type.
- [ ] No `console.log` (warn/error OK, but prefer logger).
- [ ] No inline hex/rgb. Use design tokens.
- [ ] No deep relative imports. Use `@/*`.
- [ ] No `.select('*')`. List columns.
- [ ] No service role in client code.
- [ ] No raw `process.env.*` outside `src/env.ts`.
- [ ] Used `cn()` for class merging.
- [ ] Exported types live in `types.ts`, not inline at usage sites.

## Verification (these MUST pass)

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build` (if touched anything substantial)
- [ ] Manually tested in dev for any user-visible change.

## Docs

- [ ] Updated `AGENTS.md` / `.agents/rules/*` if a new pattern was introduced.
- [ ] Added a changeset (`npx changeset`) if user-visible.
- [ ] Commit message is Conventional Commits format.

## Security

- [ ] No new secrets logged or sent to client.
- [ ] New env vars added to BOTH `src/env.ts` AND `.env.example`.
- [ ] New external scripts/domains added to CSP in `next.config.ts`.
- [ ] New Supabase tables have RLS enabled.
