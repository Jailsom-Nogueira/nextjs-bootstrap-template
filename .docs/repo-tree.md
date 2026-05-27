# Repo tree (full)

Annotated ASCII tree of every tracked file and directory, with a one-line purpose. Kept separate from the README so the top-level pitch stays scannable.

The directory map with conventions (when to add a README, when to add a sync gate, what counts as a thin adapter) lives in [`/.agents/references/repo-structure.md`](../.agents/references/repo-structure.md). Read that first if you are adding new directories or per-tool adapters.

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
│   │   ├── artifact-layers.md                       — artifact taxonomy + task inference
│   │   ├── key-files.md                             — map of important paths
│   │   ├── repo-structure.md                        — meta-rules for agent-facing directories
│   │   └── shared-components.md                     — shadcn component inventory
│   ├── skills/
│   │   └── agent-browser/SKILL.md                   — universal agent-browser skill installed via npx skills
│   └── workflows/
│       ├── multi-agent.md                           — handoff contracts between agents
│       ├── qa-loop.md                               — the fix-until-green procedure
│       └── self-review.md                           — judgment checklist before "done"
├── .claude/
│   └── commands/                                    — Claude Code project slash commands
│       ├── component.md                             — `/component` — scaffold a shadcn component
│       ├── migration.md                             — `/migration` — Supabase SQL migration
│       ├── plan.md                                  — `/plan <spec-path>` — write an HTML impl plan
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
│   ├── assets/                                      — README screenshots and rendered diagrams
│   ├── nextjs-conventions.md                        — Next 16 do/don't table
│   ├── README.md                                    — explains the .docs/ structure
│   ├── repo-tree.md                                 — this file
│   ├── templates/
│   │   └── spec.md                                  — 90-line feature spec stencil
│   ├── architecture/                                — (empty — drop ADRs / diagrams here)
│   ├── decisions/                                   — (empty — ADRs)
│   ├── product/                                     — (empty — PRDs)
│   ├── runbooks/                                    — (empty — on-call runbooks)
│   └── specs/                                       — (empty — written specs land here)
├── .github/
│   ├── INDEX.md                                     — directory index (renamed from README.md so GitHub uses the root README)
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
│       └── plan.html                                — standalone HTML/CSS implementation plan stencil
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
│   ├── check-mcp-sync.mjs                           — fail build if .mcp.json and .cursor/mcp.json drift
│   ├── check-plan-format.mjs                        — enforce standalone HTML/CSS implementation plans
│   ├── check-text-hygiene.mjs                       — reject decorative emoji in tracked text
│   ├── generate-changelog.ts                        — generated CHANGELOG flow (`npm run push`)
│   ├── generate-types.sh                            — Supabase type generation
│   ├── prompt-context.ts                            — paste-ready project snapshot for chat UIs
│   ├── qa-loop.sh                                   — the fix-until-green QA loop
│   ├── qa-visual-runner.sh                          — boots dev server and runs visual QA
│   ├── test-agent.sh                                — fast test lane (changed files only)
│   └── visual-qa.ts                                 — Playwright + axe + screenshot sweep
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
│   │   │   ├── about/page.tsx                       — public template overview
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
│   │   ├── copy-button.tsx                          — clipboard copy with aria-live feedback
│   │   ├── html-lang-sync.tsx                       — keeps <html lang> in sync with active locale
│   │   ├── lazy/
│   │   │   ├── heavy-chart-example.tsx              — demo of a lazy-loaded heavy component
│   │   │   └── README.md                            — lazy convention doc
│   │   ├── locale-switcher.tsx                      — segmented control (en/pt/es)
│   │   ├── site-footer.tsx                          — site footer
│   │   ├── site-header.tsx                          — site header (brand, nav, toggles)
│   │   ├── theme-provider.tsx                       — next-themes wrapper
│   │   ├── theme-toggle.tsx                         — light/dark toggle
│   │   └── ui/                                      — 17 shadcn radix-nova primitives
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
│   ├── config/
│   │   └── site.ts                                  — static site config (repo URL, etc.)
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
│   ├── proxy.ts                                     — next-intl + Supabase session + admin gate
│   ├── supabase/                                    — browser/server/admin client split
│   │   ├── client.ts                                — browser `createBrowserClient`
│   │   ├── database.types.ts                        — generated by `npm run db:types`
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
