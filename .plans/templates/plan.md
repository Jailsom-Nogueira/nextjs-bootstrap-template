# <Plan title>

> Implementation plan for spec: [`.docs/specs/<spec-file>.md`](../.docs/specs/<spec-file>.md)

- **Status:** Draft <!-- Draft | Approved | In progress | Done | Superseded -->
- **Author:** <name>
- **Date:** YYYY-MM-DD
- **Plan ID:** `<YYYY-MM-DD>-<slug>`

## Summary

3–5 sentences. What we are building, how it lands, where the risk lives.

## File-level changes

### Files to create

| Path      | Purpose |
| --------- | ------- |
| `src/...` | ...     |

### Files to modify

| Path      | Nature of change |
| --------- | ---------------- |
| `src/...` | ...              |

### Files to delete

| Path      | Reason |
| --------- | ------ |
| `src/...` | ...    |

## Slices

Ordered, each slice ships independently green (`npm run qa` exit 0).

| #   | Slice name | Files touched | Tests added | Effort (S/M/L) | Depends on |
| --- | ---------- | ------------- | ----------- | -------------- | ---------- |
| 1   | ...        | ...           | ...         | S              | —          |
| 2   | ...        | ...           | ...         | M              | 1          |

## Schema changes

| Migration file                                    | Purpose | RLS impact |
| ------------------------------------------------- | ------- | ---------- |
| `supabase/migrations/<YYYYMMDDHHMMSS>_<slug>.sql` | ...     | ...        |

## Tests to write

- **Unit (vitest):** ...
- **E2E (playwright):** ...

## Performance considerations

- Web Vitals at risk (LCP / INP / CLS) and how we measure.
- First Load JS budget per route (`≤ 200KB`).

## A11y / i18n considerations

- New focus/keyboard paths.
- New i18n keys (must land in `en`, `pt`, `es` together).

## Security considerations

- RLS policies introduced.
- New env vars (update `src/env.ts` + `.env.example`).
- CSP impact (new external script? update `next.config.ts`).

## Rollout plan

- Behind a flag? Default off / on?
- Backfill steps?
- Monitoring (PostHog events, logs to watch).

## Risks + mitigations

| Risk | Likelihood | Impact     | Mitigation |
| ---- | ---------- | ---------- | ---------- |
| ...  | low/med/hi | low/med/hi | ...        |

## Verification

- [ ] `npm run qa` exits 0
- [ ] `npm run qa:strict` exits 0 (before PR)
- [ ] Manual smoke: ...
- [ ] PostHog Web Vitals dashboard reviewed
- [ ] All 3 locales render the new UI

## Definition of done

The spec's acceptance criteria are met AND `npm run qa:strict` is green AND the changelog has shipped via `npm run push`.
