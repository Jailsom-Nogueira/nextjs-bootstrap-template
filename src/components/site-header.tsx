import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

// TODO: set REPO_URL to the real GitHub repo URL once published.
const REPO_URL = "https://github.com";

/**
 * Top sticky header.
 *
 * Server Component. Internally mounts two client components (LocaleSwitcher,
 * ThemeToggle) — Next handles the boundary automatically.
 */
export async function SiteHeader() {
  const t = await getTranslations("header");

  return (
    <header className="border-border bg-background sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
        >
          <Sparkles className="text-primary h-5 w-5" aria-hidden="true" />
          <span>{t("brand")}</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#features"
            className="hover:text-foreground text-muted-foreground focus-visible:ring-ring hidden rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
          >
            {t("docs")}
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${t("github")} (opens in new tab)`}
            className="hover:text-foreground text-muted-foreground focus-visible:ring-ring hidden rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
          >
            {t("github")}
          </a>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
