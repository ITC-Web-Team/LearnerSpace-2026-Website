import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName, verifySessionToken } from "@/lib/session";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/api/auth/callback"];
const PUBLIC_PREFIXES = ["/_next", "/favicon.ico", "/api/health"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host");

  const protocol =
    request.headers.get("x-forwarded-proto") ?? "https";

  const baseUrl = `${protocol}://${host}`;

  if (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(sessionCookieName())?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/verification") && !session.isVerified) {
    return NextResponse.redirect(
      new URL("/dashboard", baseUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};