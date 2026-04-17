import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@/constants/constants';
import { authenticateUser, createAccessToken, createRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  const response = NextResponse.json({
    uid: user.id,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  });

  response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    httpOnly: false,
    path: '/',
    maxAge: 15 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
