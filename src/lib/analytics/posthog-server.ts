import "server-only";

import { PostHog } from "posthog-node";
import { env } from "@/env";

let _client: PostHog | null = null;

/**
 * Singleton PostHog server client. Lazy — returns null if no key configured.
 * Always remember to call `.shutdown()` in long-lived contexts.
 */
export function getPostHogServer(): PostHog | null {
  const key = env.POSTHOG_API_KEY ?? env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (_client) return _client;
  _client = new PostHog(key, {
    host: "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  return _client;
}
