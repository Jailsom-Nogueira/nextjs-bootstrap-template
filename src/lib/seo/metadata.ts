import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";
import { buildOpenGraph } from "@/lib/seo/og";
import {
  absoluteUrl,
  localizedHref,
  metadataBase,
  samePath,
  SITE_NAME,
  SITE_URL,
  type LocalizedPaths,
} from "@/lib/seo/site";

/**
 * Canonical URLs + reciprocal hreflang + full Metadata assembly for a
 * multi-locale site. Primitives (URLs, locale helpers) live in `@/lib/seo/site`
 * so this module and `@/lib/seo/og` share a base without a dependency cycle.
 * Re-exported here so `@/lib/seo/metadata` imports keep working.
 *
 * Generic pattern: every public route should build its Metadata through
 * `buildMetadata` so canonical, hreflang (every locale + x-default), the title
 * template, and metadataBase stay consistent.
 */

export {
  absoluteUrl,
  localizedHref,
  metadataBase,
  samePath,
  SITE_NAME,
  SITE_URL,
  type LocalizedPaths,
};

export function buildAlternates(
  locale: Locale,
  paths: LocalizedPaths,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrl(loc, paths[loc]);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, paths[routing.defaultLocale]);

  return {
    canonical: absoluteUrl(locale, paths[locale]),
    languages,
  };
}

export type BuildMetadataArgs = {
  locale: Locale;
  /** Clean path per locale (no locale prefix), e.g. samePath("/about"). */
  paths: LocalizedPaths;
  title?: string;
  description?: string;
  type?: "website" | "article";
  publishedTime?: string | null;
};

/**
 * Assemble Metadata for a public route: title, description, metadataBase,
 * canonical + hreflang alternates, and complete Open Graph + Twitter cards. The
 * root layout sets the title template, so `title` here is the bare page title.
 * og:image / twitter:image are injected by Next's file-based `opengraph-image`
 * convention.
 */
export function buildMetadata({
  locale,
  paths,
  title,
  description,
  type = "website",
  publishedTime,
}: BuildMetadataArgs): Metadata {
  const { openGraph, twitter } = buildOpenGraph({
    locale,
    paths,
    title,
    description,
    type,
    publishedTime,
  });

  return {
    metadataBase,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: buildAlternates(locale, paths),
    openGraph,
    twitter,
  };
}
