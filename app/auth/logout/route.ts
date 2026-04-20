import { NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@/constants/constants';

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, '', { maxAge: 0, path: '/' });
    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, '', { maxAge: 0, path: '/' });

    return response;
}