import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Better Auth defaults to setting this cookie
  const authCookie = request.cookies.get("better-auth.session_token")?.value;

  // Protect Dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (pathname === "/login" && authCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
