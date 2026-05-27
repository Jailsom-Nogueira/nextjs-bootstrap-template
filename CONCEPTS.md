# CONCEPTS.md

This document explains every concept, tool, and pattern applied to this template.
It is written for developers who are new to one or more of these tools — including
people who collaborate with AI through chat and may not yet have hands-on
experience with `AGENTS.md`, MCP, RLS, Server Components, or the rest of the
stack. Each section is short and skim-friendly: read the ones you need.

If you came here from `README.md` or `AGENTS.md`, you can read this file
top-to-bottom in about 20 minutes or jump to a specific section via the table of
contents.

> Keep this file the long-form teaching doc. Do **not** dump explanations into
> `AGENTS.md` or the `.agents/rules/*` files — those must stay terse so AI agents
> don't skim past their invariants. Long prose belongs here.

---

## Table of contents

1. [AGENTS.md and the agent hub (SSOT)](#1-agentsmd-and-the-agent-hub-ssot)
2. [`.agents/` modular rules](#2-agents-modular-rules)
3. [The QA-in-loop iron rule](#3-the-qa-in-loop-iron-rule)
4. [Conventional Commits + generated CHANGELOG](#4-conventional-commits--generated-changelog)
5. [Husky Git hooks](#5-husky-git-hooks)
6. [MCP (Model Context Protocol)](#6-mcp-model-context-protocol)
7. [Cursor rules (`.cursor/rules/*.mdc`)](#7-cursor-rules-cursorrulesmdc)
8. [Claude Code slash commands (`.claude/commands/`)](#8-claude-code-slash-commands-claudecommands)
9. [The spec → plan → implement → review loop](#9-the-spec--plan--implement--review-loop)
10. [Type-safe env validation (`src/env.ts`)](#10-type-safe-env-validation-srcenvts)
11. [Supabase 4-client split](#11-supabase-4-client-split)
12. [Row-Level Security (RLS)](#12-row-level-security-rls)
13. [Role-gated admin panel](#13-role-gated-admin-panel)
14. [Server Components first (Next.js App Router)](#14-server-components-first-nextjs-app-router)
15. [Server Actions + `revalidatePath/Tag`](#15-server-actions--revalidatepathtag)
16. [`proxy.ts` (Next 16 request proxy)](#16-proxyts-next-16-request-proxy)
17. [Performance + Core Web Vitals](#17-performance--core-web-vitals)
18. [Lazy loading](#18-lazy-loading)
19. [Internationalization (next-intl, en/pt/es)](#19-internationalization-next-intl-enptes)
20. [Theming (next-themes, light/dark/system)](#20-theming-next-themes-lightdarksystem)
21. [Accessibility (WCAG 2.2 AA)](#21-accessibility-wcag-22-aa)
22. [Responsiveness (mobile-first)](#22-responsiveness-mobile-first)
23. [ESLint flat config + tightened rules](#23-eslint-flat-config--tightened-rules)
24. [Prompt context & repo snapshotting](#24-prompt-context--repo-snapshotting)
25. [Testing strategy (vitest + Playwright + fast lane)](#25-testing-strategy-vitest--playwright--fast-lane)
26. [Spec & Plan templates](#26-spec--plan-templates)
27. [Artifact layers and task inference](#27-artifact-layers-and-task-inference)

---

## 1. AGENTS.md and the agent hub (SSOT)

**What it is.** `AGENTS.md` at the repo root is the single source of truth (SSOT)
for AI coding agents — Claude Code, Cursor, Codex, Aider, Cline, Devin, Gemini,
and any future tool that follows the [agents.md](https://agents.md) convention.
It is a terse routing hub: it points to the source files for stack details,
non-negotiable invariants, task classification, artifact layers, QA, and deeper
rule files instead of duplicating all of that content inline.

**Why this project uses it.** Without an SSOT, every agent reads slightly
different instructions, drifts in different directions, and produces
inconsistent code. One canonical file means one set of invariants.

**Where it lives.** `AGENTS.md` (root). Per-agent files are **thin stubs that
point at AGENTS.md**: `CLAUDE.md`, `GEMINI.md`, `CONVENTIONS.md`,
`.cursor/rules/00-base.mdc`, `.clinerules/00-base.md`.

**How to use it.**

- Keep it under ~200 lines. Beyond that, agents skim and miss the routing decisions.
- Use short tables/lists for routing and hard invariants; keep detailed do/don't examples in `.agents/rules/*`.
- Cross-link to `.agents/rules/*.md` instead of inlining detail.
- Update it when an invariant changes; never silently let practice drift.
- Per-agent files (`CLAUDE.md`, `.cursor/rules/00-base.mdc`, etc.) should
  `@import` or restate only the bare minimum.

**Common mistakes.**

- Bloating it past 400 lines — agents stop reading carefully.
- Putting long explanations inside it (those belong here, in `CONCEPTS.md`).
- Letting per-agent files contradict it (e.g. Cursor rule says spaces,
  AGENTS.md says tabs).
- Tracking daily task notes / changelog-style updates inside it.
- Adding "soft" rules that nobody enforces ("try to keep things clean") —
  every rule should be checkable.

**How to extend it.**

- New invariant → add it to the AGENTS.md invariant list and keep the detailed rule in the dedicated `.agents/rules/*` file.
- New tool category → add a row in the task-type index.
- New deep rule → create `.agents/rules/<topic>.md` and link from AGENTS.md.

**Reference.** [agents.md spec](https://agents.md)

---

## 2. `.agents/` modular rules

**What it is.** The `.agents/` directory contains modular rule files
(`rules/`), reference material (`references/`), and workflow descriptions
(`workflows/`). AGENTS.md is the hub; `.agents/` holds the deep content.

**Why this project uses it.** A single 5000-line rules file blows past every
agent's effective attention budget. Splitting by domain (`styling.md`,
`security.md`, `supabase.md`, etc.) means the agent loads only what's relevant
to the current task.

**Where it lives.** `.agents/rules/*.md`, `.agents/references/*.md`,
`.agents/workflows/*.md`.

**How to use it.**

- One concern per file. `styling.md` does not talk about authentication.
- Cap each file at ~150 lines. If you cross 200, split it.
- The AGENTS.md task-type index maps task types → rules to load.
- Reference rule files by exact path (`.agents/rules/forms.md`) in code reviews,
  PR descriptions, and slash commands.

**Common mistakes.**

- Duplicating content across two rule files — pick one canonical location.
- Writing rules nobody enforces (lint / CI / hooks should back every rule).
- Letting rule files outlive the practice — review them when refactoring.

**How to extend it.**

- New domain → add `.agents/rules/<topic>.md`, register it in the AGENTS.md
  task router and rule catalog.
- New runbook → add to `.agents/workflows/`.

---

## 3. The QA-in-loop iron rule

**What it is.** `npm run qa` runs every quality gate in cheapest-first order
(format:check → text-hygiene → plan-format → mcp-sync → lint → typecheck → test → build), stops at the **first** failing
gate, prints a clear delimited failure block, and exits non-zero. You (or the
agent) fix the root cause, re-run, repeat until exit 0. That is the definition
of "done".

**Why this project uses it.** AI agents and humans alike will declare work
complete before checking everything. A deterministic, scripted loop removes the
"I think it works" failure mode and aligns local development with CI.

**Where it lives.**

- `scripts/qa-loop.sh` — the script.
- `.agents/rules/qa-loop.md` — the iron rule and anti-pattern list.
- `.agents/workflows/qa-loop.md` — the procedure (with iteration cap and
  escalation path).
- `.github/workflows/ci.yml` — calls `npm run qa` so CI and local match.

**How to use it.**

- After every change, run `npm run qa`.
- Read the first failing gate's output block. Understand the cause.
- Apply the **minimal root-cause fix**. Re-run.
- Hard cap: 10 iterations per task. If you blow the cap, write
  `.plans/YYYY-MM-DD-qa-blocker-<slug>.html` documenting what you tried and stop.
- `npm run qa:strict` adds e2e + bundle-budget + visual QA for pre-PR / pre-release.
- `npm run qa:quiet` only prints failures (good for tight agent loops).

**Common mistakes (these are explicitly banned).**

- Adding `// eslint-disable-next-line` to silence a rule. The project bans it
  via `eslint-comments/no-use`.
- Casting to `any` to make TypeScript happy. The project bans `any` outright.
- Adding `.skip()` or `.todo()` to a failing test. Fix the code, not the test.
- Using `@ts-expect-error` without a 10+ character justification.
- `git commit --no-verify` to bypass the pre-commit hook. Only `npm run push`
  uses `--no-verify`, and that's for the changelog commit only.
- Lowering the bundle budget to fit a regression. Fix the regression instead.
- Marking a test as flaky and moving on. Fix the flake.

**How to extend it.**

- Add a new gate by editing `scripts/qa-loop.sh`. Put it in the right
  cheapest-first slot.
- Update `.agents/rules/qa-loop.md` whenever the gate list changes.

---

## 4. Conventional Commits + generated CHANGELOG

**What it is.** Every commit message follows the
[Conventional Commits](https://www.conventionalcommits.org) spec: `type(scope): subject`
where type is one of `feat | fix | chore | docs | refactor | test | perf | ci | build | style`.
`commitlint` enforces this on every commit. `CHANGELOG.md` is auto-generated by
`scripts/generate-changelog.ts` (a generated changelog flow: bumps patch
version, prepends a dated block of new commits since the upstream branch).

**Why this project uses it.** Conventional Commits give the changelog
generator something deterministic to parse. This direct generated-changelog
flow is simpler than `changesets` for app templates, solo projects, and
small-team projects, while still creating a human-readable log of every push.

**Where it lives.**

- `commitlint.config.mjs` — extends `@commitlint/config-conventional`.
- `.husky/commit-msg` — runs commitlint on every commit message.
- `scripts/generate-changelog.ts` — the generator.
- `.husky/pre-push` — blocks `git push` unless `CHANGELOG_GENERATED=1`.
- `npm run push` — the safe push: regenerates the changelog, commits it, sets
  the env flag, pushes.

**How to use it.**

- Write commit subjects like `feat(auth): add Supabase OAuth callback` or
  `fix(admin): redirect non-admins from /admin`.
- Push via `npm run push`, never plain `git push`. The pre-push hook will
  refuse plain `git push`.
- The generator bumps the patch version automatically — don't edit
  `package.json` version by hand.

**Common mistakes.**

- Editing `CHANGELOG.md` manually. Don't. The generator will conflict with
  your edits.
- Writing non-conventional subjects (`updated stuff`, `fixes`, `wip`).
  commitlint will reject them.
- Bypassing the pre-push hook with `git push --no-verify`. The hook exists
  because a previous project had a 16-day production outage caused by exactly
  this.
- Bumping the version manually in `package.json` — the script does it.

**How to extend it.**

- New commit type (e.g. `agent` for AI-generated commits) → register in
  `commitlint.config.mjs`.
- Custom changelog formatting → edit `scripts/generate-changelog.ts`.

**Reference.** [Conventional Commits](https://www.conventionalcommits.org)

---

## 5. Husky Git hooks

**What it is.** [Husky](https://typicode.github.io/husky) runs scripts at Git
lifecycle events. This project uses three hooks:

- **pre-commit** → `npx lint-staged` (lints/formats only the staged files)
- **commit-msg** → `npx commitlint --edit "$1"` (validates the message)
- **pre-push** → runs `npm run typecheck` AND blocks plain `git push` unless
  `CHANGELOG_GENERATED=1` is set (which only `npm run push` does)

**Why this project uses it.** Hooks catch issues before they reach CI, saving
round-trip time. The pre-push block specifically prevents the "I forgot to
update the changelog" class of mistake.

**Where it lives.** `.husky/{pre-commit,commit-msg,pre-push}`.

**How to use it.**

- Hooks run automatically. You shouldn't have to invoke them.
- For installation: `npm install` runs `prepare: husky` which sets them up.
- If a hook fails, **read the output** — it tells you exactly what's wrong.

**Common mistakes.**

- `HUSKY=0 git commit` or `git push --no-verify` to bypass a hook. Only the
  `npm run push` script is allowed to use `--no-verify`, and only for the
  CHANGELOG commit.
- Editing a hook without updating `AGENTS.md` and this file.
- Adding heavy work to pre-commit. Keep it fast (<5s). Heavy work belongs in
  pre-push or CI.

**How to extend it.**

- New hook: `npx husky add .husky/<hook-name> "<command>"`.
- Add to lint-staged config in `package.json` to extend pre-commit behavior.

---

## 6. MCP (Model Context Protocol)

**What it is.** MCP is an open standard from Anthropic that lets AI agents
connect to external tools and data sources through a standardized server
protocol. Think of it as "USB-C for AI tools": one cable, many devices.
[modelcontextprotocol.io](https://modelcontextprotocol.io)

**Why this project uses it.** Configuring MCP servers per-repo lets agents in
Claude Code, Codex CLI, Cursor, and other compatible tools query the project's
Supabase schema, run Playwright tests against a browser, and pull up-to-date
docs without leaving the editor.

**Where it lives.**

- `.mcp.json` — root MCP config (read by Claude Code and Codex CLI).
- `.cursor/mcp.json` — Cursor uses this path specifically.

**Configured servers.**

- **Supabase** (`@supabase/mcp-server-supabase` with `--read-only`) — schema
  introspection, table listing, RLS policy inspection. Token comes from
  `${SUPABASE_ACCESS_TOKEN}` in your shell env.
- **Playwright** (`@playwright/mcp`) — browser automation; pairs with the
  existing Playwright e2e setup.
- **Context7** (`@upstash/context7-mcp`) — fetches current Next.js / React /
  Supabase docs to reduce hallucinations on newer APIs.

**How to use it.**

- Set `SUPABASE_ACCESS_TOKEN` in your shell (`export SUPABASE_ACCESS_TOKEN=...`).
  Get one at <https://supabase.com/dashboard/account/tokens>.
- Open the project in Claude Code, Cursor, or Codex CLI — MCP servers auto-load.
- To enable Supabase **write** mode locally (rare), edit `.mcp.json` and remove
  `--read-only`. **Do not commit** that change.

**Common mistakes.**

- Inlining secrets in `.mcp.json` (`"SUPABASE_ACCESS_TOKEN": "sb_xxx..."`). Use
  `${VAR}` interpolation only — values pulled from the shell env.
- Committing a write-enabled Supabase MCP. RLS does not save you from a
  service-role token leak.
- Adding a filesystem MCP server. Agents already have file tools; it expands
  the attack surface and rarely helps.
- Forgetting that MCP servers are launched via `npx` — the first run takes a
  few seconds.

**How to extend it.**

- New MCP server → add an entry to `.mcp.json` (and `.cursor/mcp.json` for
  Cursor parity). Use env-var interpolation for any credential.
- Document the new server in `README.md` under "MCP servers".

**Reference.** [Model Context Protocol](https://modelcontextprotocol.io) ·
[Supabase MCP](https://github.com/supabase-community/supabase-mcp)

---

## 7. Cursor rules (`.cursor/rules/*.mdc`)

**What it is.** Cursor (the IDE) reads rule files with YAML frontmatter and
markdown bodies from `.cursor/rules/`. Rules have three scopes:

- **Always** (`alwaysApply: true`) — included in every prompt.
- **Auto** (`alwaysApply: false` + `description` and/or `globs`) — auto-attached
  when files matching the globs are in context, or when the description matches.
- **Manual** (no description, no globs) — only included when the user
  @-references the rule.

**Why this project uses it.** Splitting rules by scope keeps the prompt small
(only relevant rules attach) while still enforcing project-wide invariants.

**Where it lives.** `.cursor/rules/`:

- `00-base.mdc` — Always. Restates AGENTS.md essentials.
- `10-nextjs.mdc` — Auto, globs `src/app/**`, `src/components/**`.
- `20-supabase.mdc` — Auto, globs `src/supabase/**`, `supabase/migrations/**`.
- `30-tests.mdc` — Auto, globs `**/*.test.*`, `e2e/**`.
- `40-a11y-i18n.mdc` — Auto via description (UI / translation work).

**How to use it.**

- Keep each `.mdc` file under ~80 lines.
- Use `alwaysApply: true` sparingly — only for genuinely universal rules.
- Cross-link to `.agents/rules/*.md` for depth; don't duplicate.

**Common mistakes.**

- Marking every rule `alwaysApply: true` — context fills up and Cursor skims.
- Writing 500-line rule bodies — Cursor will skim them.
- Letting `.cursor/rules/` contradict `AGENTS.md`. AGENTS.md is the SSOT.

**How to extend it.**

- New domain rule → add `.cursor/rules/<NN-domain>.mdc` with appropriate
  scope, plus matching content in `.agents/rules/<domain>.md`.

**Reference.** [Cursor rules](https://docs.cursor.com/context/rules-for-ai)

---

## 8. Claude Code slash commands (`.claude/commands/`)

**What it is.** Claude Code supports per-project slash commands defined as
markdown prompt templates in `.claude/commands/`. Invoking `/spec` in the IDE
runs the prompt in `.claude/commands/spec.md`.

**Why this project uses it.** Slash commands codify the recurring workflows
(write a spec, write a plan, run QA loop, scaffold a component) so they're
fast and consistent.

**Where it lives.** `.claude/commands/`:

- `/spec` → write a spec at `.docs/specs/<date>-<slug>.md`.
- `/plan` → convert a spec into an implementation plan at `.plans/...`.
- `/qa` → run the QA loop, fix the first failing gate, repeat.
- `/migration` → scaffold a Supabase migration with RLS + idempotent guards.
- `/component` → scaffold a component with i18n + a11y + types extracted.
- `/prompt-context` → emit the paste-ready project snapshot.

**How to use it.**

- In Claude Code, type `/spec` (or any command name) and follow the prompt.
- Each command typically asks for confirmation before writing files.
- Use `/spec` → `/plan` → implement → `/qa` as the standard flow.

**Common mistakes.**

- Skipping `/spec` and `/plan` and going straight to implementation. The
  spec/plan files exist so a reviewer can approve the approach before any
  code is written.
- Mixing implementation prompts into a spec — specs describe **what**, plans
  describe **how**.
- Writing slash commands that don't reference the rule files. Every command
  should point at relevant `.agents/rules/*.md`.

**How to extend it.**

- New command → add `.claude/commands/<name>.md`. Keep it 20–40 lines.
- Mention in `AGENTS.md` "Cross-agent surface" if it's a major addition.

**Reference.** [Claude Code slash commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands)

---

## 9. The spec → plan → implement → review loop

**What it is.** Four phases for any non-trivial change:

1. **SPEC** (`.docs/specs/<date>-<slug>.md`) — what we're building, who for,
   acceptance criteria. Human-edited.
2. **PLAN** (`.plans/<date>-<slug>.html`) — standalone HTML/CSS file-level decomposition, slices,
   tests, risks. Agent-drafted, human-approved, and easy to read in a browser.
3. **IMPLEMENT** — actual code. Run `/qa` until exit 0.
4. **REVIEW** — separate pass (another agent, a human, or both) before merge.

**Why this project uses it.** Skipping the spec or the plan is the single
biggest source of "agent wrote the wrong thing" failures. Both phases force
articulation of what done looks like, before any code is touched.

**Where it lives.**

- `.docs/templates/spec.md` — the spec stencil.
- `.plans/templates/plan.html` — the standalone HTML/CSS plan stencil.
- `.docs/specs/` — active and shipped specs.
- `.plans/` — active plans. Move to `.plans/archived/` when superseded.

**How to use it.**

- Start with `/spec`. Fill in goal, non-goals, user stories, data model
  changes, API surface, UI surface, edge cases, acceptance criteria, open
  questions.
- Get human sign-off on the spec.
- Run `/plan` against the approved spec. Review the plan slice-by-slice.
- Implement one slice at a time. Run `npm run qa` after each.
- Review (human or separate agent) before merging.

**Common mistakes.**

- Skipping the spec because "this is small". Small specs are short, not
  absent.
- Plans without testable acceptance criteria — agents will happily implement
  the wrong thing.
- Implementing all slices in one giant change. One slice at a time.
- Deleting a plan when work is done. Move it to `.plans/archived/` — the
  history is valuable.

**How to extend it.**

- The templates evolve. If a section is consistently empty across plans,
  remove it. If a section is consistently added by hand, formalize it in the
  template.

---

## 10. Type-safe env validation (`src/env.ts`)

**What it is.** `src/env.ts` uses
[`@t3-oss/env-nextjs`](https://env.t3.gg) + [Zod](https://zod.dev) to validate
environment variables at **boot time**. If a required variable is missing or
malformed, the build fails immediately — never silently at runtime three hours
into production.

**Why this project uses it.** "Missing env var crashed prod after deploy" is
the most common production-readiness failure. Validating at boot, with types,
makes it impossible to ship without the right variables.

**Where it lives.** `src/env.ts`. Consumed everywhere via
`import { env } from "@/env"`.

**How to use it.**

- Add a new variable: declare it in `src/env.ts` with a Zod validator
  (`z.string().url()`, `z.email()`, `z.string().regex(...)`).
- Mark it `server` (server-only) or `client` (must start with
  `NEXT_PUBLIC_`).
- Reference it in code as `env.MY_VAR` — typed, validated, no `process.env`.
- Update `.env.example` with a placeholder value.

**Common mistakes.**

- Using `process.env.X!` (non-null assertion) anywhere outside `src/env.ts`.
  Defeats the validation.
- Putting real secret values in `.env.example`. Use placeholders like
  `your-supabase-anon-key-here`. The file is committed.
- Forgetting to update `src/env.ts` when adding a variable. The build won't
  fail today; it will fail when deployed without the variable.
- Tightening a regex on a variable that some existing deployment doesn't
  satisfy — coordinate before tightening.

**How to extend it.**

- New env var → add to `src/env.ts` (validator) and `.env.example`
  (placeholder).

**Reference.** [@t3-oss/env-nextjs](https://env.t3.gg) · [Zod](https://zod.dev)

---

## 11. Supabase 4-client split

**What it is.** Four separate Supabase client factories, each with a single
purpose. Do not mix them up.

- `src/supabase/client.ts` — **browser client**. Anon key. Runs in `'use client'`
  components.
- `src/supabase/server.ts` — **server client**. Anon key. Reads cookies via
  `cookies()`. Used in Server Components, Route Handlers, and Server Actions.
- `src/supabase/server-admin.ts` — **service-role client**. Bypasses RLS.
  `import "server-only"` at the top — Next.js will fail the build if this
  file ever ends up in a client bundle.
- `src/proxy.ts` — **request proxy** for locale routing, Supabase session refresh, and route gates.

**Why this project uses it.** Each context has different security
constraints. The service-role key bypasses Row-Level Security; if it reaches
the browser, every user has admin access to your DB. Separating the clients
makes "this file talks to the database with admin powers" obvious.

**How to use it.**

- Need data in a Server Component? `import { createClient } from "@/supabase/server"`.
- Need data in a client component? `import { supabase } from "@/supabase/client"`.
- Need to do something the user shouldn't be allowed to do (admin task,
  webhook ingest)? `import { createAdminClient } from "@/supabase/server-admin"`.
- Always prefer the regular server client + RLS. Service-role is a last
  resort.

**Common mistakes.**

- Importing `server-admin.ts` into a `'use client'` component. Build will
  fail with "you cannot import server-only into a client component" — fix the
  call site, never delete the `server-only` import.
- Using `server-admin.ts` because "the user kept getting permission errors".
  That means the RLS policy is wrong, not that you should bypass RLS.
- Creating a 5th custom client to "share auth state". Don't. Use the existing
  four.
- Calling `.select('*')` — explicit column lists only (banned by ESLint).

**How to extend it.**

- New context (e.g. background worker) → reuse `server-admin.ts` if it needs
  service role, or `server.ts` if it has a user context. Don't add a 5th
  client.

**Reference.** [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 12. Row-Level Security (RLS)

**What it is.** PostgreSQL's row-level security feature: every table has
policies that say which rows a given session can SELECT / INSERT / UPDATE /
DELETE. Supabase relies on RLS as the primary authorization boundary.

**Why this project uses it.** RLS enforces auth at the database layer, the
last line of defense. UI gates, middleware gates, and server-side validation
can all be wrong — RLS is the policy your data trusts.

**Where it lives.** `supabase/migrations/*.sql`. Every migration that creates
a table also enables RLS and defines policies.

**How to use it.**

- Every new table: `ALTER TABLE foo ENABLE ROW LEVEL SECURITY;`.
- Define explicit policies: `CREATE POLICY foo_select_own ON foo FOR SELECT USING (auth.uid() = user_id);`.
- For admin-only writes: pair an RLS policy with a check on
  `profiles.role = 'admin'`.
- Test with the anon role, not the service role.

**Common mistakes.**

- Shipping a table without `ENABLE ROW LEVEL SECURITY`. Anyone with the anon
  key can read everything.
- Using the service-role client to "fix" a permission error. The right fix
  is to update the RLS policy, not bypass it.
- Forgetting `auth.uid()` returns `null` for anon — every policy that
  references it needs to handle the unauthenticated case.
- Allowing `UPDATE` on the `role` column without an admin check. Users will
  promote themselves. (This template's migration installs a trigger that
  blocks non-admins from changing `role`.)

**How to extend it.**

- New table → migration includes `ENABLE ROW LEVEL SECURITY` + at least one
  policy. No exceptions.

**Reference.** [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## 13. Role-gated admin panel

**What it is.** Three layers protect `/admin/*` routes:

1. **Proxy** (`src/proxy.ts`) — checks role, redirects non-admins.
2. **Layout** (`src/app/[locale]/(admin)/admin/layout.tsx`) — server-component
   re-checks `isAdmin()` and redirects if false.
3. **RLS** — admin-only queries enforce the role at the database layer too.

**Why this project uses it.** Defense in depth. Middleware is fast but can
be misconfigured; the layout check is slower but unambiguous; RLS is the
last line. All three layers exist so a single bug doesn't expose admin
features.

**Where it lives.**

- `src/proxy.ts` — proxy gate.
- `src/app/[locale]/(admin)/admin/layout.tsx` — server component gate.
- `src/lib/auth/is-admin.ts` — the boolean check.
- `src/lib/auth/get-user-role.ts` — fetches `profiles.role`.
- `supabase/migrations/<timestamp>_profiles_role.sql` — table + RLS + trigger.

**How to use it.**

- Add a new admin route under `src/app/[locale]/(admin)/admin/`. The layout
  gates it automatically.
- Promote a user in dev:
  `update public.profiles set role = 'admin' where id = '<uuid>';`.
- New admin-only data query: write the RLS policy first, then add the UI.

**Common mistakes.**

- "Just hiding the link" in the UI. That's not security.
- Client-side role check only. The user owns the browser; never trust it.
- Trusting a custom JWT claim without re-checking against the database
  (claims can become stale; database is source of truth).
- Skipping middleware because the layout already checks. Both layers exist
  so one being misconfigured doesn't break protection.

**How to extend it.**

- New role (e.g. `moderator`) → migration adds it to the `role` enum +
  trigger update + `is-admin.ts` becomes `has-role.ts`.

---

## 14. Server Components first (Next.js App Router)

**What it is.** Next.js 16's App Router renders components on the server by
default. `'use client'` marks a file (and its imports) as client-side. Server
components can be `async`, fetch data directly, and don't ship JavaScript to
the browser.

**Why this project uses it.** Smaller client bundles, direct database
access, no useEffect-fetch-then-set-state waterfalls, better Core Web Vitals.

**How to use it.**

- Default to Server Components. Don't add `'use client'` unless you need
  state, effects, event handlers, browser APIs, or a client-only third-party
  library.
- Push `'use client'` **down** the tree. A whole layout shouldn't be a client
  component just because one button needs `onClick`.
- Fetch data directly: `const { data } = await supabase.from(...)...`.
- Pass server-fetched data as props to leaf client components.

**Common mistakes.**

- `'use client'` at the top of a layout. The entire subtree becomes client
  code. Never do this.
- Importing a server-only module (anything using `cookies()`, `headers()`,
  `server-admin.ts`) into a client component. Build will fail; fix the
  import boundary, don't delete `server-only`.
- Awaiting in a client component. Client components are synchronous;
  use Server Components or React 19 `use(promise)`.
- `forceDynamic = "force-dynamic"` to "fix" caching. That's a sledgehammer.
  Use `revalidatePath` / `revalidateTag` instead.

**How to extend it.**

- New page → Server Component first. Add `'use client'` only on the leaf
  that genuinely needs it.

**Reference.** [Server Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

---

## 15. Server Actions + `revalidatePath/Tag`

**What it is.** Server Actions are `async` functions marked with the
`'use server'` directive (or in a module with that directive at the top).
They run on the server, can be called from forms or client components, and
handle mutations directly without a separate API route. After mutating,
`revalidatePath` or `revalidateTag` invalidates the cache so the UI
re-fetches.

**Why this project uses it.** Server Actions are the cleanest way to handle
form submissions and mutations in Next.js App Router — no manual API route
boilerplate, type-safe, can stream Suspense fallbacks.

**How to use it.**

- Mark the file or function with `'use server'`.
- Validate inputs with Zod inside the action — even though the client may
  validate, the server must re-validate.
- After mutation: `revalidatePath('/dashboard')` or
  `revalidateTag('user-orders')`.
- Use with `<form action={myAction}>` for progressively-enhanced forms.

**Common mistakes.**

- Forgetting `'use server'` — Next will treat it as a normal function and
  bundle it into the client.
- Skipping server-side validation because "the client validated". The
  client is untrusted. Always re-validate.
- Calling `router.refresh()` instead of `revalidatePath` — `refresh` re-fetches
  everything; `revalidatePath` is targeted.
- Awaiting non-critical work before navigation. Use `void` + `startTransition`
  for analytics, preference saves, etc.

**How to extend it.**

- New mutation → Server Action with Zod input schema + appropriate
  revalidation.

**Reference.** [Server Actions](https://nextjs.org/docs/app/guides/forms)

---

## 16. `proxy.ts` (Next 16 request proxy)

**What it is.** Next 16 uses `proxy.ts` for request-time routing logic that older
Next versions called `middleware.ts`. It runs before matched routes and can
rewrite, redirect, refresh cookies, and enforce coarse route gates.

**Why this project uses it.** The proxy composes locale routing, Supabase session
refresh, dashboard auth redirects, and admin route guards in one request-time
boundary without the deprecated `middleware.ts` filename.

**Where it lives.** `src/proxy.ts`. The matcher in the same file declares which
routes the proxy runs on.

**How to use it.** The middleware composes three things:

1. next-intl locale routing.
2. Supabase session refresh (cookies in/out).
3. Admin gate for `/admin/*`.

**Common mistakes.**

- Renaming the file to `proxy.ts` and forgetting to update the matcher
  references in docs/comments.
- Putting heavy logic in middleware (it runs on every request).
- Calling external HTTP APIs from middleware — it runs in the Edge runtime
  with strict limits.

**How to extend it.**

- New gate → add to the composition chain in `src/proxy.ts`.

---

## 17. Performance + Core Web Vitals

**What it is.** [Core Web Vitals](https://web.dev/articles/vitals) are
Google's three user-facing performance metrics:

- **LCP** (Largest Contentful Paint) ≤ 2.5s — how fast the main content
  paints.
- **INP** (Interaction to Next Paint) ≤ 200ms — how responsive the UI feels.
- **CLS** (Cumulative Layout Shift) ≤ 0.1 — how stable the layout is.

PostHog captures them automatically because
`src/lib/analytics/posthog-client.tsx` sets `capture_performance: true`.

**Why this project uses it.** Page speed is a real-world UX and SEO factor.
Targets give measurable goals; PostHog gives the data.

**Where it lives.**

- `.agents/rules/performance.md` — the rules.
- `src/lib/perf/start-transition-navigate.ts` — `useTransitionRouter()` hook
  that wraps navigation in `startTransition` for instant UI feedback.
- `src/app/[locale]/loading.tsx` and friends — route-level streaming
  fallbacks.

**How to use it.**

- Server Components first (smaller bundle = better LCP).
- Lazy-load heavy below-the-fold components (see §18).
- `<Image priority>` only on the LCP hero. Everywhere else, default lazy.
- Wrap navigation in `startTransition(() => router.push(...))` to prevent
  freezes.
- Fire-and-forget non-critical work: `void track('event'); router.push(...)`.

**Common mistakes.**

- Optimizing without measuring. Run `npm run analyze` first.
- `<Image priority>` on everything — kills LCP by deprioritizing the actual
  hero.
- Making everything `'use client'` to "feel snappy". Smaller client bundles
  feel snappier.
- `Date.now()` / `Math.random()` in code-under-test — causes flaky tests
  and inconsistent rendering.

**How to extend it.**

- Run `npm run analyze` after any large change. If a route blows the
  200KB budget, lazy-load the offender.

**Reference.** [web.dev / Core Web Vitals](https://web.dev/articles/vitals)

---

## 18. Lazy loading

**What it is.** Defer loading of heavy below-the-fold code until it's
actually needed. Three mechanisms:

- `src/lib/lazy.tsx` exports `lazyClient<T>()` — a typed wrapper around
  `next/dynamic` with a Skeleton fallback.
- Route-level `loading.tsx` files — Next.js streams them while the page
  segment is loading.
- `next/dynamic({ ssr: false })` for components that touch `window` /
  browser-only APIs.

**Why this project uses it.** Heavy components (charts, editors, maps,
rich-text, video) blow past the 200KB First-Load budget if loaded eagerly.
Lazy loading keeps the initial route fast and pays the cost only when the
user actually needs the feature.

**Where it lives.**

- `src/lib/lazy.tsx` — the helper.
- `src/components/lazy/` — example lazy components.
- `.agents/rules/lazy-loading.md` — the rules.

**How to use it.**

```ts
const HeavyChart = lazyClient(() => import("@/components/charts/chart"));
```

- Always provide a Skeleton with the right dimensions to prevent CLS.
- Use `ssr: false` only when the component touches the `window` object
  (loses SEO/initial paint, so use sparingly).
- For routes, just add `loading.tsx` — Next handles the rest.

**Common mistakes.**

- Lazy-loading above-the-fold critical content — hurts LCP.
- Skeleton too small or too large vs the real component — causes layout
  shift (CLS regression).
- Forgetting `ssr: false` for browser-only libs (window/document) — build
  will fail.
- Lazy-loading a 2KB component — overhead exceeds savings. Save lazy for
  > 5KB.

**How to extend it.**

- New heavy component → `lazyClient(() => import("..."), { skeletonClassName: "h-64 w-full" })`.

**Reference.** [next/dynamic](https://nextjs.org/docs/app/api-reference/functions/dynamic)

---

## 19. Internationalization (next-intl, en/pt/es)

**What it is.** [next-intl](https://next-intl.dev) handles routing and
translation for English, Portuguese (BR), and Spanish. Locale prefix is
`as-needed`: English (default) has no `/en` prefix; PT and ES use `/pt` and
`/es`.

**Why this project uses it.** Reaching PT-BR + ES audiences without a
separate codebase. Translations live in JSON files.

**Where it lives.**

- `src/i18n/routing.ts` — `defineRouting({ locales, defaultLocale, localePrefix })`.
- `src/i18n/navigation.ts` — re-exports `Link`, `redirect`, `usePathname`,
  `useRouter` (i18n-aware).
- `src/i18n/request.ts` — `getRequestConfig` that loads the messages JSON.
- `messages/{en,pt,es}.json` — translation files.

**How to use it.**

- Server components: `const t = await getTranslations("common"); t("save")`.
- Client components: `const t = useTranslations("common")`.
- Add a new key in **all three** locales. Missing keys throw at runtime
  in dev.
- Use ICU for plurals: `{count, plural, one {1 item} other {# items}}`.
- For navigation, import `Link` / `redirect` from `@/i18n/navigation` —
  not from `next/link` or `next/navigation`.

**Common mistakes.**

- Hardcoding strings ("just temporary"). Always add a key.
- Adding the key to `en.json` only. Add to all three.
- Auto-translating Spanish with Google. Get a native speaker to check —
  professional Spanish in this template, not gibberish.
- Importing all messages on the client — only the active locale's bundle is
  needed.

**How to extend it.**

- New locale → add to `src/i18n/routing.ts` locales array, add `messages/<locale>.json`,
  translate every key.
- New namespace → top-level key in each messages JSON.

**Reference.** [next-intl](https://next-intl.dev)

---

## 20. Theming (next-themes, light/dark/system)

**What it is.** [next-themes](https://github.com/pacocoursey/next-themes)
handles dark mode. Strategy: `class` (adds `.dark` to `<html>` when dark).
Three modes: light, dark, system (follows OS preference).

**Why this project uses it.** Standard expectation in modern apps; SSR-safe
implementation; integrates cleanly with Tailwind v4 design tokens.

**Where it lives.**

- `src/components/theme-provider.tsx` — wraps `<NextThemesProvider>` with
  the project's defaults.
- `src/components/theme-toggle.tsx` — dropdown with Light / Dark / System.
- `src/app/globals.css` — design tokens in `@theme { ... }`, light vars in
  `:root`, dark vars in `.dark`.

**How to use it.**

- Use design tokens in className (`bg-background`, `text-foreground`,
  `border-border`) — they switch automatically with the theme.
- For one-off dark variants: `dark:bg-zinc-900`.
- Wrap server components that change with theme in `suppressHydrationWarning`
  on `<html>` to avoid flicker (already configured in root layout).

**Common mistakes.**

- Inline hex colors in JSX (banned by ESLint regex). Use design tokens.
- Forgetting the dark variant in `globals.css` — some colors will be invisible
  in dark mode.
- Reading `theme` on first render — it's `undefined` until hydration. Check
  `mounted` state in client components that need it.

**How to extend it.**

- New design token → add to both `:root` and `.dark` blocks in `globals.css`,
  add to the `@theme` block so Tailwind generates classes for it.

---

## 21. Accessibility (WCAG 2.2 AA)

**What it is.** WCAG 2.2 AA is the practical accessibility target for most
public web applications. Key criteria:

- Text contrast ≥ 4.5:1 (3:1 for large text).
- Touch targets ≥ 44 × 44 px.
- Every interactive element keyboard-reachable, with a visible focus ring.
- Meaningful `alt` text (or `alt=""` for decorative images).
- Color never the sole carrier of state — pair with icon or text.
- Respect `prefers-reduced-motion`.

**Why this project uses it.** Accessibility is a baseline expectation. Many
shadcn primitives (Dialog, DropdownMenu, etc.) handle ARIA and focus
trapping correctly out of the box.

**Where it lives.** `.agents/rules/accessibility.md` (the rules).

**How to use it.**

- Always use semantic HTML: `<button>` not `<div onClick>`.
- Pair color states (errors, warnings) with an icon and text.
- Test with keyboard only: Tab through every interactive element.
- Add `alt` to every image (or `alt=""` if decorative).
- Use shadcn primitives — they get ARIA right.
- Never remove focus rings. If they look bad, restyle them
  (`focus-visible:ring-2`).

**Common mistakes.**

- `<div onClick>` instead of `<button>` — not keyboard-focusable.
- Removing `:focus` outlines because they "look ugly" — keep
  `focus-visible:ring-2` instead.
- Images without `alt`.
- Color-only error states (red border with no icon / message).
- Tap targets <44px on mobile.

**How to extend it.**

- New interactive component → audit it with axe-core in Playwright; pair
  color states with text.

**Reference.** [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

---

## 22. Responsiveness (mobile-first)

**What it is.** Default styles target the smallest viewport. Tailwind
breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) expand styles as the viewport
grows. Floor is 360px wide.

**Why this project uses it.** Mobile is the majority of web traffic; styles
that break under 360px exclude real users.

**Where it lives.** `.agents/rules/responsiveness.md` (the rules).

**How to use it.**

- Write default styles for the smallest viewport.
- Use `sm:`, `md:`, `lg:` to enlarge at breakpoints.
- Use container queries (`@container`) when a component needs to react to
  its parent's width, not the viewport.
- Test at 360, 768, 1024, 1440. Real-device testing for the first two.
- On mobile, side-bar → drawer, table → cards.

**Common mistakes.**

- Fixed-pixel widths (`w-[400px]`) that overflow on iPhone SE.
- Horizontal scroll on mobile — usually a too-wide flex container.
- Tap targets <44px.
- Hover-only state on desktop with no mobile equivalent.

**How to extend it.**

- New layout → start with the mobile design; layer in `md:` / `lg:` as
  needed.

---

## 23. ESLint flat config + tightened rules

**What it is.** ESLint 9's "flat config" format
(`eslint.config.mjs`). The config extends `next/core-web-vitals` and
`next/typescript`, plus tightens these rules to error level:

- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-floating-promises`
- `@typescript-eslint/no-misused-promises`
- `@typescript-eslint/consistent-type-imports`
- `import/no-cycle`
- `no-restricted-syntax` for banning hex colors and secret-key string
  literals
- `max-lines` (300 for `.tsx`, 500 for `.ts`)
- `no-console` (allow `warn`/`error` only)
- `eslint-comments/no-use` — **no `eslint-disable` allowed anywhere**

**Why this project uses it.** Each rule catches a specific class of mistake
that AI agents make frequently. `no-floating-promises` is especially
valuable — agents routinely forget to `await` server actions.

**Where it lives.** `eslint.config.mjs`. Override exceptions (scripts/, config
files) are scoped via the `files:` field.

**How to use it.**

- Run `npm run lint` to check (or `npm run qa` which includes it).
- `npm run lint:fix` for auto-fixable issues.
- For type-aware rules (`no-floating-promises`), the config sets
  `parserOptions.projectService: true`.

**Common mistakes (all banned).**

- Adding `eslint-disable` — banned by `eslint-comments/no-use`.
- Casting to `any` — banned by `no-explicit-any`.
- Lowering a rule severity to silence it — fix the code instead.
- Disabling a rule per-file because "this file is special" — usually means
  the file does too much.

**How to extend it.**

- New rule → add to `eslint.config.mjs`. Start as warn; promote to error
  after one release.

**Reference.** [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files)

---

## 24. Prompt context & repo snapshotting

**What it is.** Two scripts that produce a paste-ready snapshot of the
repo for handing context to a chat-UI AI:

- `npm run prompt:context` → `scripts/prompt-context.ts` prints a
  concise text summary (repo metadata, stack versions, directory tree,
  AGENTS.md, rule file index, zod schemas, server actions, migrations,
  recent changelog).
- `npm run pack` → `repomix` produces an XML bundle of the source code
  at `.agent-cache/repomix.xml`.

**Why this project uses it.** When you're in ChatGPT, Claude, or Gemini's
web UI (not in an editor with MCP), the AI has zero project context. These
scripts give you a single block to paste before your task description so the
AI knows what stack, conventions, and current state you're working with.

**Where it lives.**

- `scripts/prompt-context.ts` — the snapshot script.
- `.agent-cache/` — output dir, gitignored.

**How to use it.**

- Before a chat-UI task: `npm run prompt:context | pbcopy` (macOS clipboard).
- Paste, then add your task description.
- `npm run pack` for the heavy bundle when you need the full source.

**Common mistakes.**

- Pasting the entire codebase into ChatGPT. Token waste; the AI skims.
- Forgetting to refresh — running `prompt:context` once and using the same
  snapshot for a week.
- Committing `.agent-cache/` — already gitignored, but check.

**How to extend it.**

- Want a different snapshot shape → edit `scripts/prompt-context.ts`. It's
  intentionally simple (no external deps, just Node stdlib + git).

---

## 25. Testing strategy (vitest + Playwright + fast lane)

**What it is.**

- **vitest** for unit / component tests (React Testing Library, jsdom).
- **Playwright** for end-to-end tests (real browsers).
- **`npm run test:agent`** — fast lane: runs vitest on changed files only
  with HEAD~1 fallback. Target ≤30s. For inner-loop iteration.
- **`npm run qa`** — full lane: includes test as one of its gates.

**Why this project uses it.** Two lanes solve different problems. The fast
lane keeps the agent loop tight; the full lane is the deterministic gate.

**Where it lives.**

- `vitest.config.ts` + `vitest.setup.ts`.
- `playwright.config.ts`.
- `src/**/*.test.{ts,tsx}` (colocated tests).
- `e2e/tests/**/*.spec.ts` (Playwright).

**How to use it.**

- Co-locate tests with source: `foo.ts` and `foo.test.ts` in the same dir.
- Mock the network with MSW if you add it (not in by default).
- For determinism: ban `Date.now()` / `Math.random()` in code-under-test.
- Never `.skip()` a failing test to "ship the feature".

**Common mistakes.**

- Component snapshot tests (`toMatchSnapshot`) — they rot. Use
  `toMatchInlineSnapshot` only for pure data transformations.
- Flaky e2e tests from arbitrary sleeps (`await page.waitForTimeout(2000)`).
  Use proper waits: `await page.waitForSelector(...)`.
- Mocking inside the test instead of at the network layer.
- Adding `.skip()` to dodge a real failure. Fix the code, not the test.

**How to extend it.**

- New test → co-locate next to source.
- New e2e flow → add to `e2e/tests/`. Use the fixtures pattern.

**Reference.** [Vitest](https://vitest.dev) · [Playwright](https://playwright.dev)

---

## 26. Spec & Plan templates

**What it is.** Two stencils that define the shape of a good spec and a
good plan in this repo.

- `.docs/templates/spec.md` — Goal, Non-goals, User stories (Given/When/Then),
  Data model deltas (with Zod), API surface, UI surface, Edge cases,
  Rollout, Acceptance criteria, Open questions.
- `.plans/templates/plan.html` — self-contained Plan Document System, Spec link, File-level changes (create / modify
  / delete), Slices (with deps), Tests to write, Performance / a11y / i18n
  / security considerations, Rollout, Risks, Verification (`npm run qa`
  exit 0), Done definition.

**Why this project uses it.** Consistent shapes mean agents and humans
produce comparable artifacts. Acceptance criteria mean "done" is testable.

**Where it lives.**

- `.docs/templates/spec.md`
- `.plans/templates/plan.html`
- `.docs/specs/` — active and historical specs.
- `.plans/` — active plans. Archived go to `.plans/archived/`.

**How to use it.**

- For new product behavior or broad technical changes, copy the template; do not start from blank.
- Fill every section, even if "N/A".
- Plans must stay standalone HTML with embedded CSS and only `--plan-*` document tokens; do not import or mirror the future application design system.
- Get spec approval before writing a plan. Get plan approval before writing code.
- For bug fixes, active-plan continuation, runbooks, or doc-only edits, use `.agents/references/artifact-layers.md` first and load only the relevant artifact template.
- One slice at a time. Mark slices done as you go.

**Common mistakes.**

- Free-prose specs without testable acceptance criteria.
- Plans missing the rollout/risk sections.
- Agents starting code before plan approval.
- Deleting plans when work ships. Move them to `.plans/archived/`.

**How to extend it.**

- Refine the template based on what you actually fill in. Sections that
  are consistently empty should be removed; sections you keep adding by
  hand should be added.

---

## 27. Artifact layers and task inference

**What it is.** Artifact layers define where each durable thing belongs: agent
rules, lookup references, workflows, concepts, specs, plans, architecture docs,
runbooks, product docs, README, and generated changelog. Task inference is the
agent discipline of classifying work from files, symptoms, active plans, and
requested outputs instead of trusting the prompt to name the task type.

**Why this project uses it.** Real prompts are often vague: "continue", "update
this", "make it right", "put it in the right place", "this page is bad". If the
agent waits for perfect wording, it loads the wrong rules or asks unnecessary
questions. If it loads everything, context gets noisy. The template therefore
teaches agents to infer the smallest safe rule set from evidence.

**Where it lives.**

- `.agents/references/artifact-layers.md` — the taxonomy and inference protocol.
- `AGENTS.md` — the terse task-classification protocol and task-type index.
- `.docs/templates/spec.md` — loaded only when creating/editing specs.
- `.plans/templates/plan.html` — loaded only when creating/editing plans.

**How to use it.**

- Start by inspecting the referenced path, current diff, active plan, latest
  commits, or reported symptom.
- Infer all affected surfaces: code, UI, auth, Supabase, docs, specs, plans,
  artifacts, QA, release.
- Load the union of relevant rule files, but do not load unrelated templates
  "just in case".
- If the ambiguity changes artifact type or side effects, ask one focused
  question. Otherwise choose the safest default and proceed.

**Common mistakes.**

- Treating `AGENTS.md` as a dumping ground for every new concept.
- Reading both spec and plan templates for every docs task.
- Treating "continue" as unclassifiable instead of checking `.plans/` and recent
  commits.
- Delivering generated artifacts by printing a path and assuming they rendered.
  Verify with the intended consumer first: browser for HTML, parser for structured
  data, reader/exporter for documents.

**How to extend it.**

- New durable artifact type → add it to `.agents/references/artifact-layers.md`.
- New mandatory behavior → add a terse `NEVER/ALWAYS` row in `AGENTS.md` and a
  deeper rule/workflow only if needed.
- New teaching explanation → add it here, not to AGENTS.md.

---

## Anti-patterns: a quick reference

If you find yourself doing any of these, stop:

- Editing `AGENTS.md` to add long explanations (this file is the place).
- Adding `eslint-disable` anywhere (banned project-wide).
- Casting to `any` (banned).
- `.skip()` / `.todo()` to ship past a failing test (banned).
- `@ts-expect-error` without 10+ char justification (banned).
- `git commit --no-verify` (banned for app commits — `npm run push` uses
  it only for the changelog commit).
- Editing `CHANGELOG.md` manually (auto-generated; will conflict).
- Using `process.env.X!` outside `src/env.ts` (defeats validation).
- Importing `server-admin.ts` into a client component (will break build).
- `'use client'` at a layout (wrecks the bundle).
- Lazy-loading above-the-fold critical content (hurts LCP).
- Inline hex colors in JSX (use design tokens).
- Hardcoding user-facing strings (use `useTranslations()`).
- Hiding an admin link in the UI and calling it "secured" (gate at
  middleware + layout + RLS — three layers).
- Pasting the entire codebase into ChatGPT (use `npm run prompt:context`).

## When something feels off

- If a rule blocks you and you don't understand why → check this file.
- If a script fails repeatedly → run `npm run qa`, read the first failing
  gate's block, apply a root-cause fix.
- If you can't find where something lives → run `npm run prompt:context`
  or `grep` `.agents/references/key-files.md`.
- If you've hit the 10-iteration QA cap → write
  `.plans/YYYY-MM-DD-qa-blocker-<slug>.html` and stop.

That's the whole template, explained.
