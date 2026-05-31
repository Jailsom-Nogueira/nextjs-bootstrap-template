import { env } from "@/env";

/**
 * Generic site configuration. New projects replace these placeholder values
 * (and the JSON-LD Person/Organization facts in `src/lib/seo/jsonLd.ts`, the OG
 * image wordmark, and the icon mark in `.docs/assets/brand/`) with their own
 * brand. Everything in `src/lib/seo/*` reads from here so there is one place to
 * rename the project.
 */
export const siteConfig = {
  /** Canonical repository URL (read from env so generated builds point at the project's GitHub URL). */
  repositoryUrl: env.NEXT_PUBLIC_REPOSITORY_URL,

  /** Public site/brand name. Used in titles, JSON-LD, OG cards. Replace per project. */
  name: "Next.js Bootstrap Template",

  /** Short tagline / default meta description. Replace per project. */
  description: "Next.js 16 + Supabase + PostHog + Resend template.",
} as const;
