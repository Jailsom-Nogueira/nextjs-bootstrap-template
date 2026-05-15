# nextjs-bootstrap-template

> 👉 **New to any of these concepts?** See [CONCEPTS.md](./CONCEPTS.md) before changing the
> structure. It teaches every tool/pattern used here (what, why, how, common mistakes).

> 🤖 **AI agents: start here**
>
> - Read [AGENTS.md](./AGENTS.md) — the canonical rules hub.
> - Read [CONCEPTS.md](./CONCEPTS.md) if any term in AGENTS.md feels unfamiliar.
> - Four commands you need: `npm install`, `npm run dev`, `npm run qa`, `npm run test:agent`.
> - Five invariants: no `any`, no `console.log`, no `SUPABASE_SERVICE_ROLE_KEY` in client code, no
>   `.select('*')`, `npm run qa` exit 0 = done.
> - Run `npm run prompt:context` to paste a fresh project snapshot into ChatGPT/Claude/Gemini web
>   UIs.
> - MCP servers configured in `.mcp.json` (Supabase read-only, Playwright, Context7). See "MCP
>   servers" below.
> - Per-tool config: `.claude/commands/*` slash commands (Claude Code), `.cursor/rules/*.mdc`
>   (Cursor), `.clinerules/00-base.md` (Cline), `.aider.conf.yml` (Aider), `.codex/setup.sh` (Codex
>   Cloud).

Next.js 16 + Supabase + PostHog + Resend template with batteries included.

## Stack

| Tech               | Version     | Purpose                                   |
| ------------------ | ----------- | ----------------------------------------- |
| Next.js            | 16.2.6      | Framework (App Router, Turbopack default) |
| React              | 19.2.6      | UI                                        |
| TypeScript         | 5.6+ strict | Type safety                               |
| Tailwind CSS       | 4.x         | Styling (CSS-first `@theme`)              |
| shadcn/ui          | latest      | Component primitives (radix-nova style)   |
| Radix              | latest      | Headless UI (via shadcn)                  |
| lucide-react       | latest      | Icons                                     |
| framer-motion      | 12.x        | Animation                                 |
| Supabase           | ssr 0.10.x  | Auth + DB + Storage                       |
| @t3-oss/env-nextjs | 0.13.x      | Env validation (zod)                      |
| PostHog            | js + node   | Analytics (reverse-proxied)               |
| Resend             | 6.x         | Transactional email                       |
| react-email        | 6.x         | Email templates                           |
| next-themes        | 0.4.x       | Dark mode                                 |
| react-hook-form    | 7.x         | Forms                                     |
| zod                | 4.x         | Schema validation                         |
| zustand            | 5.x         | Client state                              |
| date-fns           | 4.x         | Date utilities                            |
| pino               | 10.x        | Structured logging                        |
| Vitest             | 4.x         | Unit tests                                |
| Playwright         | 1.60.x      | E2E tests                                 |
| ESLint             | 9.x         | Lint (flat config)                        |
| Prettier           | 3.x         | Format                                    |
| Husky              | 9.x         | Git hooks                                 |
| commitlint         | 21.x        | Conventional commits                      |
| next-intl          | 4.x         | i18n (en/pt/es)                           |

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

See [CONCEPTS.md](./CONCEPTS.md) for the why behind each layer.

## Project structure

The repo is intentionally flat. Every root-level file/folder has a single purpose. If a file is not
in this list, it does not belong at the root.

### Root files — by purpose

**Build / framework configuration**

| File                 | One-liner                                                      |
| -------------------- | -------------------------------------------------------------- |
| `next.config.ts`     | Next 16 config: CSP, image domains, redirects, bundle analyzer |
| `next-env.d.ts`      | Generated Next.js TS shim (do not edit)                        |
| `tsconfig.json`      | TS strict mode + `@/*` path alias + noUncheckedIndexedAccess   |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin                                     |
| `vercel.json`        | Vercel deploy hints (regions, rewrites)                        |
| `components.json`    | shadcn/ui registry pointer (radix-nova style)                  |

**Lint / format / hooks**

