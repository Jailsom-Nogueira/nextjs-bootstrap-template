"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";

type NavigateOptions = Parameters<ReturnType<typeof useRouter>["push"]>[1];

/**
 * Locale-aware router wrapped in `startTransition` so the click stays
 * responsive while React renders the destination. Use this instead of
 * `useRouter().push(...)` in event handlers to keep INP under 200 ms.
 *
 * @example
 * const { push, isPending } = useTransitionRouter();
 * <button onClick={() => push("/dashboard")} disabled={isPending}>Go</button>
 */
export function useTransitionRouter() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      startTransition(() => {
        router.push(href, options);
      });
    },
    [router],
  );

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      startTransition(() => {
        router.replace(href, options);
      });
    },
    [router],
  );

  return { push, replace, isPending };
}
