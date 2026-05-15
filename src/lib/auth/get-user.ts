import "server-only";

import { createClient } from "@/supabase/server";

/**
 * Get the currently authenticated user (server-side). Returns null if not signed in.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
