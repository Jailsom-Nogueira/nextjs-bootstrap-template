# Cline base rules

AGENTS.md at repo root is the source of truth — read it first.

## Task-type index — load EVERY listed rule before coding

| Task type                        | Rules to load (in order)                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 🔁 **ANY task (always)**         | qa-loop.md (run `npm run qa` until exit 0)                                                               |
| UI / styling / components        | styling.md → responsiveness.md → accessibility.md → clean-code.md → performance.md → lazy-loading.md     |
| Forms / inputs                   | forms.md → accessibility.md → i18n.md → clean-code.md                                                    |
| Data fetching / Supabase queries | supabase.md → security.md → performance.md → error-handling.md                                           |
| Auth / role gates                | security.md → admin.md → supabase.md → clean-code.md                                                     |
| API routes / server actions      | security.md → supabase.md → error-handling.md → performance.md                                           |
| Analytics / tracking             | analytics.md → security.md                                                                               |
| New page / route                 | file-organization.md → performance.md → lazy-loading.md → accessibility.md → responsiveness.md → i18n.md |
| Admin features                   | admin.md → security.md → supabase.md → accessibility.md                                                  |
| New i18n strings                 | i18n.md → accessibility.md                                                                               |
| Performance / interaction work   | performance.md → lazy-loading.md → clean-code.md                                                         |
| Refactor / cleanup               | clean-code.md → file-organization.md → applicable-domain-rules                                           |
| Bug fix                          | applicable-domain-rules → clean-code.md → error-handling.md                                              |
| Tests                            | self-review.md → applicable-domain-rules                                                                 |

## Five absolute invariants

1. No `any` — use `unknown` or a real type.
2. No `console.log` — use `logger` from `@/lib/logger/logger`.
3. No `SUPABASE_SERVICE_ROLE_KEY` on client — only via `server-admin.ts` + `import "server-only"`.
4. No `.select('*')` — list columns explicitly.
5. `npm run qa` exit 0 = done.

## Rules in scope

All canonical rule files live under `.agents/rules/`:

- accessibility.md
- admin.md
- analytics.md
- clean-code.md
- error-handling.md
- file-organization.md
- forms.md
- i18n.md
- lazy-loading.md
- performance.md
- qa-loop.md
- responsiveness.md
- security.md
- styling.md
- supabase.md

References: `.agents/references/{analytics,key-files,shared-components}.md`.
Workflows: `.agents/workflows/{multi-agent,qa-loop,self-review}.md`.

Never duplicate AGENTS.md content into this file — keep it as a thin pointer.
