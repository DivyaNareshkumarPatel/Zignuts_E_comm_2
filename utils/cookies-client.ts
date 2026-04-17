/**
 * Client-side cookie utilities using the 'cookie' npm package
 * Use this for all client component cookie operations
 *
 * DO NOT import this file in server components - use cookies-server.ts instead
 */
import * as Cookie from 'cookie';
import { COOKIE_NAMES } from '@/constants/constants';

/**
 * Get a cookie value by name
 */
export function getClientCookie(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const cookies = Cookie.parse(document.cookie);
  return cookies[name];
}

/**
 * Set a cookie with options
 */
export function setClientCookie(
  name: string,
  value: string,
  options?: Cookie.SerializeOptions
): void {
  if (typeof window === 'undefined') return;
  document.cookie = Cookie.serialize(name, value, {
    path: '/',
    ...options,
  });
}

/**
 * Remove a cookie by setting it to expire
 */
export function removeClientCookie(name: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = Cookie.serialize(name, '', {
    path: '/',
    maxAge: 0,
  });
}

// Auth-specific helpers

/**
 * Get access token from cookie
 */
export function getAccessToken(): string | undefined {
  return getClientCookie(COOKIE_NAMES.ACCESS_TOKEN);
}

/**
 * Get refresh token from cookie
 * Note: Only works if refresh token is not httpOnly
 */
export function getRefreshToken(): string | undefined {
  return getClientCookie(COOKIE_NAMES.REFRESH_TOKEN);
}

/**
 * Clear all auth cookies
 */
export function clearAuthCookies(): void {
  removeClientCookie(COOKIE_NAMES.ACCESS_TOKEN);
  removeClientCookie(COOKIE_NAMES.REFRESH_TOKEN);
}

/**
 * Alias for backward compatibility with existing code
 * @deprecated Use getClientCookie or getAccessToken instead
 */
export function getCookieToken(
  cookieName: string = COOKIE_NAMES.ACCESS_TOKEN
): string | null {
  const value = getClientCookie(cookieName);
  console.log(`getCookieToken: Retrieved ${cookieName} = ${value}`);
  return value ?? null;
}
