/**
 * Server-side API authentication helpers.
 * Use these in API route handlers to verify the caller's identity
 * using the custom HMAC token stored in the `auth_token` cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, getPublicUserById } from '@/lib/auth';
import { COOKIE_NAMES } from '@/constants/constants';

// ─── Token extraction ───────────────────────────────────────────────────────

/**
 * Extract and verify the access token from the request cookies.
 * Returns the userId string if valid, or null if missing / invalid / expired.
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

// ─── Auth guard helpers ──────────────────────────────────────────────────────

/**
 * Require a valid user session.
 * Returns { userId } on success, or a 401 NextResponse.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ userId: string } | NextResponse> {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { userId };
}

/**
 * Require the caller to be an admin.
 * Returns { userId } on success, or a 401/403 NextResponse.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ userId: string } | NextResponse> {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getPublicUserById(userId);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
  }

  return { userId };
}

// ─── Type guard ──────────────────────────────────────────────────────────────

/** Narrows the result of requireAuth / requireAdmin to a response object. */
export function isAuthError(
  result: { userId: string } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
