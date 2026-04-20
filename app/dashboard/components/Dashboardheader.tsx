"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/contexts/ToastProvider";

export default function DashboardHeader() {
    const router = useRouter();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            // 1. Sign out from Firebase Auth on the client
            await signOut(auth);

            // 2. Clear Next.js server cookies
            await fetch('/api/auth/logout', { method: 'POST' });

            // 3. Redirect back to login
            toast.showSuccess("Logged out successfully");
            router.push('/auth/login');
        } catch (error) {
            toast.showError("Failed to logout. Please try again.");
        }
    };

    return (
        <header className="bg-white border-b border-slate-200">
            <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">My Account</p>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-950">Dashboard</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        ← Keep Shopping
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center rounded-full bg-red-50 text-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-100"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}