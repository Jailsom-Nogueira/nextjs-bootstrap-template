import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

// TODO: set REPO_URL to the real GitHub repo URL once published.
const REPO_URL = "https://github.com";

/**
 * Site footer.
 *
 * Server Component. Mounted in `[locale]/layout.tsx` so it appears on every
 * locale-scoped route.
 */
export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6 lg:px-8">
        <p>
          {t("copyright")} <span className="mx-1.5 opacity-50">·</span>
          {t("license")}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/#features"
            className="hover:text-foreground focus-visible:ring-ring rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("docs")}
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${t("github")} (opens in new tab)`}
            className="hover:text-foreground focus-visible:ring-ring rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("github")}
          </a>
        </div>
      </div>
    </footer>
  );
}
