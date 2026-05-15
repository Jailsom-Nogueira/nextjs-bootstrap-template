import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type LazyClientOptions = {
  /** Default: true. Set to false ONLY when the component touches `window` / browser APIs. */
  ssr?: boolean;
  /** Tailwind classes for the Skeleton fallback. Match the final component's dimensions to avoid CLS. */
  skeletonClassName?: string;
};

/**
 * Lazy-load a client component below the fold.
 *
 * - Default `ssr: true` keeps SEO and first paint intact.
 * - Always renders a `<Skeleton>` fallback. Pass `skeletonClassName` to match real dimensions.
 *
 * @example
 * const Chart = lazyClient(() => import("@/components/lazy/heavy-chart-example"));
 */
export function lazyClient<P extends object = Record<string, never>>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  opts: LazyClientOptions = {},
) {
  return dynamic(loader, {
    ssr: opts.ssr ?? true,
    loading: () => <Skeleton className={opts.skeletonClassName ?? "h-64 w-full"} />,
  });
}
