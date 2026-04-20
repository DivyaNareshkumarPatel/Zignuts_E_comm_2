import * as Cookie from 'cookie';
import { COOKIE_NAMES } from '@/constants/constants';
export function getClientCookie(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const cookies = Cookie.parse(document.cookie);
  return cookies[name];
}

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
export function removeClientCookie(name: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = Cookie.serialize(name, '', {
    path: '/',
    maxAge: 0,
  });
}

export function getAccessToken(): string | undefined {
  return getClientCookie(COOKIE_NAMES.ACCESS_TOKEN);
}

export function getRefreshToken(): string | undefined {
  return getClientCookie(COOKIE_NAMES.REFRESH_TOKEN);
}

export function clearAuthCookies(): void {
  removeClientCookie(COOKIE_NAMES.ACCESS_TOKEN);
  removeClientCookie(COOKIE_NAMES.REFRESH_TOKEN);
}

export function getCookieToken(
  cookieName: string = COOKIE_NAMES.ACCESS_TOKEN
): string | null {
  const value = getClientCookie(cookieName);
  return value ?? null;
}
