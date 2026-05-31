import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo/site";
import { siteConfig } from "@/config/site";

/**
 * Default Open Graph / share-card image, 1200x630. Neutral placeholder design —
 * replace the layout/typography with your brand. Rendered by next/og and cached;
 * a static fallback can live at public/og/og-fallback.png.
 *
 * Lives under [locale]/ so it attaches to the localized pages (a root-level image
 * route is 404'd by the next-intl middleware matcher).
 */

export const runtime = "nodejs";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        color: "#111111",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#666666" }}>
        {SITE_NAME}
      </div>
      <div style={{ display: "flex", fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>
        {siteConfig.description}
      </div>
      <div style={{ display: "flex", width: 200, height: 6, background: "#111111" }} />
    </div>,
    size,
  );
}
