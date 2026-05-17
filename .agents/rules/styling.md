# Styling

## Stack

- Tailwind CSS v4 (CSS-first via `@theme` in `src/app/globals.css`)
- Design tokens are CSS variables (`--color-background`, etc.). NEVER hardcode hex/rgb.
- Dark mode via `class="dark"` on `<html>` (managed by next-themes).
- `cn()` (`@/lib/utils`) is the ONLY way to merge class names.

## Rules

- ALWAYS use semantic tokens: `bg-background`, `text-foreground`, `border-border` — not raw colors.
- NEVER write inline styles for colors. Use a Tailwind class or extend `@theme`.
- Use `cn()` for ANY conditional class. Never template-string `class="${a} ${b}"`.
- Prefer Tailwind utility classes over custom CSS. Custom CSS goes in `globals.css` only.
- shadcn/ui components live in `src/components/ui/`. Modify them inline — they're yours.
- Component files: PascalCase. Use `forwardRef` + `cva` for variants (the shadcn pattern).
- Icons: `lucide-react` only. Size via Tailwind (`h-4 w-4`), not the `size` prop unless necessary.

## Forbidden

- Forbidden: `style={{ color: "#fff" }}` — use a token class.
- Forbidden: `className={\`foo ${bar}\`}`— use`cn("foo", bar)`.
- Forbidden: adding a new color directly in a component — add it to `@theme` first.
- Forbidden: installing MUI, Emotion, styled-components, Pigment — anything not Tailwind/shadcn.
