import { decodeToken } from "./jwt-utils";

export function isTokenExpiringSoon(
  token: string,
  thresholdInSeconds = 60,
): boolean {
  const payload = decodeToken(token);

  if (!payload?.exp) {
    return true;
  }

  const expiresAt = payload.exp * 1000;

  const threshold = thresholdInSeconds * 1000;

  return expiresAt - Date.now() <= threshold;
}
