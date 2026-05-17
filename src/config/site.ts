import { env } from "@/env";

export const siteConfig = {
  repositoryUrl: env.NEXT_PUBLIC_REPOSITORY_URL,
} as const;
