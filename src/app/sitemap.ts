import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo/site";

/**
 * Sitemap with hreflang alternates per entry so search engines read each locale
 * as a reciprocal alternate (not duplicate content). Add your routes to
 * STATIC_ROUTES (clean paths, no locale prefix) and dynamic entries below.
 */
const STATIC_ROUTES = [""] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // next-intl locale code → hreflang code for the languages map.
  const HREFLANG: Record<string, string> = { en: "en", pt: "pt-BR", es: "es-ES" };

  const localizedEntry = (path: string, priority: number): MetadataRoute.Sitemap => {
    const languages: Record<string, string> = {};
    for (const loc of routing.locales) {
      languages[HREFLANG[loc] ?? loc] = absoluteUrl(loc, path);
    }
    languages["x-default"] = absoluteUrl(routing.defaultLocale, path);

    return routing.locales.map((loc, index) => ({
      url: absoluteUrl(loc, path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: index === 0 ? priority : Math.max(priority - 0.1, 0.1),
      alternates: { languages },
    }));
  };

  return STATIC_ROUTES.flatMap((path) => localizedEntry(path, path === "" ? 1 : 0.8));
}
