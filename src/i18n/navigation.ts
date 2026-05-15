import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale-aware navigation primitives. Always import `Link`, `redirect`,
 * `usePathname`, `useRouter`, and `getPathname` from here — never from
 * `next/link` or `next/navigation` — so locale prefixes are preserved.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
