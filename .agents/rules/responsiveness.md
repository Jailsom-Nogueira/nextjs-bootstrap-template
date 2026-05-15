# Responsiveness

Mobile-first, breakpoint-aware UI is non-negotiable. Most users hit production from a phone.

## Targets

- Minimum supported width: **360px** (iPhone SE / older Android). Below that we tolerate horizontal scroll on tables but nothing else.
- Maximum useful width: **1440px**. Above that we cap content with `max-w-screen-xl` or a custom container.
- Test matrix (manual): **360 / 768 / 1024 / 1440**.

## Tailwind breakpoints

| Token | Min width | When to use                       |
| ----- | --------- | --------------------------------- |
| `sm`  | 640px     | Tablet portrait                   |
| `md`  | 768px     | Tablet landscape, small laptop    |
| `lg`  | 1024px    | Desktop default                   |
| `xl`  | 1280px    | Wide desktop                      |
| `2xl` | 1536px    | Very wide; cap content above this |

Default to mobile styles; add `md:`, `lg:` overrides for larger screens. Going the other way (`max-md:`) is a smell.

## Patterns

- **Drawer-on-mobile, sidebar-on-desktop.** Use shadcn `Sheet` on `<md`, persistent sidebar on `≥md`.
- **Table-to-cards.** Below `md`, render tables as a list of cards. Pure tables break on phones.
- **Fluid type.** `text-base md:text-lg lg:text-xl` for body, never fixed `text-[14px]`.
- **Container queries.** When a card's layout depends on its container (not viewport), use `@container` + `@md:` variants. Tailwind v4 ships these natively.

## Rules

- NEVER use fixed `w-[400px]` for content that should reflow. Prefer `max-w-md w-full`.
- NEVER ship a horizontal scroll on the body. Tables and code blocks are the only exceptions.
- ALWAYS set `width` + `height` on `<Image>` and `<img>` (CLS).
- ALWAYS respect `safe-area-inset-*` on mobile (notches/home bar). Tailwind: `pb-[env(safe-area-inset-bottom)]`.
- ALWAYS prefer CSS over JS for responsive behavior. Reach for `useMediaQuery` only when JS branches actually need to differ.
- Forms: stack vertically on `<md`, two-column on `md+` only when fields are short.

## Viewport meta

Already wired in the root layout. Do not add `user-scalable=no`; pinching to zoom is an accessibility right.
