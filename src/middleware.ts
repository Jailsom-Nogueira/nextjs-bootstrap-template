import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/supabase/middleware";

/**
 * Note: Next 16 deprecated the `middleware.ts` convention in favor of `proxy.ts`.
 * shadcn / Supabase docs still ship the legacy name, so we keep `middleware.ts`
 * for compatibility. Rename to `proxy.ts` once tooling catches up.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - api/health (public)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health).*)",
  ],
};
