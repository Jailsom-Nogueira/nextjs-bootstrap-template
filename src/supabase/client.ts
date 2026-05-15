import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

/**
 * Browser-side Supabase client. Anon key only — RLS-protected.
 */
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
