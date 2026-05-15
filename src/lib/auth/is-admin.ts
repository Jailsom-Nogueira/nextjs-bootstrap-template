import "server-only";

import { getUserRole } from "@/lib/auth/get-user-role";

/**
 * Returns true when the current authenticated user has `profiles.role = 'admin'`.
 * Server-only — never call from client components.
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}
