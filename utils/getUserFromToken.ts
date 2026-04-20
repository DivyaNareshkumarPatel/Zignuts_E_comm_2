export function getUserIdFromToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('auth_token='));
    if (!tokenCookie) return null;

    const token = tokenCookie.split('=')[1]?.trim();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const payload = JSON.parse(jsonPayload);

    return payload.user_id || payload.sub || null;
  } catch (error) {
    console.error("Error decoding Firebase token:", error);
    return null;
  }
}