| File                    | One-liner                                                |
| ----------------------- | -------------------------------------------------------- |
| `eslint.config.mjs`     | ESLint 9 flat config — strict rules, no `eslint-disable` |
| `prettier.config.mjs`   | Prettier 3 + `prettier-plugin-tailwindcss` (class sort)  |
| `.prettierignore`       | Skips `.next`, lockfile, generated `CHANGELOG.md`        |
| `.editorconfig`         | LF endings, 2-space indent, final newline                |
| `commitlint.config.mjs` | Conventional Commits enforcement (commit-msg hook)       |

**Testing**

| File                   | One-liner                                                |
| ---------------------- | -------------------------------------------------------- |
| `vitest.config.ts`     | Vitest 4 — jsdom for `.tsx`, node for `.ts`, alias `@/*` |
| `vitest.setup.ts`      | Testing Library matchers + cleanup                       |
| `playwright.config.ts` | Playwright — chromium + webkit, base URL from env        |

**Package management**

| File                | One-liner                                    |
| ------------------- | -------------------------------------------- |
| `package.json`      | Scripts + deps (exact pins for React + Next) |
| `package-lock.json` | npm lockfile (committed; never delete)       |
| `.npmrc`            | `engine-strict=true`, `save-exact=true`      |
| `.nvmrc`            | Node 22 (matches `engines.node`)             |

**Git / GitHub**

| File             | One-liner                                             |
| ---------------- | ----------------------------------------------------- |
| `.gitattributes` | LF normalization for text, binary mark for images     |
| `.gitignore`     | Standard Next/Node ignores + `.agent-cache/`, `.env*` |
| `LICENSE`        | MIT © Jailsom Nogueira                                |
| `CHANGELOG.md`   | Auto-generated by `npm run push`. **Do NOT edit.**    |

**AI agent hub + per-agent stubs**

| File             | One-liner                                                                |
| ---------------- | ------------------------------------------------------------------------ |
| `AGENTS.md`      | **Source of truth.** What every coding agent reads first.                |
| `CLAUDE.md`      | Claude Code stub — `@`-imports `AGENTS.md` + `qa-loop.md`                |
| `GEMINI.md`      | Compressed rules table for Gemini                                        |
| `CONVENTIONS.md` | 3-line stub for Aider — points to `AGENTS.md`                            |
| `README.md`      | This file — humans first, agents second                                  |
| `CONCEPTS.md`    | Concept explainers — start here if any term in `AGENTS.md` is unfamiliar |

**Per-agent / MCP config**

| File              | One-liner                                                      |
| ----------------- | -------------------------------------------------------------- |
| `.aider.conf.yml` | Tells Aider to auto-load `CONVENTIONS.md` + `AGENTS.md`        |
| `.clineignore`    | Files/folders Cline must not read (build output, lockfiles)    |
| `.mcp.json`       | Root MCP config (Claude Code, Codex CLI): Supabase RO + others |

**Environment**

| File           | One-liner                                                                       |
| -------------- | ------------------------------------------------------------------------------- |
| `.env.example` | Placeholder env vars. **Never commit real secrets here — use `your-key-here`.** |

### Root directories — by purpose

| Directory      | One-liner                                                                        |
| -------------- | -------------------------------------------------------------------------------- |
| `.agents/`     | Modular rules/references/workflows that `AGENTS.md` cross-links                  |
| `.claude/`     | Claude Code project slash commands (`/spec`, `/plan`, `/qa`, …)                  |
| `.clinerules/` | Cline base rules (kept minimal; main rules in `AGENTS.md`)                       |
| `.codex/`      | Codex Cloud sandbox bootstrap script                                             |
| `.cursor/`     | Cursor IDE `.mdc` rules + Cursor-specific MCP config                             |
| `.docs/`       | Technical/product docs, architecture diagrams, specs, templates                  |
| `.github/`     | CI workflows, issue templates, PR template, dependabot, CODEOWNERS               |
| `.husky/`      | Git hooks (`pre-commit`, `commit-msg`, `pre-push`)                               |
| `.plans/`      | Active implementation plans; archive completed plans under `.plans/archived/`    |
| `e2e/`         | Playwright end-to-end tests (`npm run test:e2e`)                                 |
| `emails/`      | react-email templates rendered by `npm run email:dev`                            |
| `messages/`    | next-intl translation bundles (`en.json` / `pt.json` / `es.json`)                |
| `scripts/`     | Project-level scripts (QA loop, changelog, type gen, prompt-context, fast tests) |
| `src/`         | Application source (App Router, components, lib, hooks, Supabase clients, i18n)  |
| `supabase/`    | Supabase CLI config + SQL migrations + `seed.sql`                                |

