"use client";

import { useLayoutEffect } from "react";

/**
 * Synchronously sets `<html lang>` to the active locale on every render.
 *
 * Next.js 16 only allows one root layout to own the `<html>` element, but the
 * locale isn't known at root-layout level (it's a segment param). This client
 * component runs `useLayoutEffect` BEFORE paint, so the `lang` attribute is
 * present when assistive tech and accessibility scanners read the DOM.
 *
 * Pairs with `suppressHydrationWarning` on `<html>` to avoid mismatch noise.
 */
export function HtmlLangSync({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
