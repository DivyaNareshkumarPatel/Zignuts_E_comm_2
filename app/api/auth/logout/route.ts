import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@/constants/constants';
import { revokeRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  if (refreshToken) {
    revokeRefreshToken(refreshToken);
  }

  const response = NextResponse.json({ success: true });
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