### Full ASCII tree

```
.
├── .agents/                                         — modular agent rules (cross-linked from AGENTS.md)
│   ├── rules/
│   │   ├── accessibility.md                         — WCAG 2.2 AA, focus, contrast, motion
│   │   ├── admin.md                                 — admin routes, role gates, service-role rules
│   │   ├── analytics.md                             — PostHog wrappers, event names, PII scrub
│   │   ├── clean-code.md                            — function size, naming, immutability
│   │   ├── error-handling.md                        — logger, error boundaries, catch blocks
│   │   ├── file-organization.md                     — naming, layout, path alias, types.ts
│   │   ├── forms.md                                 — react-hook-form + zod pattern
│   │   ├── i18n.md                                  — next-intl messages + locale routing
│   │   ├── lazy-loading.md                          — next/dynamic, Suspense, loading.tsx
│   │   ├── performance.md                           — Core Web Vitals, INP, bundle budget
│   │   ├── qa-loop.md                               — fix-until-green QA loop (iron rule)
│   │   ├── responsiveness.md                        — mobile-first, breakpoints, container queries
│   │   ├── security.md                              — 4-layer defense, env, RLS, CSP
│   │   ├── styling.md                               — Tailwind v4 tokens, cn(), dark mode
│   │   └── supabase.md                              — 4-client split, RLS, types
│   ├── references/
│   │   ├── analytics.md                             — event catalog
│   │   ├── key-files.md                             — map of important paths
│   │   └── shared-components.md                     — shadcn component inventory
│   └── workflows/
│       ├── multi-agent.md                           — handoff contracts between agents
│       ├── qa-loop.md                               — the fix-until-green procedure
│       └── self-review.md                           — judgment checklist before "done"
├── .claude/
│   └── commands/                                    — Claude Code project slash commands
│       ├── component.md                             — `/component` — scaffold a shadcn component
│       ├── migration.md                             — `/migration` — Supabase SQL migration
│       ├── plan.md                                  — `/plan <spec-path>` — write an impl plan
│       ├── prompt-context.md                        — `/prompt-context` — paste-ready snapshot
│       ├── qa.md                                    — `/qa` — run the QA-in-loop
│       └── spec.md                                  — `/spec` — write a feature spec
├── .clinerules/
│   └── 00-base.md                                   — Cline base rules (thin import of AGENTS.md)
├── .codex/
│   └── setup.sh                                     — Codex Cloud sandbox bootstrap
├── .cursor/
│   ├── mcp.json                                     — Cursor-specific MCP config (dup of .mcp.json)
│   └── rules/                                       — Cursor `.mdc` rules (Always/Auto/Manual)
│       ├── 00-base.mdc                              — always-applied baseline (no `any`, etc.)
│       ├── 10-nextjs.mdc                            — Next 16 App Router conventions
│       ├── 20-supabase.mdc                          — Supabase 4-client split + RLS
│       ├── 30-tests.mdc                             — Vitest + Playwright patterns
│       └── 40-a11y-i18n.mdc                         — a11y + i18n auto-attach on UI files
├── .docs/
│   ├── architecture.md                              — Mermaid flowchart + erDiagram + trust boundaries
│   ├── nextjs-conventions.md                        — Next 16 do/don't table
│   ├── README.md                                    — explains the .docs/ structure
│   ├── templates/
│   │   └── spec.md                                  — 90-line feature spec stencil
│   ├── architecture/                                — (empty — drop ADRs / diagrams here)
│   ├── decisions/                                   — (empty — ADRs)
│   ├── product/                                     — (empty — PRDs)
│   ├── runbooks/                                    — (empty — on-call runbooks)
│   └── specs/                                       — (empty — written specs land here)
├── .github/
│   ├── CODEOWNERS                                   — owner mapping for PR reviews
│   ├── dependabot.yml                               — weekly npm + GitHub Actions bumps
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                            — bug issue template
│   │   └── feature_request.md                       — feature issue template
│   ├── PULL_REQUEST_TEMPLATE.md                     — PR checklist
│   └── workflows/
│       ├── ci.yml                                   — runs `npm run qa` on PR + main
│       ├── e2e.yml                                  — Playwright on PR (with report artifact)
│       └── slack-release-notify.yml                 — Slack notify on push to main
├── .husky/
│   ├── commit-msg                                   — runs commitlint (Conventional Commits)
│   ├── pre-commit                                   — runs lint-staged (eslint + prettier)
│   └── pre-push                                     — typecheck + CHANGELOG_GENERATED guard
├── .plans/
│   ├── archived/                                    — completed plans (MOVE here, never delete)
│   ├── README.md                                    — explains the plan workflow
│   └── templates/
│       └── plan.md                                  — 92-line implementation plan stencil
├── e2e/
│   ├── fixtures/                                    — Playwright test fixtures
│   ├── global-setup.ts                              — global Playwright setup
│   └── tests/
│       ├── admin-gate.spec.ts                       — verifies admin gate redirects
│       └── smoke.spec.ts                            — homepage smoke test
├── emails/
│   └── welcome.tsx                                  — react-email template (preview via `npm run email:dev`)
├── messages/
│   ├── en.json                                      — English (en-us) translations (default)
│   ├── es.json                                      — Spanish (es-es) translations
│   └── pt.json                                      — Portuguese (pt-br) translations
├── scripts/
│   ├── check-bundle-budget.mjs                      — per-route First Load JS budget check
│   ├── check-env.ts                                 — manual env validation helper
│   ├── generate-changelog.ts                        — Carevia-style CHANGELOG generator (`npm run push`)
│   ├── generate-types.sh                            — Supabase type generation
│   ├── prompt-context.ts                            — paste-ready project snapshot for chat UIs
│   ├── qa-loop.sh                                   — the fix-until-green QA loop
│   └── test-agent.sh                                — fast test lane (changed files only)
├── src/
│   ├── app/                                         — App Router root
│   │   ├── [locale]/                                — locale-routed UI (en/pt/es)
│   │   │   ├── (admin)/admin/
│   │   │   │   ├── layout.tsx                       — role-gated server component (isAdmin())
│   │   │   │   ├── loading.tsx                      — route-level skeleton
│   │   │   │   ├── page.tsx                         — admin home
│   │   │   │   └── users/page.tsx                   — admin users list
│   │   │   ├── (auth)/
│   │   │   │   ├── callback/route.ts                — Supabase OAuth callback handler
│   │   │   │   ├── login/page.tsx                   — login form
│   │   │   │   └── signup/page.tsx                  — signup form
│   │   │   ├── (dashboard)/dashboard/page.tsx       — gated user dashboard
│   │   │   ├── layout.tsx                           — NextIntl + ThemeProvider + PostHog + Toaster
│   │   │   ├── loading.tsx                          — streaming skeleton
│   │   │   └── page.tsx                             — translated home (lazyClient demo)
│   │   ├── api/
│   │   │   └── health/route.ts                      — liveness probe
│   │   ├── globals.css                              — Tailwind v4 `@theme` tokens (light + dark)
│   │   ├── layout.tsx                               — minimal root `<html><body>`
│   │   ├── manifest.ts                              — web app manifest
│   │   ├── robots.ts                                — robots.txt
│   │   └── sitemap.ts                               — sitemap.xml
│   ├── components/
│   │   ├── lazy/
│   │   │   ├── heavy-chart-example.tsx              — demo of a lazy-loaded heavy component
│   │   │   └── README.md                            — lazy convention doc
│   │   ├── locale-switcher.tsx                      — DropdownMenu locale picker
│   │   ├── theme-provider.tsx                       — next-themes wrapper
│   │   ├── theme-toggle.tsx                         — light/dark/system toggle
│   │   └── ui/                                      — 16 shadcn radix-nova primitives
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── scroll-area.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       └── tooltip.tsx
│   ├── env.ts                                       — t3-env + zod boot-time env validation
│   ├── hooks/
│   │   └── use-supabase-user.ts                     — client hook returning the current user
│   ├── i18n/
│   │   ├── navigation.ts                            — Link/redirect/useRouter from createNavigation
│   │   ├── request.ts                               — server-side messages loader
│   │   └── routing.ts                               — defineRouting (en/pt/es, as-needed prefix)
│   ├── lib/
│   │   ├── analytics/
│   │   │   ├── event-names.ts                       — centralized event name enum
│   │   │   ├── events.ts                            — client `track()` wrapper
│   │   │   ├── events-server.ts                     — server `trackServer()` wrapper
│   │   │   ├── posthog-client.tsx                   — PostHogProvider, capture_performance: true
│   │   │   ├── posthog-server.ts                    — server singleton (server-only)
│   │   │   ├── scrub.ts                             — PII scrubber
│   │   │   └── scrub.test.ts                        — scrub unit test
│   │   ├── auth/
│   │   │   ├── get-user-role.ts                     — read `profiles.role`
│   │   │   ├── get-user.ts                          — current Supabase user
│   │   │   ├── is-admin.ts                          — boolean wrapper around get-user-role
│   │   │   └── is-admin.test.ts                     — is-admin unit test
│   │   ├── email/
│   │   │   ├── resend.ts                            — Resend client singleton (server-only)
│   │   │   └── templates/
│   │   │       └── welcome.tsx                      — react-email welcome template
│   │   ├── lazy.test.tsx                            — lazy helper test
│   │   ├── lazy.tsx                                 — `lazyClient<T>()` typed wrapper of next/dynamic
│   │   ├── logger/
│   │   │   └── logger.ts                            — pino structured logger
│   │   ├── perf/
│   │   │   └── start-transition-navigate.ts         — useTransitionRouter wraps router.push
│   │   ├── utils.test.ts                            — `cn()` test
│   │   └── utils.ts                                 — `cn()` helper (clsx + tailwind-merge)
│   ├── middleware.ts                                — next-intl + Supabase session + admin gate
│   ├── supabase/                                    — 4-client split
│   │   ├── client.ts                                — browser `createBrowserClient`
│   │   ├── database.types.ts                        — generated by `npm run db:types`
│   │   ├── middleware.ts                            — `updateSession` helper for proxy/middleware
│   │   ├── server-admin.ts                          — service-role (server-only)
│   │   └── server.ts                                — server `createClient` with cookies()
│   └── types/
│       └── database.ts                              — re-export from supabase/database.types
└── supabase/
    ├── config.toml                                  — local Supabase CLI config
    ├── migrations/
    │   └── 20260515003000_profiles_role.sql         — profiles + RLS + role-guard trigger
    └── seed.sql                                     — seed data (placeholder)
```

