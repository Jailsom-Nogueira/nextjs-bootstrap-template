# Analytics

## Stack

- PostHog (client + server)
- Reverse-proxied through `/ingest` (see `next.config.ts` rewrites) to dodge ad-blockers.

## Always go through wrappers

- Client: `track(EVENT.X, { ... })` from `@/lib/analytics/events`
- Server: `await trackServer(distinctId, EVENT.X, { ... })` from `@/lib/analytics/events-server`
- Event names: ONLY from `@/lib/analytics/event-names` (`EVENT.*` enum). No inline strings.

## Rules

- NEVER call `posthog.capture(...)` directly. Always `track()`.
- ALL properties pass through `scrubPII()` automatically — but still don't include obvious PII.
- `capture_pageview` is OFF in `PostHogProvider`. Track page views manually where it matters.
- Server tracking is fire-and-forget but `await client.flush()` before request ends.
- Identify users on sign-in with their Supabase user id (NOT email).

## Adding a new event

1. Add the key + value to `EVENT` in `src/lib/analytics/event-names.ts`.
2. Use `EVENT.<KEY>` at call sites — TS will autocomplete.
3. (Optional) Document it in `.agents/references/analytics.md`.

## Forbidden

- ❌ `posthog.capture("string_event")` — use `track(EVENT.X)`.
- ❌ Sending `{ email }` as a property — let `scrubPII` redact it, or just don't pass it.
- ❌ Tracking from middleware. It runs on every request — far too noisy.
