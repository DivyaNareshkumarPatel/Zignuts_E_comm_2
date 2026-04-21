"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getUserIdFromToken } from "@/utils/getUserFromToken";
import { useCart } from "@/hooks/useCart";

export default function HomeNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isHydrated, totalItems } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!getUserIdFromToken());
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-md sm:px-8">
      <Link href="/" className="text-base font-semibold tracking-tight text-white">
        ShopX
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          Products
        </Link>
        <Link href="/dashboard" className="relative text-slate-300 hover:text-white transition">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {isHydrated && totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            My Account
          </Link>
        ) : (
          <>
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
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