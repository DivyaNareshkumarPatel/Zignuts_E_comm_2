/**
 * Decode the access token (Firebase JWT) from the cookie to retrieve the user's ID.
 * This is a client-side only utility.
 */
export function getUserIdFromToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    // Make sure this matches your COOKIE_NAMES.ACCESS_TOKEN value (usually 'auth_token')
    const tokenCookie = cookies.find(c => c.trim().startsWith('auth_token='));
    if (!tokenCookie) return null;

    const token = tokenCookie.split('=')[1]?.trim();
    if (!token) return null;

    // A standard JWT has 3 parts separated by dots: Header.Payload.Signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1]; // We only care about the Payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Properly decode base64 to a JSON string
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const payload = JSON.parse(jsonPayload);

    // Firebase ID tokens store the ID in 'user_id' or 'sub'
    return payload.user_id || payload.sub || null;
  } catch (error) {
    console.error("Error decoding Firebase token:", error);
    return null;
  }
}