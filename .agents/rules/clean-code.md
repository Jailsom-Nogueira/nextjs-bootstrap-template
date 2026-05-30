# Clean code

Optimize for the next reader. That reader is usually you in three months.

## Functions

- **Max 50 lines** per function (warning, not hard error). If you're over, you have two functions glued together — split them.
- **Single Responsibility.** One reason to change.
- **Max 3 positional parameters.** Beyond that, use a single options object: `doThing({ user, mode, options })`.
- Prefer **pure functions** for business logic. Side effects belong at the edges (route handlers, server actions, useEffect).
- **Early returns** beat deep nesting. Reject invalid input at the top, happy path at the bottom.

## Naming

- Functions: verbs — `getUser`, `validatePayment`, `renderHeader`.
- Booleans: `is*`, `has*`, `should*`, `can*` — `isAdmin`, `hasPermission`, `shouldRetry`.
- Variables: nouns — `user`, `totalAmount`, `submittedAt`.
- React components: PascalCase nouns — `UserCard`, never `RenderUserCard`.
- No abbreviations except universally understood ones (`id`, `url`, `db`).
- Files: kebab-case (`user-card.tsx`), match the primary export.

## Control flow

- Avoid **nested ternaries**. After one level, use `if`/`else` or extract a helper.
- Avoid **magic numbers**. Extract to a named constant: `const MAX_RETRIES = 3;`.
- **`switch` exhaustiveness**: in TypeScript, end with `const _: never = value;` to force compile-time exhaustiveness when the discriminant is a union.

## Comments

- Comment **why**, not what. The code already says what.
- TODO without a ticket reference is a smell — `// TODO(JIRA-123): handle the empty case` is fine; bare `// TODO` is not.
- Delete commented-out code. Git remembers.
- JSDoc on exported public APIs only.

## Immutability

- Prefer `const`. Use `let` only when reassignment is unavoidable.
- Don't mutate arguments or shared state. Return a new value: `{ ...obj, field: x }`, `arr.map(...)`.
- Zustand stores: use selectors + immer-style updates; never mutate state directly.

## Error handling

- Don't swallow errors. At minimum, `logger.warn({ err })`.
- Empty `catch {}` is banned (except `src/supabase/server.ts` cookies set-from-RSC, which is documented).
- Throw `Error` (or a subclass), never strings or objects.
- Server actions: catch known errors → return `{ error: "..." }`; let unknown ones bubble.

## DRY but not over-abstracted

- **Rule of Three:** two duplications are fine; abstract on the third.
- Premature abstraction is worse than duplication. Wait for the shape to stabilize.

## Boy-scout rule

- Leave the file cleaner than you found it. If you touch a 400-line component, split out at least one helper.
- Drive-by lint fixes are encouraged; drive-by behavior changes are not (separate PR).

## Anti-patterns banned

- `console.log` (ESLint).
- `any` (ESLint).
- `select('*')` (style rule).
- Deep relative imports `../../../*` (ESLint).
- Inline hex/rgb in JSX (style rule).
- 300+ line `.tsx` (ESLint warn — split it).
