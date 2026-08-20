export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type RouteOwner = "COMMON" | "ADMIN" | "USER" | null;

/**
 * Routes that don't require authentication.
 */
const publicRoutes = ["/"];

/**
 * Authentication-related routes.
 *
 * These pages should be accessible without
 * being logged in.
 */
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

/**
 * Routes available to every authenticated user.
 */
const commonProtectedRoutes = ["/profile", "/settings"];

/**
 * Admin/Super Admin application area.
 */
const adminRoutes = ["/admin"];

/**
 * Regular user's workspace.
 */
const userRoutes = ["/workspace"];

/**
 * Check whether a pathname belongs to an auth page.
 */
export function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/**
 * Determine who owns a route.
 */
export function getRouteOwner(pathname: string): RouteOwner {
  /*
   * Public route
   */
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return null;
  }

  /*
   * Admin area.
   *
   * Both ADMIN and SUPER_ADMIN
   * are allowed here.
   */
  if (
    adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return "ADMIN";
  }

  /*
   * User workspace.
   */
  if (
    userRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return "USER";
  }

  /*
   * Common authenticated routes.
   */
  if (
    commonProtectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return "COMMON";
  }

  /*
   * For this application, routes that are not
   * explicitly public/auth are considered protected.
   */
  return "COMMON";
}

/**
 * Determine where a user should go after login.
 */
export function getDefaultDashboardRoute(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";

    case "ADMIN":
      return "/admin/dashboard";

    case "USER":
      return "/workspace";

    default:
      return "/auth/login";
  }
}

/**
 * Determine whether a role can access a route.
 */
export function canAccessRoute(
  role: UserRole,
  routeOwner: RouteOwner,
): boolean {
  /*
   * Public routes are accessible to everyone.
   */
  if (routeOwner === null) {
    return true;
  }

  /*
   * Common authenticated routes.
   */
  if (routeOwner === "COMMON") {
    return true;
  }

  /*
   * Admin area.
   *
   * SUPER_ADMIN has all ADMIN permissions,
   * so both can enter the admin application.
   */
  if (routeOwner === "ADMIN") {
    return role === "SUPER_ADMIN" || role === "ADMIN";
  }

  /*
   * User workspace.
   *
   * We intentionally don't allow ADMIN/SUPER_ADMIN
   * into the USER workspace through this route rule.
   */
  if (routeOwner === "USER") {
    return role === "USER";
  }

  return false;
}
