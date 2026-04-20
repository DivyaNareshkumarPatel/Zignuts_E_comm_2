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
    // Our token is a base64url encoded string of "payload.signature"
    // We need to decode it first to get the payload
    
    // Convert base64url to base64
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

    // exp is in milliseconds (Date.now() + ttl) here
    const currentTime = Date.now();
    return currentTime >= payload.exp;
  } catch (error) {
    // Fallback: try standard JWT if the token had 3 parts
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) return false;
        // JWT exp is in seconds
        return Date.now() >= payload.exp * 1000;
      }
    } catch {
      // Ignored
    }
    return true;
  }
};
