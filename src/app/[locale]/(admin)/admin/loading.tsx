import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streaming fallback for the (admin) segment.
 * Shape matches the admin shell so the layout doesn't shift when content arrives.
 */
export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
