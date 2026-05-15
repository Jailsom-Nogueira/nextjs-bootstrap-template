import "server-only";

import { getPostHogServer } from "./posthog-server";
import { type EventName } from "./event-names";
import { scrubPII } from "./scrub";

/**
 * Server-side analytics tracker. Always use this — never call PostHog directly.
 */
export async function trackServer(
  distinctId: string,
  event: EventName,
  properties: Record<string, unknown> = {},
) {
  const client = getPostHogServer();
  if (!client) return;
  try {
    client.capture({
      distinctId,
      event,
      properties: scrubPII(properties),
    });
    await client.flush();
  } catch (err) {
    console.error("[analytics] trackServer failed", err);
  }
}
