import { getTranslations } from "next-intl/server";

/**
 * Site footer.
 *
 * Server Component. Mounted in `[locale]/layout.tsx` so it appears on every
 * locale-scoped route.
 */
export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-border/40 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6 lg:px-8">
        <p>
          {t("copyright")} <span className="mx-1.5 opacity-50">·</span>
          {t("license")}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#features"
            className="hover:text-foreground focus-visible:ring-ring rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("docs")}
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-foreground focus-visible:ring-ring rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("github")}
          </a>
        </div>
      </div>
    </footer>
  );
}
