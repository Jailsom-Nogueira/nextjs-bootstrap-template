"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/**
 * `useSyncExternalStore`-based mounted check. Returns false on the server
 * pass and during the first client render; true afterwards. Idiomatic in
 * React 19 (no setState-in-effect, ESLint-clean).
 */
function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function subscribe(): () => void {
  // No-op: we only care about the snapshot value flipping from server (false)
  // to client (true) on hydration. Never re-emits.
  return () => undefined;
}

/**
 * One-click theme toggle. Cycles light ↔ dark.
 *
 * System preference is honored on first load (via `defaultTheme="system"` in
 * the ThemeProvider) but explicit user clicks resolve to a concrete
 * light/dark value — that's the UX users expect from a toggle button.
 *
 * Renders a placeholder of the same size on the server pass to avoid layout
 * shift on hydration. After mount, swaps in the real icon for the current
 * resolved theme.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const mounted = useMounted();

  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";
  const label = isDark ? t("light") : t("dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={cn(
        "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring relative inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )
      ) : (
        <span className="block h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">{t("toggle")}</span>
    </button>
  );
}
