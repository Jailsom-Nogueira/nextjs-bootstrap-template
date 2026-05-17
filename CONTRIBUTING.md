# Contributing

Thanks for helping improve nextjs-bootstrap-template.

This project is a starter template, so changes should preserve two properties:

1. Product agnostic: no project-specific branding, secrets, vendor account IDs, or maintainer-local paths in tracked source.
2. Agent friendly: instructions should help humans and AI agents find the right dedicated rule, reference, workflow, or documentation file without duplicating large blocks of guidance.

## Local setup

```bash
git clone https://github.com/Jailsom-Nogueira/nextjs-bootstrap-template.git
cd nextjs-bootstrap-template
cp .env.example .env.local
nvm use
npm install
npm run qa
npm run dev
```

Fill `.env.local` with your own Supabase project values before running flows that need auth or database access. Do not commit `.env.local`.

## Development workflow

1. Create a branch from `main`.
2. Classify the task using `AGENTS.md`.
3. Load the relevant files under `.agents/rules/`, `.agents/references/`, or `.agents/workflows/`.
4. Make the smallest change that solves the problem.
5. Run `npm run qa` until it exits 0.
6. For UI/browser-facing changes, also run `npm run qa:visual` and inspect screenshots.
7. Open a pull request using `.github/PULL_REQUEST_TEMPLATE.md`.

## Quality bar

- TypeScript stays strict. Do not use `any` as an escape hatch.
- Do not add `eslint-disable`, skipped tests, commented-out code, or unreviewed `@ts-expect-error` to make gates pass.
- Keep AGENTS.md terse. Long-form teaching belongs in `CONCEPTS.md`; operational rules belong in `.agents/rules/`; procedures belong in `.agents/workflows/`; lookup material belongs in `.agents/references/`.
- Keep template defaults generic. If a value must be product-specific, document it as something the generated app owner should replace.
- Update README, CONCEPTS, AGENTS, or `.agents/*` when behavior or conventions change.

## Commit messages

Use Conventional Commits:

```text
feat: add reusable dashboard shell
fix: correct Supabase client boundary
docs: clarify generated app setup
chore: update dependencies
```

## Security and secrets

Do not commit real credentials, personal access tokens, Supabase service-role keys, PostHog keys, Resend keys, or screenshots/logs containing secrets. Use `.env.local` locally and GitHub/Vercel secrets in hosted environments.

See `SECURITY.md` for vulnerability reporting.
