import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/verify-email"];
const ACCESS_TOKEN_COOKIE = "access_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has(ACCESS_TOKEN_COOKIE);

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublic && hasToken) {
    return NextResponse.redirect(new URL("/auctions", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
