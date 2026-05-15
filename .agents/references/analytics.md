# Analytics Reference

## Event catalog

Maintained in `src/lib/analytics/event-names.ts`. Keep names `domain.action`.

| Constant             | Value                | When                                         |
| -------------------- | -------------------- | -------------------------------------------- |
| `AUTH_SIGNED_IN`     | `auth.signed_in`     | After successful login                       |
| `AUTH_SIGNED_OUT`    | `auth.signed_out`    | After explicit sign-out                      |
| `AUTH_SIGNED_UP`     | `auth.signed_up`     | After first session creation                 |
| `PAGE_VIEWED`        | `page.viewed`        | Manual page view (since auto-capture is off) |
| `ERROR_BOUNDARY_HIT` | `error.boundary_hit` | React error boundary triggered               |

## Properties guidance

- `distinctId` server-side = Supabase `user.id` (UUID).
- Never send `email`, `phone`, raw IPs — `scrubPII` will redact but don't lean on it.
- Use enum-like string properties (`{ source: "header" | "footer" }`) — keeps PostHog clean.
