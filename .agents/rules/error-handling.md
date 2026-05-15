# Error Handling

## Logger

- Use `logger` from `@/lib/logger/logger`. NEVER `console.log` (banned by ESLint).
- `console.warn` and `console.error` are allowed — but prefer `logger.warn` / `logger.error` for structured output.

## Levels

- `logger.debug` — verbose; off in production by default.
- `logger.info` — normal events (signup, payment).
- `logger.warn` — degraded but recoverable (retry succeeded, fallback used).
- `logger.error` — failures requiring investigation.
- `logger.fatal` — process about to die.

## Server-side errors

- Wrap Server Actions / Route Handlers in try/catch.
- Return typed `{ ok: false, error: string }` — never leak stack traces to the client.
- Log the full error server-side with context.

## Client-side errors

- Use Error Boundaries (`error.tsx` per route segment).
- Report to PostHog: `track(EVENT.ERROR_BOUNDARY_HIT, { message, route })`.
- Never `alert()` an error — render it in the UI.

## Forbidden

- ❌ `console.log("foo")` — use the logger.
- ❌ Throwing strings: `throw "oops"` — always `throw new Error(...)`.
- ❌ Silently swallowing errors: `catch {}` without at least a log.
