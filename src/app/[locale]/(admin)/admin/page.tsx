import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">Welcome to the admin panel.</p>
    </section>
  );
}
