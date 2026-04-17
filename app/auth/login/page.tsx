"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLogin } from "@/app/auth/api/hooks";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login.mutateAsync({ email, password });
      router.push("/");
    } catch (error) {
      // The mutation error is shown via login.error, so no further action is needed here.
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_40px_80px_-40px_rgba(255,255,255,0.35)] backdrop-blur-xl">
          <div className="space-y-3 pb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Login</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Welcome back.</h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-white/70">
              Sign in with your email and password to continue to your account.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition focus:border-white focus:ring-2 focus:ring-white/10"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition focus:border-white focus:ring-2 focus:ring-white/10"
                required
              />
            </label>

            {login.isError && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {login.error?.message ?? "Login failed. Please try again."}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="flex w-full items-center justify-center rounded-3xl bg-white px-5 py-3 text-base font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {login.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-white/70">
            <p>Don’t have an account?</p>
            <Link href="/auth/signup" className="text-white underline underline-offset-4 transition hover:text-white/90">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
