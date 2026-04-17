import { NextRequest, NextResponse } from "next/server";

const CALLBACK_SUCCESS_REDIRECT = "/";
const CALLBACK_ERROR_REDIRECT = "/auth/login?error=callback_failed";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL(CALLBACK_ERROR_REDIRECT, request.url));
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code, state }),
      }
    );

    if (!response.ok) {
      throw new Error("Callback request failed");
    }

    return NextResponse.redirect(new URL(CALLBACK_SUCCESS_REDIRECT, request.url));
  } catch (error) {
    return NextResponse.redirect(new URL(CALLBACK_ERROR_REDIRECT, request.url));
  }
}