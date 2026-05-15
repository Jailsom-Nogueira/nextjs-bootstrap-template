import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground max-w-md text-center">{t("subtitle")}</p>
      <div className="flex gap-3 text-sm">
        <Link className="underline" href="/login">
          {tNav("signIn")}
        </Link>
        <Link className="underline" href="/dashboard">
          {tNav("dashboard")}
        </Link>
        <Link className="underline" href="/admin">
          {tNav("admin")}
        </Link>
      </div>
    </main>
  );
}
