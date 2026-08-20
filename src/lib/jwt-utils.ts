export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export interface AccessTokenPayload {
  id?: string;
  userId?: string;
  email?: string;
  role?: UserRole;

  exp?: number;
  iat?: number;

  [key: string]: unknown;
}

function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");

  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  return atob(padded);
}

export function decodeToken(token: string): AccessTokenPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = base64UrlDecode(parts[1]);

    return JSON.parse(payload) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export function getTokenPayload(token: string): AccessTokenPayload | null {
  return decodeToken(token);
}
