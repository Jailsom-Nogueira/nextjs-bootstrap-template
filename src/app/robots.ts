import type { MetadataRoute } from "next";
import { env } from "@/env";

/**
 * robots.txt.
 *
 * Documented AI-crawler posture (a project decision): the default below ALLOWS
 * AI / answer-engine crawlers on public content, mirroring the general-crawler
 * rules, while keeping private surfaces disallowed for every agent. If your
 * project should NOT be ingested by AI crawlers, move the AI_CRAWLERS block to a
 * `disallow: "/"` rule instead. Keep admin/auth/api private regardless.
 */
const PRIVATE_PATHS = ["/admin", "/dashboard", "/login", "/signup", "/api/"];

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
