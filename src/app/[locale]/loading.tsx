import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level streaming fallback for the locale segment.
 * Rendered by Next inside the LocaleLayout's <main> landmark while the
 * page's Server Components resolve. Uses <div> (not <main>) to avoid a
 * second landmark — exactly one <main> per document is the WCAG rule.
 * Keep the SHAPE matched to the real page to prevent CLS.
 */
export default function LocaleLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-5 w-96" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
