import { defineRouting } from "next-intl/routing";

/**
 * Locale routing config.
 *
 * - `en` — English (en-us), the default.
 * - `pt` — Portuguese (pt-br).
 * - `es` — Spanish (es-es).
 *
 * `localePrefix: "as-needed"` keeps the default locale at the root (`/`) and
 * prefixes only non-default locales (`/pt`, `/es`). Reduces churn for the
 * majority of users while keeping URLs canonical per locale.
 *
 * `localeDetection: true` (explicit, also the next-intl default) means: on
 * a first visit with no `NEXT_LOCALE` cookie set, the middleware reads the
 * browser's `Accept-Language` header and redirects to the best match. Once
 * the user (or the `LocaleSwitcher`) picks a locale, the `NEXT_LOCALE`
 * cookie is set and takes precedence over `Accept-Language` on subsequent
 * requests. Result: browser default on first visit, user choice respected
 * forever after.
 */
export const routing = defineRouting({
  locales: ["en", "pt", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
