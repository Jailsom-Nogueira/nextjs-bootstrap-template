# nextjs-bootstrap-template

Next.js 16 + Supabase + PostHog + Resend template with batteries included.

## Stack

| Tech               | Version    | Purpose                                   |
| ------------------ | ---------- | ----------------------------------------- |
| Next.js            | 16.2.6     | Framework (App Router, Turbopack default) |
| React              | 19.2.6     | UI                                        |
| TypeScript         | 5.6+ strict | Type safety                              |
| Tailwind CSS       | 4.x        | Styling (CSS-first `@theme`)              |
| shadcn/ui          | latest     | Component primitives (radix-nova style)   |
| Radix              | latest     | Headless UI (via shadcn)                  |
| lucide-react       | latest     | Icons                                     |
| framer-motion      | 12.x       | Animation                                 |
| Supabase           | ssr 0.10.x | Auth + DB + Storage                       |
| @t3-oss/env-nextjs | 0.13.x     | Env validation (zod)                      |
| PostHog            | js + node  | Analytics (reverse-proxied)               |
| Resend             | 6.x        | Transactional email                       |
| react-email        | 6.x        | Email templates                           |
| next-themes        | 0.4.x      | Dark mode                                 |
| react-hook-form    | 7.x        | Forms                                     |
| zod                | 4.x        | Schema validation                         |
| zustand            | 5.x        | Client state                              |
| date-fns           | 4.x        | Date utilities                            |
| pino               | 10.x       | Structured logging                        |
| Vitest             | 4.x        | Unit tests                                |
| Playwright         | 1.60.x     | E2E tests                                 |
| ESLint             | 9.x        | Lint (flat config)                        |
| Prettier           | 3.x        | Format                                    |
| Husky              | 9.x        | Git hooks                                 |
| commitlint         | 21.x       | Conventional commits                      |
| changesets         | 2.x        | Release management                        |

## Quick start

```bash
git clone <repo>
cd nextjs-bootstrap-template
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY at minimum
nvm use                  # picks Node 22 from .nvmrc
npm install
npm run db:types         # optional: generate Supabase types
npm run dev              # http://localhost:3000
```

## Architecture overview

Four security layers, defense in depth:

1. **Env validation** — `src/env.ts` (t3-env + zod) fails at boot if anything required is missing.
2. **Middleware** — Supabase session refresh + route gating (`src/middleware.ts`).
3. **RLS** — Row-Level Security on every Supabase table.
4. **Server-side zod** — re-validate every input in Server Actions / Route Handlers.

## Project structure

```
src/
├── app/                        # App Router
│   ├── (auth)/                 # login, signup, callback
│   ├── (dashboard)/            # gated routes
│   ├── api/health/             # liveness probe
│   ├── layout.tsx              # Theme + PostHog providers
│   ├── page.tsx                # landing
│   └── globals.css             # Tailwind v4 @theme
├── components/
│   ├── ui/                     # shadcn primitives
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── hooks/use-supabase-user.ts
├── lib/
│   ├── analytics/              # PostHog wrappers + event names + PII scrub
│   ├── auth/get-user.ts
│   ├── email/                  # Resend client + react-email templates
│   ├── logger/logger.ts        # pino
│   └── utils.ts                # cn()
├── supabase/                   # 4 clients: browser, server, server-admin, middleware
├── types/database.ts
├── env.ts                      # ⭐ Validated env (boot-time)
└── middleware.ts
```

## Scripts

| Script                                              | Purpose                         |
| --------------------------------------------------- | ------------------------------- |
| `dev`                                               | Next dev server (Turbopack)     |
| `build`                                             | Production build                |
| `start`                                             | Run prod build                  |
| `lint` / `lint:fix`                                 | ESLint flat config              |
| `typecheck`                                         | `tsc --noEmit`                  |
| `format` / `format:check`                           | Prettier                        |
| `check`                                             | lint + typecheck + format:check |
| `ci-check`                                          | check + test + build            |
| `test` / `test:watch` / `test:ui` / `test:coverage` | Vitest                          |
| `test:e2e` / `test:e2e:ui`                          | Playwright                      |
| `db:types`                                          | Generate Supabase types         |
| `email:dev`                                         | react-email preview server      |
| `changeset`                                         | Add a changeset                 |
| `prepare`                                           | Husky install                   |

## Environment variables

| Name                            | Required              | Description                            |
| ------------------------------- | --------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | ✓ (default localhost) | Public origin                          |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✓                     | Supabase project URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓                     | Supabase anon key                      |
| `SUPABASE_SERVICE_ROLE_KEY`     | optional              | Admin client (server-only)             |
| `SUPABASE_PROJECT_REF`          | optional              | For `npm run db:types`                 |
| `NEXT_PUBLIC_POSTHOG_KEY`       | optional              | Enables analytics                      |
| `NEXT_PUBLIC_POSTHOG_HOST`      | optional              | Defaults to `/ingest` reverse proxy    |
| `POSTHOG_API_KEY`               | optional              | Server-side PostHog (usually same key) |
| `RESEND_API_KEY`                | optional              | Enables email                          |
| `EMAIL_FROM`                    | optional              | Default from address                   |

All are validated in `src/env.ts`. The build fails fast if a required var is missing.

## Testing

```bash
npm test                # unit (vitest)
npm run test:watch
npm run test:coverage   # v8 coverage
npm run test:e2e        # playwright (chromium + webkit)
npm run test:e2e:ui     # interactive
```

## Code quality

- **ESLint 9** flat config — extends `next/core-web-vitals`, `next/typescript`, plus tailwindcss + eslint-comments. Bans `any`, `console.log`, deep relatives.
- **Prettier 3** with `prettier-plugin-tailwindcss` for class sorting.
- **Husky 9** hooks:
  - `pre-commit` → `lint-staged` (eslint + prettier on changed files)
  - `commit-msg` → `commitlint` (Conventional Commits)
  - `pre-push` → `typecheck`
- **lint-staged** — only formats/lints staged files for speed.

## CI/CD

`.github/workflows/`:

- `ci.yml` — lint, typecheck, build, test on PR + main push
- `e2e.yml` — Playwright on PR with report artifact
- `release.yml` — `changesets/action` opens version PRs / publishes on main

Recommended branch protection: require `ci`, require linear history, require signed commits if you can.

## Deployment

Built for Vercel. After `vercel link`:

1. Add all env vars from `.env.example` to the Vercel project (Production + Preview).
2. Push to `main` → auto-deploy.
3. `release.yml` handles version PRs via Changesets.

Other platforms (Fly, Railway) work — just provide Node 22 and the env vars.

## AI Agents

This repo is agent-friendly:

- `AGENTS.md` — primary instructions hub (read first)
- `CLAUDE.md` — Claude Code specifics
- `GEMINI.md` — compressed rules for Gemini
- `.agents/rules/` — per-domain conventions (styling, security, supabase, etc.)
- `.agents/references/` — file maps + component inventory
- `.agents/workflows/` — checklists and handoff contracts

## License

MIT © Jailsom Nogueira
