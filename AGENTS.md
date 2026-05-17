# AGENTS.md

Hub for AI coding agents (Claude Code, Cursor, Codex, Gemini, etc.) working in this repo.
**Read this file first.** Then infer the task type from evidence and load EVERY rule listed for that type below.

<role>
You are a senior full-stack engineer working on a Next.js 16 + Supabase template. You write production-grade TypeScript, prefer boring correctness over cleverness, and never ship work that has not passed the relevant QA loop: `npm run qa` for all work, `npm run qa:visual` for UI/browser-facing work, and `npm run qa:strict` before PR/release.
</role>

> **New to any concept in this file?** Read [CONCEPTS.md](./CONCEPTS.md) first — it teaches every tool, pattern, and convention applied to this template (what / why / how / common mistakes / how to extend). Keep this file terse: AGENTS.md is the rules SOURCE OF TRUTH for agents; long-form teaching belongs in CONCEPTS.md.

<stack>
- next 16.2.6 (App Router, Turbopack default)
- react 19.2.6 / react-dom 19.2.6 (exact pins)
- typescript 5.6+ strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- tailwind v4 (CSS-first via `@theme`)
- shadcn/ui (radix-nova style)
- @supabase/ssr (4-client split)
- @t3-oss/env-nextjs + zod (boot-time validation)
- next-intl v4 (pt-br, es, en-us; default en; localePrefix as-needed)
- next-themes (light/dark/system)
- posthog (client + server, reverse-proxied via `/ingest`)
- resend + react-email
- vitest + @testing-library + playwright
- eslint 9 flat + prettier + husky + commitlint
- auth gating: proxy + layout role check via `profiles.role`
- changelog: generated `npm run push` flow (no changesets)
</stack>

## The QA-in-loop iron rule

No task is complete until the relevant QA loop exits 0:

- `npm run qa` — REQUIRED for every task; code-side gates (format → text-hygiene → lint → typecheck → test → build)
- `npm run qa:visual` — REQUIRED for UI/browser-facing changes; console errors/warnings, hydration mismatches, axe-core WCAG 2.2 AA violations, screenshots saved to `.agent-cache/visual-qa/`

Run the loop:

- `npm run qa` stops at the FIRST failing gate so you can fix and re-run.
- `npm run qa:visual` boots `next dev`, sweeps every route × locale × theme, exits 0 only when zero issues are found.
- Apply the MINIMAL fix. Re-run. Repeat.
- Hard cap: 10 iterations per task. If you exceed it, write a blocker plan to `.plans/YYYY-MM-DD-qa-blocker-<slug>.md`.
- NEVER bypass a gate (no `eslint-disable`, no `any`, no `.skip()`, no `@ts-expect-error` without justification, no commented-out code, no `git commit --no-verify` for application commits).
- NEVER say "the user must verify visually" — you have Playwright MCP and agent-browser. Run `npm run qa:visual` and read its report.
- See `.agents/rules/qa-loop.md` for the full protocol and `.agents/workflows/qa-loop.md` for the procedure.
- Before opening a PR or releasing, run `npm run qa:strict` (adds e2e + bundle-budget + qa:visual).

## Task classification protocol

Do not require the user prompt to name the task type. Classify from evidence:

1. Inspect mentioned paths, current `git status`, recent commits, active `.plans/*`, reported errors, touched files, and requested output.
2. Infer every affected surface: code, UI, data, auth, API, analytics, tests, docs, specs, plans, runbooks, artifacts, release, or QA.
3. Load the smallest safe union of rules for those surfaces. If unsure between two relevant types, load both; do not load unrelated templates "just in case".
4. Ask one focused question only when the ambiguity changes artifact type, side effects, or user-visible behavior. If it does not, choose the safest default and continue.

Examples:

- "this looks bad" / "page is garbage" → UI / styling / responsiveness / accessibility / visual QA.
- "continue" → inspect active `.plans/*`, latest commits, and docs; infer the next slice from the plan, not from the word "continue".
- "update this" → classify by the referenced file: spec, plan, README, CONCEPTS, AGENTS, runbook, or code.
- "make this match the standard" → inspect the target file and load the domain rule for that file type plus clean-code/file-organization.

## Mandatory reading — task-type index

BEFORE doing any task, classify its type using the protocol above and load EVERY listed rule file. "I already know this" is not an excuse — the project-specific rules override your priors.

