import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { COOKIE_NAMES } from '@/constants/constants';

/**
 * Extract and verify the Firebase ID token from the request.
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  // 1. Try to get token from Authorization header (Set by Axios)
  const authHeader = request.headers.get('Authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  // 2. Fallback: check the Next.js cookies directly
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  }

  if (!token) return null;

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}

/**
 * Require a valid user session.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ userId: string } | NextResponse> {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { userId };
}

/**
 * Require the caller to be an admin.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ userId: string } | NextResponse> {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
    }

    return { userId };
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
  }
}

export function isAuthError(
  result: { userId: string } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}