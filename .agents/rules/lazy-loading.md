# Lazy loading

Ship the smallest possible critical bundle. Defer everything else until the user (or the viewport) asks for it.

## When TO lazy-load

- Heavy components below the fold (hero is loaded eagerly; everything beneath is fair game).
- Modals, dialogs, sheets, popovers, drawers — they're closed by default.
- Charts, rich-text editors, code editors, maps, 3D viewers, PDF renderers, image croppers, video players.
- Third-party widgets: chat/intercom, calendar pickers (when the lib is bulky), embedded video.
- Admin panels and route segments most users never visit.
- Locale-specific assets that aren't the active locale (next-intl already handles message-bundle splitting; honor it).
- Anything that would push the route's First Load JS over the budget (see `performance.md`).

## When NOT to lazy-load

- Above-the-fold critical content — lazy-loading what's needed for FCP/LCP makes the page slower, not faster.
- Server Components — they're already streamed by Next; wrapping them in `dynamic()` is wrong and often a no-op.
- Tiny components (< ~5 KB minified). The overhead of a separate chunk + extra request usually costs more than the savings.
- Anything in the initial route bundle the user needs to interact with within the first 100 ms.
- Shared primitives used on most routes (Button, Input, Skeleton) — they belong in the shared chunk.

## How — `next/dynamic` (preferred)

```tsx
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Default: SSR on (keeps SEO + first paint), skeleton fallback matches final size.
const Chart = dynamic(() => import("@/components/charts/heavy-chart"), {
  loading: () => <Skeleton className="h-64 w-full" />,
});

// Only disable SSR when the component touches `window` / browser-only APIs.
const RichEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
});
```

Or use the typed helper in `src/lib/lazy.tsx`:

```tsx
import { lazyClient } from "@/lib/lazy";
const Chart = lazyClient(() => import("@/components/charts/heavy-chart"));
```

## How — `React.lazy` + `Suspense`

Use when you control the `Suspense` boundary yourself (e.g. inside a client component that already owns one). For route-level work, prefer `next/dynamic` or App Router `loading.tsx`.

```tsx
import { lazy, Suspense } from "react";
const Chart = lazy(() => import("@/components/charts/heavy-chart"));
// <Suspense fallback={<Skeleton className="h-64 w-full" />}><Chart /></Suspense>
```

## How — App Router `loading.tsx`

Place a `loading.tsx` next to a `page.tsx` and Next streams it as the Suspense fallback while the segment renders. Free progressive rendering.

```
src/app/[locale]/loading.tsx                    // root locale segment
src/app/[locale]/(admin)/admin/loading.tsx      // admin segment
```

Keep the skeleton SHAPE-MATCHED to the real UI to prevent CLS.

## Images

- `next/image` is lazy by default. Do NOT wrap it in `next/dynamic`.
- Mark `priority` ONLY on the LCP hero image (one per route, max).
- ALWAYS provide `width` + `height` OR `fill` inside an aspect-ratio container — otherwise CLS spikes.
- Set the `sizes` prop on responsive images so the browser picks the right srcset entry.

## Fonts

- `next/font` is used (Geist). Keep `display: "swap"` so text renders before the font loads.
- Subset to the locales actually used. Don't preload weights you won't render in the first viewport.

## Data

- Async Server Components + `<Suspense>` stream data without blocking the shell — prefer this over client-side fetching for initial render.
- On the client, use SWR / React Query only for revalidation / mutation flows.
- NEVER `await` data the user can't see immediately — kick it off in parallel with `Promise.all`.

## Third-party scripts

```tsx
import Script from "next/script";

<Script src="https://example.com/widget.js" strategy="lazyOnload" />;
// "afterInteractive" for things needed soon after hydration.
// "beforeInteractive" is reserved for critical polyfills — almost never the right choice.
```

## Module-level lazy

Tree-shake aggressively, then dynamic-import the rest:

- `date-fns` — tree-shakable, fine to import named functions at module top.
- `lodash` — import per-function (`lodash/debounce`) or use ESM-friendly alternatives.
- `chart.js`, `recharts`, `monaco-editor`, `pdfjs-dist`, `three` — always `dynamic(() => import(...))` inside the component that needs them.

## next-intl messages

next-intl already loads only the active locale. Do NOT `import en from "@/messages/en.json"` etc. at module top — that defeats per-locale splitting.

## Bundle hygiene

- Keep `"use client"` boundaries small. Push state down to leaf components; let the rest be Server Components.
- Audit with `npm run analyze` (wires `@next/bundle-analyzer`). The treemap shows what's inflating each route.
- Re-read `performance.md` for the per-route budget (200 KB compressed).

## Pitfalls

- `dynamic({ ssr: false })` breaks SSR/SEO for that subtree — use only when the component genuinely needs `window`.
- A loading skeleton that doesn't match final dimensions still causes CLS. Match heights/widths to the real UI.
- Double-loading: if a Server Component renders a chart server-side AND a Client Component renders the same chart client-side, the library ships twice. Pick one boundary.
- `dynamic(() => import("..."))` placed inside a render function creates a new chunk on every render — define it at module scope.
- Importing a server-only util into a `"use client"` file pulls it (and its deps) into the client bundle. Use `import "server-only"` to fail fast.
