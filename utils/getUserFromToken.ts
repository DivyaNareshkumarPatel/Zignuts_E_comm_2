/**
 * Decode the access token from the cookie to retrieve the userId.
 * This is a client-side only utility.
 */
export function getUserIdFromToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('auth_token='));
    if (!tokenCookie) return null;

    const token = tokenCookie.split('=')[1]?.trim();
    if (!token) return null;

    // Our token format: base64url(payload.signature)
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';

    const decoded = atob(base64);
    const separatorIndex = decoded.lastIndexOf('.');
    if (separatorIndex === -1) return null;

    const payload = JSON.parse(decoded.slice(0, separatorIndex));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}
