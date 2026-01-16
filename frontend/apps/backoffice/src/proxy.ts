import { NextRequest, NextResponse } from "next/server";
import { LOGIN } from "./constants/routes";
import { DASHBOARD } from "@/constants/routes";

export function proxy(request: NextRequest) {
  const { pathname, basePath, origin } = request.nextUrl;
  const pathWithoutBase = pathname.replace(/^\/admin/, "");

  // Allow access to auth routes without authentication
  if (pathWithoutBase.startsWith("/auth")) {
    // If already authenticated and trying to access login, redirect to dashboard
    const authToken = request.cookies.get("auth-token")?.value;

    if (authToken) {
      const dashboardUrl = new URL(DASHBOARD, origin + basePath);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const authToken = request.cookies.get("auth-token")?.value;

  if (!authToken) {
    // No auth token - redirect to login with 302
    const loginUrl = new URL("/admin" + LOGIN, origin + basePath);
    return NextResponse.redirect(loginUrl, 302);
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/admin/((?!api|_next/static|_next/image|favicon\\.ico|public).*)",
  ],
};