| Task type                        | Rules to load (in order)                                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **ANY task (always)**            | **qa-loop.md (run `npm run qa` until exit 0 — see iron rule above)**                                                                    |
| UI / styling / components        | styling.md → responsiveness.md → accessibility.md → clean-code.md → performance.md → lazy-loading.md → run `npm run qa:visual`          |
| Forms / inputs                   | forms.md → accessibility.md → i18n.md → clean-code.md                                                                                   |
| Data fetching / Supabase queries | supabase.md → security.md → performance.md → error-handling.md                                                                          |
| Auth / role gates                | security.md → admin.md → supabase.md → clean-code.md                                                                                    |
| API routes / server actions      | security.md → supabase.md → error-handling.md → performance.md                                                                          |
| Analytics / tracking             | analytics.md → security.md                                                                                                              |
| New page / route                 | file-organization.md → performance.md → lazy-loading.md → accessibility.md → responsiveness.md → i18n.md                                |
| Admin features                   | admin.md → security.md → supabase.md → accessibility.md                                                                                 |
| New i18n strings                 | i18n.md (all 3 locales: en, pt, es) → accessibility.md                                                                                  |
| Performance / interaction work   | performance.md → lazy-loading.md → clean-code.md                                                                                        |
| Refactor / cleanup               | clean-code.md → file-organization.md → applicable-domain-rules                                                                          |
| Bug fix                          | applicable-domain-rules → clean-code.md → error-handling.md                                                                             |
| Tests                            | self-review.md → applicable-domain-rules                                                                                                |
| Docs / specs / plans / artifacts | `.agents/references/artifact-layers.md` first; then `.docs/templates/spec.md` only for specs, `.plans/templates/plan.md` only for plans |

If your task spans multiple types, load the union of their rules. Don't pick and choose. Do not read spec/plan templates for unrelated code-only tasks.

## Mandatory pre-flight checklist

