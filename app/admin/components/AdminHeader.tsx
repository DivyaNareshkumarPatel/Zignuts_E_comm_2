"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/contexts/ToastProvider";

export default function AdminHeader() {
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.showSuccess("Logged out successfully");
      router.push('/auth/login');
    } catch (error) {
      toast.showError("Failed to logout. Please try again.");
    }
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-5 rounded-2xl border border-slate-200 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Panel</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Overview</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-full bg-red-50 text-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}