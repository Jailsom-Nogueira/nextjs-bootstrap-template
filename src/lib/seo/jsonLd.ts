import { siteConfig } from "@/config/site";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/**
 * Typed JSON-LD builders — the single source of structured-entity facts in the
 * rendered HTML. Render with the `<JsonLd>` component.
 *
 * Brand-neutral skeletons: replace the Organization/Person facts (name, url,
 * description, sameAs, knowsAbout) with the project's real entity. Posts/articles
 * use `Article` / `CreativeWork`, never `HowTo` step lists.
 */

const ORG_ID = `${SITE_URL}/#org`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export type JsonLdObject = Record<string, unknown>;

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: siteConfig.description,
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
  };
}

export type ArticleJsonLdInput = {
  url: string;
  headline: string;
  description?: string | null;
  inLanguage?: string;
  datePublished?: string | null;
};

export function articleJsonLd(input: ArticleJsonLdInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": input.url,
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    url: input.url,
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export type BreadcrumbItem = { name: string; url: string };

export function breadcrumbJsonLd(trail: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
