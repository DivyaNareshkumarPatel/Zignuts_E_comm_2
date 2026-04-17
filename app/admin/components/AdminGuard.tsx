"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/app/auth/api/hooks";
import { useToast } from "@/contexts/ToastProvider";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const toast = useToast();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (currentUser.loading || redirecting) {
      return;
    }

    if (!currentUser.isAuthenticated || currentUser.role !== "admin") {
      toast.showError("Admin access required. Please sign in with an administrator account.");
      setRedirecting(true);
      router.push("/auth/login");
    }
  }, [currentUser, redirecting, router, toast]);

  if (currentUser.loading || redirecting) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-16">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center shadow-[0_40px_80px_-40px_rgba(255,255,255,0.35)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Checking access</p>
            <div className="mt-6 text-lg font-semibold text-white">Redirecting to login...</div>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
