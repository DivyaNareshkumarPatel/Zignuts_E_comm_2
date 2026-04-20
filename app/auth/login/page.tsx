"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useToast } from "@/contexts/ToastProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await userCredential.user.getIdToken();
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const role = userDoc.data()?.role || "user";

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.showError(error.message || "Login failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_40px_80px_-40px_rgba(255,255,255,0.35)] backdrop-blur-xl">
          <div className="space-y-3 pb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Login</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Sign in to your account.</h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none focus:border-white"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none focus:border-white"
                required
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full justify-center rounded-3xl bg-white px-5 py-3 text-base font-semibold text-zinc-950 disabled:opacity-60"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-white/70">
            <p>New here?</p>
            <Link href="/auth/signup" className="text-white underline underline-offset-4 hover:text-white/90">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}