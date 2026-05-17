# `.agents/rules/` — mandatory operational rules per domain

Domain-scoped rules every agent must follow when touching a surface this directory covers. AGENTS.md routes agents here via the task router; each rule file owns one concern and stays terse.

## Files

| File                   | Load when                                                                  |
| ---------------------- | -------------------------------------------------------------------------- |
| `qa-loop.md`           | Any repo-changing task. The fix-until-green loop, hard cap, anti-patterns. |
| `clean-code.md`        | Any code change. Function size, naming, immutability, comments.            |
| `file-organization.md` | New files, moved files, module boundaries, imports, `types.ts`.            |
| `styling.md`           | Touching TSX classes, Tailwind tokens, shadcn components, dark mode.       |
| `responsiveness.md`    | Any UI layout or viewport-sensitive change.                                |
| `accessibility.md`     | Any UI or interactive behavior change. WCAG 2.2 AA targets.                |
| `performance.md`       | Browser/runtime performance, Server Components, Web Vitals, bundle impact. |
| `lazy-loading.md`      | Heavy components, below-the-fold sections, third-party widgets.            |
| `forms.md`             | Forms, validation, inputs, submissions (react-hook-form + zod pattern).    |
| `i18n.md`              | User-facing strings or locale routing (en/pt/es via next-intl).            |
| `security.md`          | Auth, API, env, CSP, secrets, RLS, third-party integrations.               |
| `error-handling.md`    | Async failures, `catch` blocks, logging, error boundaries.                 |
| `supabase.md`          | Supabase clients, queries, migrations, generated DB types.                 |
| `analytics.md`         | PostHog events, event names, client/server tracking, PII scrubbing.        |
| `admin.md`             | Admin routes, role gates, service-role access, `profiles.role`.            |

## Conventions

- One concern per file. `styling.md` does not talk about authentication.
- Cap each file at ~150 lines. Split when crossing 200.
- Lint, CI, or commit hooks must back every rule — otherwise it drifts.
- Long-form teaching goes to `CONCEPTS.md`, not here. Lookup catalogs go to `.agents/references/`. Procedures go to `.agents/workflows/`.

## How to add a new rule

1. Decide it cannot live inside an existing file. Prefer extension over new files.
2. Add `<topic>.md` here, ~50-150 lines, do/don't tables when possible.
3. Register it in AGENTS.md's task router and rule catalog.
4. Add an enforcement layer (lint rule, CI gate, hook) so the rule is checked, not just stated.

## Cross-links

- AGENTS.md (root) routes here via the task router.
- `.cursor/rules/*.mdc` are auto-attaching pointers that load these files.
- `.agents/workflows/*` may reference these rules from inside a procedure.
- `.agents/references/*` may cross-link to these rules without duplicating their content.
