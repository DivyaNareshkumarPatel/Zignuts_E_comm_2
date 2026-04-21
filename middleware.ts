import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/constants/constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};