import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddleware } from "@/lib/supabase/middleware";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/auth/login"];

// Routes accessible by employees (everything else requires admin)
const EMPLOYEE_ROUTES = ["/orders"];

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createSupabaseMiddleware(request);
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // If already logged in and trying to access login, redirect to dashboard
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // Check auth for all other routes
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