## How concepts connect

Use this map to jump from "this file confuses me" → the concept that explains it. Every concept
lives in [CONCEPTS.md](./CONCEPTS.md).

| You are looking at…                                                                             | Read CONCEPTS.md →                                     |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `AGENTS.md`, `.agents/*`, `CLAUDE.md`, `.cursor/rules/*`, `CONVENTIONS.md`, `.mcp.json`         | Agent hub & SSOT; .agents/; MCP                        |
| `src/supabase/*`, `supabase/migrations/*`                                                       | Supabase 4-client split; RLS                           |
| `src/middleware.ts`, eventual `src/proxy.ts` rename                                             | Middleware vs Proxy in Next 16                         |
| `src/env.ts`, `.env.example`                                                                    | Type-safe env validation                               |
| `src/i18n/*`, `messages/*`                                                                      | Internationalization                                   |
| `src/app/[locale]/(admin)/*`, `supabase/migrations/*profiles_role*`, `src/lib/auth/is-admin.ts` | Role-gated admin                                       |
| `src/lib/lazy.tsx`, `src/components/lazy/*`, `.agents/rules/lazy-loading.md`                    | Lazy loading                                           |
| `scripts/qa-loop.sh`, `.agents/rules/qa-loop.md`, `.agents/workflows/qa-loop.md`                | QA in loop (the iron rule)                             |
| `scripts/generate-changelog.ts`, `.husky/pre-push`, `npm run push`                              | Conventional Commits + Carevia changelog               |
| `scripts/prompt-context.ts`, `npm run pack`                                                     | Prompt context & repo snapshotting                     |
| `src/app/[locale]/*` (Server Components)                                                        | Server Components first                                |
| Any form action / mutation                                                                      | Server Actions + revalidatePath/Tag                    |
| `src/lib/analytics/*`, PostHog `capture_performance`                                            | Web Vitals                                             |
| `src/components/theme-provider.tsx`, `src/app/globals.css` `@theme` block                       | Theming                                                |
| Any `.tsx` with `className`                                                                     | Accessibility; Responsiveness                          |
| `eslint.config.mjs`                                                                             | ESLint flat config + tight rules                       |
| `vitest.config.ts`, `playwright.config.ts`, `scripts/test-agent.sh`                             | Testing strategy                                       |
| `.docs/templates/spec.md`, `.plans/templates/plan.md`                                           | Spec & Plan templates; spec→plan→implement→review loop |
| `.cursor/rules/*.mdc`                                                                           | Cursor rules                                           |
| `.claude/commands/*.md`                                                                         | Claude Code slash commands                             |
| `.husky/*`                                                                                      | Husky hooks                                            |

