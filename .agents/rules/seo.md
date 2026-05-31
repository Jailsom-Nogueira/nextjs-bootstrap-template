# SEO, AEO, metadata, icons, and share previews

Rules when touching `<head>`, metadata, structured data, sitemap, robots, icons,
or social-share surfaces. SEO = ranking + rich results in search. AEO = being
citable by answer engines (ChatGPT, Perplexity, Gemini, Claude, Google AI).

## Single assembly point

- Build every public route's `Metadata` through `buildMetadata()` in
  `src/lib/seo/metadata.ts` (primitives in `src/lib/seo/site.ts`, OG in
  `src/lib/seo/og.ts`). Never hand-write canonical/hreflang/og per page.
- `buildMetadata` owns `metadataBase`, canonical, and `alternates.languages`
  (every locale + x-default). hreflang MUST be reciprocal — the helper generates
  all sides from one call.
- The root layout owns the title template and `metadataBase`; page titles are
  bare.

## Structured data (JSON-LD)

- Builders in `src/lib/seo/jsonLd.ts`, rendered via the XSS-safe `<JsonLd>`
  component. Organization/Website at the root; Article/Breadcrumb on content.
- Replace the placeholder Organization/Website facts with your real entity.
- Posts/articles use `Article` / `CreativeWork`, never `HowTo` step lists.

## Icons

- One source mark: `.docs/assets/brand/icon-source.svg`. Regenerate every raster
  with `npm run icons:generate`; commit the generated assets.
- Served via Next file conventions in `src/app/` (`icon.svg`, `favicon.ico`,
  `apple-icon.png`); manifest rasters in `public/` (`icon-192/512.png`,
  `icon-maskable-512.png`).
- Replace the placeholder mark with your brand before launch.

## Open Graph / share previews

- OG/Twitter objects assembled in `og.ts` and merged into `buildMetadata`.
- OG image generated with `next/og` (`[locale]/opengraph-image.tsx`); absolute
  URLs via `metadataBase`. Add a static fallback in `public/og/` if desired.

## robots / AEO posture

- `src/app/robots.ts` documents the AI-crawler posture (default: allow public,
  disallow private). Flip the AI block to `disallow: "/"` if your project must
  not be ingested. Keep admin/auth/api private regardless.

## Verification

- `npm run qa`; `npm run qa:visual` for icon/OG image changes. Cover new SEO
  helpers with unit tests and icon/OG routes with e2e content-type assertions.
