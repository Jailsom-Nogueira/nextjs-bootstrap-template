import { env } from "@/env";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

/**
 * SEO primitives with no intra-package dependencies — the base both
 * `metadata.ts` and `og.ts` build on, so neither imports the other (avoids a
 * dependency cycle). URL/locale helpers live here; the higher-level
 * `buildMetadata` / `buildOpenGraph` assemblers live in their own modules.
 *
 * Brand-neutral: name/description come from `siteConfig`. Replace those (and the
 * JSON-LD entity facts) per project.
 */

export const SITE_NAME = siteConfig.name;
export const SITE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
export const metadataBase = new URL(SITE_URL);

/** Clean URL path per locale (no locale prefix on the default locale). */
export type LocalizedPaths = Record<Locale, string>;

/** Apply the next-intl `as-needed` prefix rule: default locale stays at root. */
export function localizedHref(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean === "" ? "/" : clean;
  return `/${locale}${clean}`;
}

/** Absolute URL for a locale + clean path. */
export function absoluteUrl(locale: Locale, path: string): string {
  const href = localizedHref(locale, path);
  return `${SITE_URL}${href === "/" ? "" : href}` || SITE_URL;
}

/** Same clean path in every locale (most routes share the slug). */
export function samePath(path: string): LocalizedPaths {
  return Object.fromEntries(routing.locales.map((loc) => [loc, path])) as LocalizedPaths;
}
