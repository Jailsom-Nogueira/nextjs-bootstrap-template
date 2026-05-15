import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import { lazyClient } from "@/lib/lazy";

// Below-the-fold heavy widget — lazy-loaded with a dimension-matched skeleton.
// SSR stays ON by default so the placeholder is server-rendered for SEO.
const HeavyChartExample = lazyClient(() => import("@/components/lazy/heavy-chart-example"), {
  skeletonClassName: "h-64 w-full max-w-2xl",
});

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

      {/* Above-the-fold: eager, translated, server-rendered. */}
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

      {/* Below-the-fold: lazy-loaded heavy client component (demo of `lazyClient`). */}
      <section className="mt-12 w-full max-w-2xl">
        <HeavyChartExample />
      </section>
    </main>
  );
}
