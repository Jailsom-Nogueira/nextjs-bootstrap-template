---
description: Scaffold a new component with i18n, a11y, types extracted, tests
argument-hint: <ComponentName> <where-to-place> [client|server]
---

Scaffold a new component. `$ARGUMENTS` has three parts: `<ComponentName>`, `<where-to-place>`, optional `client|server` (default: server).

1. Read `.agents/rules/styling.md`, `.agents/rules/accessibility.md`, `.agents/rules/responsiveness.md`, `.agents/rules/i18n.md`, `.agents/rules/clean-code.md`.
2. Read `.agents/references/shared-components.md` first — REUSE existing shadcn primitives. Do not reinvent buttons, inputs, dialogs, etc.
3. Create the component file at `<where-to-place>/<kebab-name>.tsx`:
   - Add `'use client'` at the top ONLY if explicitly requested or if the component uses hooks/event handlers that can't live in a server tree.
   - Import `cn` from `@/lib/utils` for class composition. No template-string class concatenation.
   - Use design tokens (`bg-background`, `text-foreground`, etc.), never inline hex/rgb.
   - All user-facing strings via `useTranslations()` (client) or `getTranslations()` (server). Add keys to all 3 message files (`messages/en.json`, `messages/pt.json`, `messages/es.json`).
   - Interactive elements: keyboard-reachable, `focus-visible:ring-2`, ≥44px touch target.
   - Images: `next/image` with `width`/`height` and meaningful `alt`.
   - Mobile-first responsive: design from 360px up.
4. If the component exports types consumed by callers, put them in a sibling `types.ts`.
5. Add a colocated `<kebab-name>.test.tsx` with at least one render-and-assert test using `@testing-library/react`.
6. Update `.agents/references/shared-components.md` with the new component's path and one-line purpose.
7. Run `npm run qa` and iterate until exit 0.
