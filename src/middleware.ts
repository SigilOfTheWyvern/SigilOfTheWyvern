import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

function loginRedirect(request: NextRequest, pathname: string) {
  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth =
    pathname.startsWith("/fan") ||
    pathname.startsWith("/studio") ||
    pathname === "/checkout";

  if (!isSupabaseConfigured()) {
    if (needsAuth) return loginRedirect(request, pathname);
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (needsAuth && !user) {
    return loginRedirect(request, pathname);
  }

  return response();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
