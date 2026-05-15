# Lazy components

This directory is the conventional home for **client components that should be lazy-loaded** via `next/dynamic` or the typed `lazyClient` helper in `@/lib/lazy`.

## When a component belongs here

- It's > ~5 KB minified, OR
- It pulls in a heavy third-party library (charts, editors, maps, PDF, 3D, rich-text), OR
- It renders below the fold, behind a modal, or only on a rarely-visited route.

## How to use

```tsx
// In a Server Component or a parent client component:
import { lazyClient } from "@/lib/lazy";

const HeavyChart = lazyClient(() => import("@/components/lazy/heavy-chart-example"));

export default function SomePage() {
  return (
    <section>
      {/* ... eager, above-the-fold content ... */}
      <HeavyChart />
    </section>
  );
}
```

The helper provides an SSR-on default and a dimension-matched `Skeleton` fallback. Disable SSR (`{ ssr: false }`) ONLY when the component touches `window` / browser-only APIs.

## See also

- `.agents/rules/lazy-loading.md`
- `.agents/rules/performance.md`