## Scripts

| Script                                     | Purpose                                                  |
| ------------------------------------------ | -------------------------------------------------------- |
| `dev`                                      | Next dev server (Turbopack)                              |
| `build`                                    | Production build                                         |
| `start`                                    | Run prod build                                           |
| `lint` / `lint:fix`                        | ESLint flat config                                       |
| `typecheck`                                | `tsc --noEmit`                                           |
| `format` / `format:check`                  | Prettier                                                 |
| `check`                                    | lint + typecheck + format:check                          |
| `ci-check`                                 | check + test + build                                     |
| `qa` / `qa:strict` / `qa:quiet`            | Fix-until-green QA loop (full deterministic gate)        |
| `test`                                     | Vitest run (all tests)                                   |
| `test:agent`                               | **Agent fast lane** — vitest on changed files only       |
| `test:watch` / `test:ui` / `test:coverage` | Vitest variants                                          |
| `test:e2e` / `test:e2e:ui`                 | Playwright                                               |
| `prompt:context`                           | Print a paste-ready project snapshot for chat-UI LLMs    |
| `pack`                                     | Build a single repomix XML at `.agent-cache/repomix.xml` |
| `db:types`                                 | Generate Supabase types                                  |
| `email:dev`                                | react-email preview server                               |
| `push`                                     | Generate CHANGELOG + push                                |
| `prepare`                                  | Husky install                                            |

