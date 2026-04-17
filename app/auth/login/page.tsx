"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLogin } from "@/app/auth/api/hooks";
import { useToast } from "@/contexts/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = await login.mutateAsync({ email, password });

      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.showError(error instanceof Error ? error.message : "Login failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.15)] lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600">Welcome back</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Sign in to your style hub.</h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Access your account to manage orders, discover the latest collections, and shop with confidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-pink-50 p-6 shadow-sm shadow-pink-200/50">
                <p className="text-xs uppercase tracking-[0.35em] text-pink-600">Fast checkout</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">Save your preferences and payment details securely.</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-50 p-6 shadow-sm shadow-slate-200/60">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Exclusive offers</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">Receive personalized deals and early access to sales.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm shadow-slate-200/50">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Member login</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Sign in</h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  placeholder="Enter your password"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={login.isPending}
                className="flex w-full items-center justify-center rounded-full bg-pink-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {login.isPending ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
              <p>New here?</p>
              <Link href="/auth/signup" className="font-semibold text-pink-600 transition hover:text-pink-700">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
