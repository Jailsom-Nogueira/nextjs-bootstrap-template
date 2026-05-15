# Shared Components

## shadcn/ui

- Location: `src/components/ui/`
- Style: `radix-nova`
- Components installed by default: `button`, `input`, `label`, `card`, `dialog`, `dropdown-menu`, `form`, `sonner`, `tabs`, `badge`, `avatar`, `separator`, `skeleton`, `sheet`, `scroll-area`, `tooltip`
- These are YOURS — edit them. They're not a library upgrade away.

## Adding more

```bash
npx shadcn@latest add <component>
```

## Project components

- `src/components/theme-provider.tsx` — next-themes wrapper
- `src/components/theme-toggle.tsx` — dark mode toggle button

## Conventions

- One component per file.
- `forwardRef` for any component that should accept a `ref`.
- `cva` (`class-variance-authority`) for variants.
- Props interface named `<Component>Props`, exported.
- Use `cn(...)` for ALL class composition.
