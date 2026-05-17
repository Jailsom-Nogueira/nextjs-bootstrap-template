"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { env } from "@/env";

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;
    const query = searchParams.toString();
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      capture_performance: true, // Web Vitals (LCP / INP / CLS) auto-rollup
      person_profiles: "identified_only",
    });
  }, []);

  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <PostHogPageview />
      {children}
    </PHProvider>
  );
}