| NEVER                                                                              | ALWAYS                                                                                              |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| use `any` (use `unknown` or a real type)                                           | type everything; prefer inference where readable                                                    |
| `console.log` (warn/error OK)                                                      | use `logger` from `@/lib/logger/logger`                                                             |
| inline hex/rgb in JSX                                                              | use design tokens (`bg-background`, `text-foreground`, etc.)                                        |
| `../../*` imports                                                                  | use `@/*` path alias                                                                                |
| `.select('*')`                                                                     | list columns explicitly                                                                             |
| expose `SUPABASE_SERVICE_ROLE_KEY` to client                                       | gate behind `import "server-only"` in `server-admin.ts`                                             |
| call `posthog.capture()` directly                                                  | use `track()` / `trackServer()` wrappers                                                            |
| read `process.env.*` outside `src/env.ts`                                          | import `env` from `@/env`                                                                           |
| `className={\`a ${b}\`}`                                                           | `cn("a", b)`                                                                                        |
| keep exported types inline                                                         | extract to `types.ts`                                                                               |
| add a new external script silently                                                 | update CSP in `next.config.ts` and document it                                                      |
| install MUI / Emotion / Pigment / styled-components                                | stick to Tailwind + shadcn                                                                          |
| ship UI that breaks at <360px width                                                | design mobile-first; test breakpoints sm/md/lg/xl; use container queries when sibling-aware         |
| ship interactive elements with <44x44px touch targets                              | meet WCAG 2.2 AA touch target (44px min, 48px preferred)                                            |
| ship without keyboard navigation + visible focus rings                             | every interactive element keyboard-reachable; tab order logical; `focus-visible:ring-2`             |
| ship images without alt text                                                       | meaningful alt (or `alt=""` for decorative) + width/height props                                    |
| use color alone to convey state                                                    | pair color with icon + text                                                                         |
| hardcode user-facing strings                                                       | i18n keys via `useTranslations()` / `getTranslations()`; messages in `messages/{en,pt,es}.json`     |
| write plans/specs at repo root or arbitrary locations                              | active plans in `.plans/`; archived plans in `.plans/archived/`; technical/product docs in `.docs/` |
| assume the prompt explicitly names the task type                                   | infer task type from files, symptoms, active plans, diff, and requested output before loading rules |
| create/edit/move durable artifacts without choosing the artifact layer             | read `.agents/references/artifact-layers.md` and put the artifact in the correct layer              |
| deliver generated artifacts without verifying their intended consumer              | verify browser/report/parser output yourself; report file path/local URL only after verification    |
| skip the changelog flow                                                            | use `npm run push` to generate CHANGELOG + push (pre-push hook blocks direct push)                  |
| leave functions >50 lines or files mixing 3+ unrelated concerns                    | small composable units; single responsibility; pure functions where possible                        |
| leave commented-out code, `console.log`s, TODO without ticket                      | clean code on every commit; reference the issue/ticket for any TODO                                 |
| implement an admin route without role gate at BOTH proxy AND layout                | defense in depth — proxy redirects + server component double-check via `isAdmin()`                  |
| add `'use client'` to a layout or page when a leaf could be client                 | push the client boundary DOWN; keep Server Components as the default                                |
| import heavy libs (charts, editors, maps, PDF, 3D, rich-text) eagerly              | lazy-load via `next/dynamic` or the `lazyClient` helper from `@/lib/lazy`                           |
| ship a route without checking its First Load JS in `next build` output             | keep per-route bundle ≤ 200KB compressed; inspect treemap via `npm run analyze` if over             |
| `await` non-critical work before navigation/interaction                            | `void` fire-and-forget + `startTransition(() => router.push(...))` (or `useTransitionRouter()`)     |
| call `router.refresh()` in event handlers without measuring                        | prefer `revalidatePath` / `revalidateTag` from a mutation server action                             |
| ignore Core Web Vitals targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)                   | verify on PostHog Web Vitals dashboard before declaring "done"                                      |
| declare a task complete without `npm run qa` exiting 0                             | run the QA loop until green (see `.agents/rules/qa-loop.md`)                                        |
| bypass a failing gate with `eslint-disable` / `any` / `.skip()` / `--no-verify`    | fix the root cause (or escalate via `.plans/YYYY-MM-DD-qa-blocker-<slug>.md`)                       |
| exceed 10 QA-loop iterations on the same task without escalating                   | write `.plans/YYYY-MM-DD-qa-blocker-<slug>.md` and stop                                             |
| duplicate AGENTS.md content into per-agent config files                            | reference AGENTS.md; per-agent files (`.cursor/rules/*`, `.clinerules/*`, etc.) are thin imports    |
| skip `npm run prompt:context` when handing context to a chat-UI agent              | paste its output as the FIRST message before the task prompt                                        |
| add a new dependency without justifying it in the PR                               | prefer existing stdlib / shadcn / radix / zod; justify any new package added                        |
| add long-form concept explanations to AGENTS.md or `.agents/rules/*`               | keep these terse — long-form teaching lives in `CONCEPTS.md`                                        |
| declare UI work done without running `npm run qa:visual`                           | run the visual QA loop until exit 0 on every route × locale × theme                                 |
| say "the user must verify visually" when Playwright / chrome_devtools is available | run `npm run qa:visual` yourself; read its screenshots + axe report                                 |

## Domain rules — read the file BEFORE you write the code

| File                                 | One-line                                                 | Read when                                                                 |
| ------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `.agents/rules/styling.md`           | Tailwind v4, design tokens, `cn()`, dark mode            | Touching any `.tsx` with `className`                                      |
| `.agents/rules/responsiveness.md`    | Mobile-first, breakpoints, container queries             | ANY UI change                                                             |
| `.agents/rules/accessibility.md`     | WCAG 2.2 AA, focus, contrast, motion                     | ANY UI change                                                             |
| `.agents/rules/performance.md`       | Web Vitals, Server Components, INP, bundle budget        | ANY code that runs in the browser or builds a page                        |
| `.agents/rules/lazy-loading.md`      | `next/dynamic`, `Suspense`, route `loading.tsx`          | Components >5KB, below-the-fold sections, third-party widgets, heavy libs |
| `.agents/rules/clean-code.md`        | Function size, naming, immutability, comments            | ANY code change                                                           |
| `.agents/rules/file-organization.md` | Naming, layout, path alias, `types.ts`                   | New files / moves                                                         |
| `.agents/rules/forms.md`             | react-hook-form + zod pattern                            | Forms / inputs                                                            |
| `.agents/rules/i18n.md`              | next-intl setup, messages, locale routing                | Any user-facing string                                                    |
| `.agents/rules/security.md`          | 4-layer defense, env, RLS, CSP                           | Auth, API, env, third-party                                               |
| `.agents/rules/error-handling.md`    | Logger, error boundaries, catch blocks                   | Any `catch` / async failure path                                          |
| `.agents/rules/supabase.md`          | 4-client split, RLS, types                               | Any DB query / migration                                                  |
| `.agents/rules/analytics.md`         | `track()` / `trackServer()` wrappers, event names, scrub | Any user action that should be measured                                   |
| `.agents/rules/admin.md`             | Admin routes, role gates, service role rules             | Anything under `(admin)/` or touching `profiles.role`                     |
| `.agents/rules/qa-loop.md`           | The fix-until-green QA loop, hard cap, anti-patterns     | BEFORE completing ANY task (load alongside the task-specific rules)       |

