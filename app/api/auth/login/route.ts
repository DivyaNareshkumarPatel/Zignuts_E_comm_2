import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@/constants/constants';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, idToken, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}