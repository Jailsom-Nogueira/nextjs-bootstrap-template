# Shared Components

## shadcn/ui

- Location: `src/components/ui/`
- Style: `radix-nova`
- Components installed by default: `avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `scroll-area`, `separator`, `sheet`, `skeleton`, `sonner`, `table`, `tabs`, `tooltip`
- These are yours — edit them. They're not a library upgrade away.

## Adding more

```bash
npx shadcn@latest add <component>
```

## Project components

- `src/components/site-header.tsx` — sticky public header
- `src/components/site-footer.tsx` — public footer
- `src/components/locale-switcher.tsx` — next-intl locale picker
- `src/components/theme-provider.tsx` — next-themes wrapper
- `src/components/theme-toggle.tsx` — theme toggle button
- `src/components/lazy/` — lazy-loading examples and conventions

## Conventions

- One component per file.
- `forwardRef` for any component that should accept a `ref`.
- `cva` (`class-variance-authority`) for variants.
- Props interface named `<Component>Props`, exported.
- Use `cn(...)` for ALL class composition.
