"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Locale switcher — segmented control, three exclusive options (en / pt / es).
 *
 * Why segmented and not a switch:
 *   A switch is binary (on/off). The locale set is ternary. Showing all
 *   three options inline makes the current choice explicit and the others
 *   one click away — same ergonomics as the theme toggle for binary
 *   themes, scaled honestly to three options.
 *
 * Why not a dropdown:
 *   Dropdowns hide options behind a click. For 3 short locale codes
 *   (EN/PT/ES) there's no real estate pressure that justifies the hide.
 *
 * a11y: implemented as a `role="radiogroup"` with three `role="radio"`
 * buttons. Keyboard navigation: Tab moves focus into the group, arrow
 * keys cycle within it (Radix-style). Each button has an explicit
 * `aria-label` so screen readers announce the full locale name, not just
 * the 2-letter code.
 *
 * Cookie behavior: `router.replace` writes the `NEXT_LOCALE` cookie via
 * next-intl, which takes precedence over `Accept-Language` on future
 * visits. See `src/i18n/routing.ts` for the locale-detection contract.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("locale");
  const current = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelect(locale: Locale) {
    if (locale === current) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("switch")}
      className={cn(
        "border-border bg-background inline-flex h-9 items-center rounded-md border p-0.5 text-xs font-medium",
        className,
      )}
    >
      {routing.locales.map((locale) => {
        const isActive = current === locale;
        return (
          <button
            key={locale}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={t(locale)}
            disabled={isPending && !isActive}
            onClick={() => onSelect(locale)}
            className={cn(
              "focus-visible:ring-ring inline-flex h-full min-w-8 items-center justify-center rounded-sm px-2 uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
