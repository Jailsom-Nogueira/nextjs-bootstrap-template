import type { JsonLdObject } from "@/lib/seo/jsonLd";

/**
 * Renders one or more JSON-LD objects as `<script type="application/ld+json">`.
 * Server component — no client JS. Serialized JSON escapes `<` so a `</script>`
 * sequence inside any string can never break out of the script context (XSS-safe).
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const payload = Array.isArray(data) ? data : [data];
  const json = JSON.stringify(payload.length === 1 ? payload[0] : payload).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
