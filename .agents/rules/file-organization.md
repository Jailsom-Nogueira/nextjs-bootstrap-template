# File Organization

## Naming

- **Components**: `PascalCase.tsx` (e.g. `UserMenu.tsx`)
- **Utilities / hooks / non-component TS**: `kebab-case.ts` (e.g. `format-date.ts`, `use-foo.ts`)
- **Tests**: colocated, `<name>.test.ts(x)` or `<name>.spec.ts(x)`
- **Types**: prefer colocated `types.ts` per feature folder; cross-cutting types in `src/types/`

## Paths

- Use the `@/*` alias for ALL imports outside the current folder.
- NEVER use `../../` or deeper. ESLint enforces this.
- Within the same folder, relative imports (`./foo`) are fine.

## Folder layout (src/)

```
src/
  app/                  # Next.js App Router — routes, layouts, route handlers
  components/           # Shared React components
    ui/                 # shadcn primitives (don't modify pattern without reason)
  hooks/                # Reusable React hooks
  lib/                  # Pure functions, clients, utilities (no React)
    analytics/
    auth/
    email/
    logger/
  supabase/             # Supabase clients (browser/server/admin/middleware)
  types/                # Cross-cutting TS types
  env.ts                # Validated env (single source of truth)
  middleware.ts         # Edge middleware
```

## Exports

- Default export ONLY for Next.js page/layout/route files (the framework requires it).
- Everything else: named exports.
- Don't re-export from `index.ts` barrels unless there's a real reason (bundling cost).
