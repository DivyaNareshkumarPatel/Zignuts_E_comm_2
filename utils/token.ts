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

/**
 * Check if JWT token is expired
 * Decodes JWT and checks expiration time
 */
export const isTokenExpired = (token?: string): boolean => {
  if (!token) {
    return true;
  }

  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }

    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expiration
    if (!payload.exp) {
      return false; // No expiration means token doesn't expire
    }

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  } catch (error) {
    // If we can't parse, consider it expired
    return true;
  }
};
