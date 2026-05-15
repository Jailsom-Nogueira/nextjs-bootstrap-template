"use client";

import posthog from "posthog-js";
import { type EventName } from "./event-names";
import { scrubPII } from "./scrub";

/**
 * Client-side analytics tracker. Always use this — never call posthog.capture() directly.
 */
export function track(event: EventName, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, scrubPII(properties));
  } catch (err) {
    console.error("[analytics] track failed", err);
  }
}

export function identify(distinctId: string, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(distinctId, scrubPII(properties));
  } catch (err) {
    console.error("[analytics] identify failed", err);
  }
}

export function reset() {
  if (typeof window === "undefined") return;
  try {
    posthog.reset();
  } catch (err) {
    console.error("[analytics] reset failed", err);
  }
}
