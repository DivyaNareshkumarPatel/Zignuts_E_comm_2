/**
 * Client-safe token utilities
 * These functions can be used in both client and server components
 *
 * Note: Server-side token getters are in token-server.ts
 */

// Re-export cookie utilities from the centralized client cookie utility
export {
  getCookieToken,
  getAccessToken,
  getRefreshToken,
  clearAuthCookies,
} from './cookies-client';

export const isTokenExpired = (token?: string): boolean => {
  if (!token) {
    return true;
  }

  try {
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const decoded = atob(base64);
    const separatorIndex = decoded.lastIndexOf('.');

    if (separatorIndex === -1) {
      return true;
    }

    const payloadStr = decoded.slice(0, separatorIndex);
    const payload = JSON.parse(payloadStr);

    if (!payload.exp) {
      return false;
    }
    const currentTime = Date.now();
    return currentTime >= payload.exp;
  } catch (error) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) return false;
        return Date.now() >= payload.exp * 1000;
      }
    } catch {

    }
    return true;
  }
};
