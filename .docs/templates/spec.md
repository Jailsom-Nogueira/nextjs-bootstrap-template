# <Feature title>

> One-line summary: what this changes and for whom.

Before using this template, read `.agents/references/artifact-layers.md` to confirm this belongs as a spec and not as a plan, runbook, ADR, or concept doc.

- **Status:** Draft <!-- Draft | In review | Approved | Implemented -->
- **Author:** <name>
- **Date:** YYYY-MM-DD
- **Spec ID:** `<YYYY-MM-DD>-<slug>`

## Goal

One paragraph. What problem does this solve? What does success look like?

## Non-goals

- Explicit scope cuts. Things readers might assume are in scope but aren't.

## User stories

Numbered, Given/When/Then.

1. **As a** _\<role\>_ **I want** _\<capability\>_ **so that** _\<outcome\>_.
   - **Given** _\<context\>_
   - **When** _\<action\>_
   - **Then** _\<observable result\>_

## Data model deltas

New / changed tables. Inline zod schemas where they apply.

```sql
-- example
create table if not exists public.example (
  id uuid primary key default gen_random_uuid(),
  ...
);
```

```ts
// example zod schema
export const exampleSchema = z.object({
  id: z.string().uuid(),
});
```

## API surface

| Method   | Path / action name | Auth | Body schema     | Response          |
| -------- | ------------------ | ---- | --------------- | ----------------- |
| `POST`   | `/api/example`     | user | `exampleSchema` | `{ ok: true }`    |
| `action` | `createExample`    | user | `exampleSchema` | `Result<Example>` |

## UI surface

- Screens / routes affected (with paths).
- Key components added / modified.
- i18n keys introduced (under what namespace).

## Edge cases & error states

- Empty / loading / error / unauthorized / forbidden / rate-limited / offline.
- Idempotency on retries.

## Rollout / migration plan

- Feature flag? Phased rollout? Backfill?
- Reversibility plan.

## Acceptance criteria

Numbered, testable, written so a black-box test could decide pass/fail.

1. ...
2. ...
3. ...

## Open questions

- [ ] Question 1
- [ ] Question 2

## Out of scope

- Things we considered but explicitly punted.

## References

- Linked plans: `.plans/<...>.html`
- Linked ADRs: `.docs/decisions/<...>.md`
- Related rules: `.agents/rules/<...>.md`
