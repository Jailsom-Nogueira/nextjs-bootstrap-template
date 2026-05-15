import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/supabase/server-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logger } from "@/lib/logger/logger";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

async function loadProfiles(): Promise<ProfileRow[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      logger.warn({ err: error.message }, "Failed to load profiles");
      return [];
    }
    return (data as ProfileRow[]) ?? [];
  } catch (err) {
    logger.warn(
      { err: err instanceof Error ? err.message : String(err) },
      "Admin client unavailable (SUPABASE_SERVICE_ROLE_KEY missing?)",
    );
    return [];
  }
}

export default async function AdminUsersPage() {
  const t = await getTranslations("admin");
  const profiles = await loadProfiles();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("users")}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.full_name ?? p.id.slice(0, 8)}</TableCell>
              <TableCell>{p.role}</TableCell>
              <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
