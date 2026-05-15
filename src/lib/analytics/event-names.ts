/**
 * Canonical event names. Add new ones here, NEVER inline strings at call sites.
 * Naming: `domain.action` (lowercase, dot-separated).
 */
export const EVENT = {
  // Auth
  AUTH_SIGNED_IN: "auth.signed_in",
  AUTH_SIGNED_OUT: "auth.signed_out",
  AUTH_SIGNED_UP: "auth.signed_up",

  // Page / nav
  PAGE_VIEWED: "page.viewed",

  // Errors
  ERROR_BOUNDARY_HIT: "error.boundary_hit",
} as const;

export type EventName = (typeof EVENT)[keyof typeof EVENT];
