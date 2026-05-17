# Accessibility

Target: **WCAG 2.2 Level AA**. We ship to humans, including humans with disabilities.

## Semantic HTML first, ARIA second

- Use `<button>` for buttons, `<a href>` for navigation, `<nav>` for nav, `<main>` for main, `<h1>`–`<h6>` in order.
- Reach for ARIA only when no semantic element exists for the role. ARIA is a patch, not a feature.
- One `<h1>` per page.

## Landmarks: exactly one `<main>` per document

The `<main>` landmark is owned by `src/app/[locale]/layout.tsx`. Every page, sub-layout, and `loading.tsx` renders **inside** that landmark, so they MUST use `<div>` / `<section>` / `<article>` — never another `<main>`. Nesting a second `<main>` violates WCAG 1.3.1 and confuses screen-reader landmark navigation.

If a sub-layout has a sidebar + content split (e.g. `(admin)/admin/layout.tsx`), the content area is a `<div className="flex-1">`, not a `<main>`. Add an inline comment explaining the decision so future contributors don't "fix" it back to `<main>`.

Other landmark rules:

- `<header>` / `<footer>` belong to the site shell only (`SiteHeader`, `SiteFooter`). Page-internal section headings use `<header>` with no landmark role.
- `<nav>` must carry an `aria-label` whenever there is more than one navigation region on the page (header nav + admin sidebar nav, for example).
- `<aside>` is fine for genuinely complementary content (admin sidebar, related links). Don't use it as a fancy `<div>`.

## Keyboard navigation

- Every interactive element must be reachable via Tab and operable with Enter / Space (buttons) or arrow keys (menus, listboxes).
- Tab order must follow visual order. Never use `tabindex` > 0.
- Provide a visible focus ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`. Don't strip the default ring without a replacement.
- Provide a "Skip to content" link as the first focusable element on every page.

## Touch targets

- Minimum **44×44px** (WCAG 2.5.8 AA), 48×48px preferred (Material).
- shadcn `Button` size `sm` is 36px — only acceptable on desktop-only dense UI.
- IconButton without text label: still 44px minimum.

## Color & contrast

- Body text contrast: **≥ 4.5:1**.
- Large text (≥ 18px or 14px bold): **≥ 3:1**.
- Non-text UI (icons, borders that convey state): **≥ 3:1**.
- NEVER use color alone to convey state. Pair red with an icon + text ("Error: …").

## Forms

- Every input has a `<label htmlFor>` or `aria-labelledby`. Placeholder ≠ label.
- Error messages are announced: use `aria-invalid` + `aria-describedby` pointing to the error element with `role="alert"` (or `aria-live="polite"`).
- Required fields: `aria-required="true"` AND a visible `*` or "(required)".

## Images & media

- Meaningful images: descriptive `alt`.
- Decorative images: `alt=""` (empty, not missing).
- Icons inside buttons that have visible text: `aria-hidden="true"` on the icon.
- Videos: captions required.

## Motion

- Respect `prefers-reduced-motion`: wrap non-essential animations in `motion-safe:` and provide a static fallback in `motion-reduce:`.
- Framer Motion: pass `useReducedMotion()` and gate animations.

## Modals & dialogs

- shadcn `Dialog` handles focus trap, `aria-modal`, and Escape-to-close — use it instead of rolling your own.
- Return focus to the trigger when the dialog closes.

## Screen-reader-only utility

```tsx
<span className="sr-only">Saved successfully</span>
```

Use for context that's visually obvious but not announced (e.g. icon-only buttons that already have `aria-label`).

## Automated checks

- Run `axe-core` via Playwright on the main flows (login, dashboard, admin) in CI.
- ESLint `eslint-plugin-jsx-a11y` is part of `next/core-web-vitals`.
- Lighthouse / PageSpeed score: aim for **≥ 95** accessibility on the home + main authed pages.

## Live regions

- Toasts (sonner) are already `role="status"` + `aria-live="polite"`.
- For error toasts, use the `error` variant which switches to `aria-live="assertive"`.
