import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";

import { routing } from "@/i18n/routing";
import { env } from "@/env";

/**
 * Composed middleware (Next 16 still ships `middleware.ts`; renamed to
 * `proxy.ts` in newer betas — keep this filename for shadcn/Supabase
 * compatibility).
 *
 * Order:
 *   1. next-intl handles locale routing + sets the `NEXT_LOCALE` cookie
 *   2. Supabase refreshes the session and propagates new cookies
 *   3. Admin gate: any `/(<locale>)?/admin/...` URL requires role=admin
 */
const intlMiddleware = createMiddleware(routing);

const LOCALE_PREFIX_RE = new RegExp(`^/(?:${routing.locales.join("|")})(?=/|$)`);

function getAdminMatch(pathname: string): { locale: string; isAdminRoute: boolean } {
  const localeMatch = pathname.match(LOCALE_PREFIX_RE);
  const locale = localeMatch ? localeMatch[0].slice(1) : routing.defaultLocale;
  const stripped = localeMatch ? pathname.slice(localeMatch[0].length) : pathname;
  return {
    locale,
    isAdminRoute: stripped === "/admin" || stripped.startsWith("/admin/"),
  };
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // 1. next-intl
  const intlResponse = intlMiddleware(request);

  // 2. Supabase session refresh (mutates cookies on intlResponse).
  let response = intlResponse;
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          // Copy headers from intl response (locale rewrites, etc.) onto the new one.
          intlResponse.headers.forEach((value, key) => {
            if (!response.headers.has(key)) response.headers.set(key, value);
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const { locale, isAdminRoute } = getAdminMatch(pathname);

  // Gate /dashboard behind auth (preserved from the original middleware).
  if (!user && pathname.includes("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = locale === routing.defaultLocale ? "/login" : `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // 3. Admin gate — defense in depth. The layout re-checks via is-admin().
  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = locale === routing.defaultLocale ? "/login" : `/${locale}/login`;
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const role = (profile as { role?: string } | null)?.role ?? "user";
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = locale === routing.defaultLocale ? "/" : `/${locale}`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Skip Next internals, API routes, Vercel internals, and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
