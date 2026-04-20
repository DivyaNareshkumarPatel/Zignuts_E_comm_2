"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useToast } from "@/contexts/ToastProvider";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Save the role in Firestore database
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      });

      // 3. Get the token and set the cookie
      const idToken = await userCredential.user.getIdToken();
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      router.push(role === "admin" ? "/admin" : "/");
    } catch (error: any) {
      toast.showError(error.message || "Signup failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_40px_80px_-40px_rgba(255,255,255,0.35)] backdrop-blur-xl">
          <div className="space-y-3 pb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Signup</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Create your account.</h1>
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

            <div className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">Role</span>
              <div className="flex w-full rounded-3xl border border-white/10 bg-zinc-950/70 p-1">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`w-1/2 rounded-full py-2 text-sm font-medium transition-all ${role === "user" ? "bg-white text-zinc-950" : "text-white/70 hover:text-white"
                    }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`w-1/2 rounded-full py-2 text-sm font-medium transition-all ${role === "admin" ? "bg-white text-zinc-950" : "text-white/70 hover:text-white"
                    }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full justify-center rounded-3xl bg-white px-5 py-3 text-base font-semibold text-zinc-950 disabled:opacity-60"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-white/70">
            <p>Already have an account?</p>
            <Link href="/auth/login" className="text-white underline underline-offset-4 hover:text-white/90">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}