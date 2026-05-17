import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validated environment variables. Fails fast at boot if anything required is missing.
 *
 * Import as: `import { env } from "@/env";`
 *
 * Add NEW vars in BOTH `server`/`client` schema AND `runtimeEnv` map.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    SUPABASE_PROJECT_REF: z.string().min(1).optional(),
    POSTHOG_API_KEY: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    EMAIL_FROM: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).default("/ingest"),
    NEXT_PUBLIC_REPOSITORY_URL: z
      .string()
      .url()
      .default("https://github.com/your-org/nextjs-bootstrap-template"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_REPOSITORY_URL: process.env.NEXT_PUBLIC_REPOSITORY_URL,
  },
  // Skip validation during build IF explicitly requested (CI without secrets).
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