**Fast lane vs. full lane:** use `test:agent` during inner-loop iteration (vitest --changed, dot
reporter, no coverage). Use `qa` as the definition-of-done gate — it runs every check in
cheapest-first order and stops at the first failure.

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

**QA-in-loop:** run `npm run qa` to execute every gate (format/lint/typecheck/test/build) in
cheapest-first order. Stops at the first failing gate. Iterate until exit 0 — that's the definition
of done. CI runs the same script. Strict mode (`npm run qa:strict`) also runs e2e + bundle budget;
use before opening a PR. See `.agents/rules/qa-loop.md` for the protocol and
`.agents/workflows/qa-loop.md` for the procedure.

- **ESLint 9** flat config — extends `next/core-web-vitals`, `next/typescript`, plus tailwindcss +
  eslint-comments. Bans `any`, `console.log`, deep relatives.
- **Prettier 3** with `prettier-plugin-tailwindcss` for class sorting.
- **Husky 9** hooks:
  - `pre-commit` → `lint-staged` (eslint + prettier on changed files)
  - `commit-msg` → `commitlint` (Conventional Commits)
  - `pre-push` → `typecheck` + blocks direct push unless `CHANGELOG_GENERATED=1`
- **lint-staged** — only formats/lints staged files for speed.
- **Carevia-style CHANGELOG** — `npm run push` runs `scripts/generate-changelog.ts`, which bumps the
  patch version, prepends a dated block to `CHANGELOG.md`, commits, and pushes with
  `CHANGELOG_GENERATED=1`. Do not edit `CHANGELOG.md` by hand.

## Internationalization

Three locales out of the box via **next-intl v4**:

| Code | Language           | URL prefix     |
| ---- | ------------------ | -------------- |
| `en` | English (en-us)    | none (default) |
| `pt` | Portuguese (pt-br) | `/pt`          |
| `es` | Spanish (es-es)    | `/es`          |

`localePrefix: "as-needed"` keeps the default locale at root. Messages live in
`messages/{en,pt,es}.json`. Routing helpers are exported from `@/i18n/navigation` — always import
`Link`, `redirect`, `useRouter`, etc. from there.

To add a locale: add the code to `src/i18n/routing.ts`, drop `messages/<code>.json`, add a label
under `locale.<code>` in all bundles.

