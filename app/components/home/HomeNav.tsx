"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "@/utils/getUserFromToken";

export default function HomeNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getUserIdFromToken());
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-md sm:px-8">
      {/* Brand */}
      <Link href="/" className="text-base font-semibold tracking-tight text-white">
        ShopX
      </Link>

      {/* Links */}
      <div className="flex items-center gap-2">
        <Link
          href="/products"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          Products
        </Link>

        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Account
          </Link>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
