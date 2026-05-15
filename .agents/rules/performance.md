# Performance

A slow page is a broken page. The user noticed before you did.

## Core Web Vitals targets (75th percentile, mobile)

- **LCP** ≤ 2.5 s — Largest Contentful Paint
- **INP** ≤ 200 ms — Interaction to Next Paint (replaced FID in 2024)
- **CLS** ≤ 0.1 — Cumulative Layout Shift
- **TTFB** ≤ 800 ms — server response
- **FCP** ≤ 1.8 s — First Contentful Paint

Verify on the PostHog Web Vitals dashboard before declaring a feature done.

## Rendering — server-first

- Default to **Server Components**. Add `"use client"` ONLY when you need: state, effects, event handlers, browser APIs, or a client-only library.
- Push `"use client"` DOWN the tree. A leaf component should be client; the page/layout above it should be server.
- Stream with React 19 async Server Components + `<Suspense>` — show a partial UI fast, fill in the slow parts.
- Prefer **SSG / ISR** (`export const revalidate = 60`) over per-request SSR for content that isn't user-specific.
- Use `revalidatePath` / `revalidateTag` after mutations. Don't slap `dynamic = "force-dynamic"` on every route.
- Fetch in parallel:

  ```ts
  // ✅ parallel
  const [user, prefs] = await Promise.all([getUser(), getPrefs()]);

  // ❌ waterfall
  const user = await getUser();
  const prefs = await getPrefs();
  ```

## Interaction responsiveness (INP)

- Wrap router navigation in `startTransition` so the click stays responsive:

  ```ts
  import { startTransition } from "react";
  startTransition(() => router.push("/dashboard"));
  ```

  Or use the project helper:

  ```ts
  import { useTransitionRouter } from "@/lib/perf/start-transition-navigate";
  const { push, isPending } = useTransitionRouter();
  push("/dashboard");
  ```

- Fire-and-forget non-critical work BEFORE navigating, don't `await` it:

  ```ts
  void track("cta_clicked", { id });
  router.push("/checkout");
  ```

- `useDeferredValue` for expensive derived UI (filtered lists, large search results).
- `useTransition` for non-urgent state updates (tab switches, filter changes).
- Debounce input handlers ≥ 150 ms for autocomplete / search.
- Virtualize lists > ~50 items (react-virtual, or shadcn data-table virtualization).
- Keep re-render scope tight: zustand selectors `useStore((s) => s.field)`; `React.memo` on heavy pure list items.

## Data + cache

- Next 16 GET `fetch()` defaults to `cache: "force-cache"` — leave it on when the data is stable.
- Use `cache: "no-store"` only when the response is truly per-request.
- Tag fetches: `fetch(url, { next: { tags: ["users"] } })` and call `revalidateTag("users")` from mutations.
- `<Link prefetch>` is on by default in the App Router — let it work.
- React 19's `preload()` / `preconnect()` patterns help with critical resources.

## Lazy load

See `lazy-loading.md`. Short version: anything heavy / below the fold / behind an interaction → `next/dynamic` with a dimension-matched skeleton.

## Assets

- **Images**: `next/image`, AVIF/WebP, correct `sizes` prop, `priority` only on the LCP hero, always `width`+`height` (or `fill` + aspect ratio).
- **Fonts**: `next/font` (Geist already wired), `display: "swap"`, preload only critical weights.
- **CSS**: Tailwind v4 JIT generates minimal CSS. Keep `globals.css` small; no global utility dumps.
- **Bundle budget**: per-route First Load JS ≤ **200 KB** compressed; shared chunk ≤ **130 KB**. Read it from `next build` output.

## Bundle analysis

```bash
npm run analyze    # ANALYZE=true next build
```

`@next/bundle-analyzer` is wired in `next.config.ts`. Treemap opens at the end of the build. If a route is over budget, the treemap shows you who to blame.

## Monitoring

- PostHog Web Vitals is enabled via `capture_performance: true` in `src/lib/analytics/posthog-client.tsx`. It auto-rolls up LCP/INP/CLS by route.
- After a substantial change, check the dashboard before closing the task.

## Pitfalls

- `"use client"` at the top of a layout → the entire subtree becomes client. NEVER do this.
- Importing server-only utils into a `"use client"` file ships them (and their deps) to the browser.
- `lucide-react` is tree-shakable — verify imports are NAMED (`import { User } from "lucide-react"`).
- Synchronous JSON imports of locale files in client bundles — use `next-intl`'s request config; never `import en from "@/messages/en.json"` at top level of a client file.
- Spreading huge objects through context providers re-renders every consumer. Split contexts or use zustand.
- Forgetting `revalidatePath` after a mutation leaves stale UI.
- `router.refresh()` in event handlers re-fetches the whole route — measure before reaching for it; usually `revalidateTag` from a server action is what you want.
- `await`-ing analytics or non-critical async work before `router.push` — that's where the 1–2 s freezes come from.
