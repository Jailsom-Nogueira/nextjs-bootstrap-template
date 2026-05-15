import "server-only";

import { createClient } from "@/supabase/server";
import { logger } from "@/lib/logger/logger";

export type UserRole = "admin" | "user";

/**
 * Server-only: returns the current user's role from `public.profiles`.
 * Returns `null` if the user is not authenticated or has no profile row.
 */
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    logger.warn({ err: error.message }, "Failed to fetch profile role");
    return null;
  }
  if (!data) return null;

  const role = (data as { role: string }).role;
  return role === "admin" ? "admin" : "user";
}
