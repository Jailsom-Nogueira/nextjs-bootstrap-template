import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, SITE_NAME, type LocalizedPaths } from "@/lib/seo/site";

/**
 * Open Graph + Twitter Card builders. Consumed by `buildMetadata` so every route
 * emits complete og:* / twitter:* tags from one assembly point (no hand-written
 * social tags per page). The OG/Twitter IMAGE comes from Next's file-based
 * convention (`opengraph-image.tsx`), which injects absolute image URLs.
 *
 * Brand-neutral: replace TWITTER_HANDLE per project (or remove if unused).
 */

const TWITTER_HANDLE: string | undefined = undefined;

// Map next-intl locale codes → Open Graph locale codes. Extend per project.
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  pt: "pt_BR",
  es: "es_ES",
};

function ogLocale(locale: Locale): string {
  return OG_LOCALE[locale] ?? "en_US";
}

export type OgType = "website" | "article";

export type BuildOgArgs = {
  locale: Locale;
  paths: LocalizedPaths;
  title?: string | undefined;
  description?: string | undefined;
  type?: OgType | undefined;
  publishedTime?: string | null | undefined;
};

export function buildOpenGraph({
  locale,
  paths,
  title,
  description,
  type = "website",
  publishedTime,
}: BuildOgArgs): { openGraph: Metadata["openGraph"]; twitter: Metadata["twitter"] } {
  const url = absoluteUrl(locale, paths[locale]);
  const alternateLocale = routing.locales
    .filter((loc) => loc !== locale)
    .map((loc) => ogLocale(loc));

  const openGraph: Metadata["openGraph"] = {
    type,
    url,
    siteName: SITE_NAME,
    locale: ogLocale(locale),
    alternateLocale,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(type === "article" && publishedTime ? { publishedTime } : {}),
  };

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    ...(TWITTER_HANDLE ? { creator: TWITTER_HANDLE, site: TWITTER_HANDLE } : {}),
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };

  return { openGraph, twitter };
}
