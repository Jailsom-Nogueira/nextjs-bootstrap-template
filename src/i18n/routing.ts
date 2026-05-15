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
 */
export const routing = defineRouting({
  locales: ["en", "pt", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
