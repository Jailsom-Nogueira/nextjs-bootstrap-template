"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
}

/**
 * Copy a one-line shell snippet to the clipboard with visual + assistive
 * feedback. Restores the idle icon after `RESET_MS`.
 *
 * a11y:
 *   - `aria-label` is dynamic: switches from "Copy to clipboard" to
 *     "Copied" on success so VoiceOver / NVDA announce the state.
 *   - `aria-live` region for screen-reader-only confirmation text.
 *   - Falls back silently if `navigator.clipboard` is unavailable (older
 *     browsers / non-HTTPS preview environments).
 */
const RESET_MS = 2000;

export function CopyButton({ text, className }: Props) {
  const t = useTranslations("common.copy");
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function onClick(): void {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), RESET_MS);
      })
      .catch(() => {
        // Clipboard API can reject (no permission, non-secure context).
        // Silent: the snippet is still visible and selectable.
      });
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={copied ? t("copied") : t("copy")}
        title={copied ? t("copied") : t("copy")}
        className={cn(
          "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
      >
        {copied ? (
          <Check className="text-primary h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t("copied") : ""}
      </span>
    </>
  );
}