See `.agents/rules/i18n.md` for the full rule sheet.

## Admin panel

The admin panel lives at `src/app/[locale]/(admin)/admin/` and is gated by
`public.profiles.role = 'admin'`.

- **Migration:** `supabase/migrations/20260515003000_profiles_role.sql` creates the table, RLS
  policies, a guard trigger that blocks non-admin role changes, and a `handle_new_user` trigger that
  auto-creates a profile row.
- **Gate (defense in depth):** the middleware redirects non-admins, and the layout calls `isAdmin()`
  on the server to double-check.
- **Make a user admin (dev):** `update public.profiles set role = 'admin' where id = '<uuid>';`

See `.agents/rules/admin.md` for the full rule sheet.

## Plans and docs

- `.plans/` — active plans (`YYYY-MM-DD-slug.md`).
- `.plans/archived/` — move completed/superseded plans here (don't delete).
- `.docs/` — technical and product docs. Suggested subfolders: `architecture/`, `runbooks/`,
  `decisions/`, `product/`.

## CI/CD

`.github/workflows/`:

- `ci.yml` — lint, typecheck, build, test on PR + main push
- `e2e.yml` — Playwright on PR with report artifact
- `slack-release-notify.yml` — posts version + recent commits to Slack on push to `main` (no-op when
  `SLACK_WEBHOOK_URL` secret is unset)

Recommended branch protection: require `ci`, require linear history, require signed commits if you
can.

## Deployment

Built for Vercel. After `vercel link`:

1. Add all env vars from `.env.example` to the Vercel project (Production + Preview).
2. Push to `main` via `npm run push` → auto-deploy + Slack notify (if `SLACK_WEBHOOK_URL` is set).

Other platforms (Fly, Railway) work — just provide Node 22 and the env vars.

## AI Agents

This repo is agent-friendly:

- `AGENTS.md` — primary instructions hub (read first)
- `CONCEPTS.md` — concept explainers (read if any term is unfamiliar)
- `CLAUDE.md` — Claude Code-specific stub (`@`-imports AGENTS.md + qa-loop.md)
- `GEMINI.md` — compressed rules for Gemini
- `.agents/rules/` — per-domain conventions (styling, security, supabase, etc.)
- `.agents/references/` — file maps + component inventory
- `.agents/workflows/` — checklists and handoff contracts
- `.cursor/rules/*.mdc` — Cursor IDE auto-attaching rules
- `.cursor/mcp.json` — Cursor MCP server config
- `.claude/commands/*.md` — Claude Code slash commands (`/spec`, `/plan`, `/qa`, `/prompt-context`,
  `/migration`, `/component`)
- `.clinerules/00-base.md` + `.clineignore` — Cline rules + context exclusions
- `.aider.conf.yml` + `CONVENTIONS.md` — Aider auto-reads AGENTS.md
- `.codex/setup.sh` — Codex Cloud sandbox bootstrap

### MCP servers

`.mcp.json` (and a duplicate `.cursor/mcp.json` for Cursor) wires three MCP servers:

| Server       | What it does                                                       |
| ------------ | ------------------------------------------------------------------ |
| `supabase`   | Inspect schema, run RO queries on your linked Supabase project     |
| `playwright` | Drive a real browser for e2e / visual checks from inside the agent |
| `context7`   | Pull up-to-date library docs by request                            |

The Supabase server starts in `--read-only` mode. To enable write mode locally, edit `.mcp.json` and
remove `--read-only` — do NOT commit that change. Set `SUPABASE_ACCESS_TOKEN` in your environment
first (`https://supabase.com/dashboard/account/tokens`).

Both `.mcp.json` (Claude Code, Codex CLI, etc.) and `.cursor/mcp.json` (Cursor) exist for cross-tool
compatibility — they hold the same JSON.

### Specs and plans

- Feature spec template: `.docs/templates/spec.md` → write to `.docs/specs/<YYYY-MM-DD>-<slug>.md`.
  Use the `/spec` slash command in Claude Code.
- Implementation plan template: `.plans/templates/plan.md` → write to
  `.plans/<YYYY-MM-DD>-<slug>.md`. Use the `/plan <spec-path>` slash command. Move completed plans
  to `.plans/archived/`.

## License

MIT © Jailsom Nogueira