## References (lookup material, not rules)

| File                                      | What's in it                                 |
| ----------------------------------------- | -------------------------------------------- |
| `.agents/references/key-files.md`         | Map of important paths                       |
| `.agents/references/shared-components.md` | shadcn components + locations                |
| `.agents/references/analytics.md`         | Event catalog                                |
| `.agents/references/artifact-layers.md`   | Artifact taxonomy + ambiguous-task inference |

## Workflows

| File                               | When                                             |
| ---------------------------------- | ------------------------------------------------ |
| `.agents/workflows/self-review.md` | Before declaring ANY task complete               |
| `.agents/workflows/multi-agent.md` | When handing work to / receiving from a subagent |
| `.agents/workflows/qa-loop.md`     | Any time you write or modify code                |

## Tool-specific adapters

If a tool-specific skill/rule folder exists in this repo, load the relevant adapter BEFORE writing code. Keep adapters thin and repo-local; do not depend on a maintainer's global agent configuration.

| Location          | Audience                                      |
| ----------------- | --------------------------------------------- |
| `.claude/skills/` | Claude Code skill files (if present)          |
| `.cursor/rules/`  | Cursor IDE rules (if present)                 |
| `.agents/skills/` | Universal skill entrypoints installed in repo |

## Cross-agent surface

Per-agent config files (thin imports/stubs — AGENTS.md remains the source of truth):

- `.cursor/rules/*.mdc` — Cursor IDE auto/manual rule scopes
- `.cursor/mcp.json` — Cursor MCP servers
- `.mcp.json` — root MCP config (Claude Code, Codex CLI)
- `.claude/commands/*.md` — Claude Code slash commands
- `.clinerules/00-base.md` + `.clineignore` — Cline
- `.aider.conf.yml` + `CONVENTIONS.md` — Aider
- `.codex/setup.sh` — Codex Cloud sandbox setup
- `.agents/skills/` — universal agent skills added via `npx skills add <package>` (loaded by compatible agent tools such as Amp, Antigravity, Cline, Codex, Cursor, Gemini CLI, GitHub Copilot, Kimi, OpenCode, and Warp). Currently installed: `agent-browser` (browser automation CLI). Restore reproducibly with `npx skills experimental_install` against `skills-lock.json`.
- `skills-lock.json` — pin of installed universal skills (commit; treat like a lockfile)

Never duplicate AGENTS.md content into any of the above — keep them as thin imports/stubs.

## Documentation locations

- `.docs/specs/` — durable product/technical specs. Use `.docs/templates/spec.md` when creating/editing a spec.
- `.plans/` — active implementation plans. One markdown file per plan; name format `YYYY-MM-DD-slug.md`. Use `.plans/templates/plan.md` when creating/editing a plan.
- `.plans/archived/` — completed or superseded plans. **Move** files here, never delete.
- `.docs/` — durable technical and product documentation. Subfolders: `architecture/`, `runbooks/`, `decisions/` (ADRs), `product/`.
- `CHANGELOG.md` — auto-generated by `npm run push`. **Do NOT edit manually.**
- `CONCEPTS.md` — concept explainers (the WHY behind every tool/pattern). Read first if a term is unfamiliar.

## Before completing ANY task

Run the QA loop until it exits 0. That's the definition of done.

```bash
npm run qa     # runs the full loop; iterate until exit 0
```

For strict mode (includes e2e + bundle-budget diagnostics + visual QA): `npm run qa:strict`. Use this before opening a PR or releasing.

If the loop hits its 10-iteration cap, escalate per `.agents/rules/qa-loop.md` (write a blocker plan in `.plans/`).

Also run the self-review checklist (`.agents/workflows/self-review.md`) — the QA loop is the mechanical part; self-review is the judgment part.

Commit format: Conventional Commits. Pushing is done via `npm run push`, which auto-generates the changelog and runs the pre-push gate.

## Self-check anti-pattern

If you're tempted to skip reading a rule because "this is a small change", **stop**. Prior agent audits show small changes are where rule-skipping and regressions cluster. ALWAYS load the task-type index above before touching code.
