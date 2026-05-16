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
  return () => undefined;
}

/**
 * One-click theme toggle. Cycles light ↔ dark.
 *
 * Hydration discipline: the SAME static `aria-label` and `title` ("Toggle
 * theme") render on server and client. The visual icon (Sun in dark mode,
 * Moon in light mode) only flips AFTER mount via `useSyncExternalStore`,
 * so the server pass renders an inert placeholder of the same dimensions
 * — no CLS, no aria-label mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={t("toggle")}
      title={t("toggle")}
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
    </button>
  );
}
