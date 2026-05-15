import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level streaming fallback for the locale segment.
 * Rendered by Next while the page's Server Components resolve.
 * Keep the SHAPE matched to the real page to prevent CLS.
 */
export default function LocaleLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-5 w-96" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </main>
  );
}
