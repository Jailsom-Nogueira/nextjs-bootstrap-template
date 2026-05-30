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

## Verification

- [ ] `npm run qa` exits 0.
- [ ] If UI/browser-facing: `npm run qa:visual` exits 0 and screenshots were reviewed.
- [ ] Before PR/release: `npm run qa:strict` exits 0.
- [ ] If a standalone HTML/report/prototype was delivered: opened/verified in browser or served via localhost; final response includes verified URL + file path.

## Artifacts and docs

- [ ] Read `.agents/references/artifact-layers.md` before creating/editing/moving specs, plans, docs, runbooks, concepts, or local artifacts.
- [ ] Updated `AGENTS.md` / `.agents/rules/*` only for terse invariants.
- [ ] Added long-form explanation to `CONCEPTS.md`, not AGENTS.md.
- [ ] When you delete or rename a file, grep the docs (`AGENTS.md`, `README.md`, `.agents/**`, `CONCEPTS.md`) for the old path and update every reference. `npm run check:doc-refs` (part of `npm run check` / `npm run qa`) enforces this for concrete file paths — but it does NOT catch semantic drift (a version number, a renamed concept, a count), which stays your responsibility.
- [ ] Commit message is Conventional Commits format.
- [ ] Release/push uses `npm run push` (generated CHANGELOG flow), not manual CHANGELOG edits.

## Security

- [ ] No new secrets logged or sent to client.
- [ ] New env vars added to BOTH `src/env.ts` AND `.env.example`.
- [ ] New external scripts/domains added to CSP in `next.config.ts`.
- [ ] New Supabase tables have RLS enabled.
