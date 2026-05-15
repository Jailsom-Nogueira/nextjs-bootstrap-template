# Next.js 16 conventions (this repo)

Specific do/don't for the App Router + React 19 patterns we use. Cross-reference `.agents/rules/performance.md` and `.agents/rules/lazy-loading.md`.

## Do

| Pattern                             | Notes                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Server Components by default        | Only opt into `'use client'` on the leaf that actually needs interactivity / hooks        |
| Push `'use client'` DOWN            | A page or layout being a Server Component lets us interleave async data fetches naturally |
| `await` dynamic APIs                | `cookies()`, `headers()`, `params`, `searchParams` are async in Next 15+                  |
| Revalidate explicitly               | `revalidatePath('/x')` or `revalidateTag('x')` from a mutation server action              |
| Parallel reads                      | `const [a, b] = await Promise.all([fetchA(), fetchB()])` inside Server Components         |
| Route-level `loading.tsx`           | Ship one per meaningful segment; wrap below-fold blocks in `<Suspense>`                   |
| `next/dynamic` for heavy below-fold | Charts, editors, maps, PDF, 3D, rich-text — use `lazyClient` from `@/lib/lazy`            |
| `<Link prefetch>` default           | Only opt out for huge below-fold routes                                                   |
| `<Image priority>` on LCP hero only | Everywhere else, let `next/image` lazy-load                                               |
| Fire-and-forget non-critical work   | `void track(...)` + `startTransition(() => router.push(...))` for snappy navigation       |
| Type your server action returns     | Return a `Result<T>` shape; never throw across the boundary                               |
| Bundle visualization                | `npm run analyze` opens the treemap; keep per-route First Load JS ≤ 200KB                 |

## Don't

| Anti-pattern                                  | Why it hurts                                                         |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `'use client'` on a layout or page            | Forces the whole tree client-side; defeats Server Components         |
| Sync read of `cookies()` / `headers()`        | Runtime error in Next 15+; breaks the build                          |
| `export const dynamic = 'force-dynamic'`      | Often a band-aid for a real cache-key bug — find the root cause      |
| Barrel `index.ts` re-exports                  | Hurts tree-shaking and invites circular imports                      |
| Parallel / intercepting routes "just because" | Powerful but expensive — only when the UX demands it                 |
| `await` non-critical work before navigate     | Blocks the user; use `void` + `startTransition`                      |
| `Date.now()` / `Math.random()` in src         | Non-deterministic — inject a clock / rng so tests can pin them       |
| `router.refresh()` in event handlers          | Often a workaround for missing `revalidatePath` / `revalidateTag`    |
| Eager imports of `chart.js`, `monaco`, etc.   | Bloats First Load JS; lazy-load these                                |
| `<Image>` without `width`/`height`            | Causes CLS                                                           |
| `'use server'` in a file that also exports UI | Server actions must live in pure server files (or be inline in RSCs) |

## Where the boundaries live in this repo

- Server Components: the default for everything under `src/app/[locale]/**` unless the file starts with `'use client'`.
- Client islands: components in `src/components/` that explicitly start with `'use client'`. Anything heavier than ~5KB goes through `lazyClient` from `@/lib/lazy`.
- Server Actions: live next to the route that calls them; start with `'use server'` and validate with zod.
- Route Handlers: `src/app/api/**/route.ts`. Use these only when an HTTP-level contract is required (webhooks, third parties). Otherwise prefer server actions.
- Middleware: `src/middleware.ts`. Edge runtime — keep it lean (session refresh + locale + admin gate). Heavy logic does NOT belong here.

## References

- `.agents/rules/performance.md`
- `.agents/rules/lazy-loading.md`
- `.docs/architecture.md`
