import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { isAdmin } from "@/lib/auth/is-admin";
import { Link } from "@/i18n/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth — middleware also gates this route. We re-check here so
  // even a misconfigured middleware can't leak the admin UI.
  if (!(await isAdmin())) {
    redirect({ href: "/", locale: "en" });
  }

  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-screen">
      <aside
        aria-label="Admin navigation"
        className="border-border bg-muted/30 w-56 shrink-0 border-r p-4"
      >
        <h2 className="mb-4 text-lg font-semibold">{t("title")}</h2>
        <nav className="flex flex-col gap-1">
          <Link
            href="/admin"
            className="hover:bg-accent rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("title")}
          </Link>
          <Link
            href="/admin/users"
            className="hover:bg-accent rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("users")}
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
