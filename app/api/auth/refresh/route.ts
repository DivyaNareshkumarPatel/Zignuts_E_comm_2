import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@/constants/constants';
import { createAccessToken, createRefreshToken, getPublicUserById, revokeRefreshToken, verifyRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 });
  }

  const userId = verifyRefreshToken(refreshToken);
  if (!userId) {
    const response = NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, '', {
      httpOnly: false,
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  }

  const user = getPublicUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  revokeRefreshToken(refreshToken);

  const accessToken = createAccessToken(user.id);
  const newRefreshToken = createRefreshToken(user.id);

  const response = NextResponse.json({ user });
  response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    httpOnly: false,
    path: '/',
    maxAge: 15 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, newRefreshToken, {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
