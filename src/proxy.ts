import { NextRequest, NextResponse } from "next/server";

import {
  canAccessRoute,
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  type UserRole,
} from "./lib/auth-utils";

import { decodeToken, isTokenExpired } from "./lib/jwt-utils";

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    const accessToken = request.cookies.get("accessToken")?.value;

    const isAuth = isAuthRoute(pathname);

    let isAuthenticated = false;

    let userRole: UserRole | null = null;

    if (accessToken) {
      const payload = decodeToken(accessToken);

      const tokenExpired = isTokenExpired(accessToken);

      if (payload && !tokenExpired) {
        isAuthenticated = true;

        if (
          payload.role === "SUPER_ADMIN" ||
          payload.role === "ADMIN" ||
          payload.role === "USER"
        ) {
          userRole = payload.role;
        }
      }
    }

    const isPasswordRecoveryRoute =
      pathname === "/auth/forgot-password" ||
      pathname === "/auth/reset-password";

    if (isAuth && isAuthenticated && !isPasswordRecoveryRoute) {
      if (!userRole) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url),
      );
    }

    if (isAuth && !isAuthenticated) {
      return NextResponse.next();
    }

    const routeOwner = getRouteOwner(pathname);

    if (routeOwner === null) {
      return NextResponse.next();
    }

    if (!accessToken || !isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);

      loginUrl.searchParams.set("redirect", pathWithQuery);

      return NextResponse.redirect(loginUrl);
    }

    if (!userRole) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const hasAccess = canAccessRoute(userRole, routeOwner);

    if (!hasAccess) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url),
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
