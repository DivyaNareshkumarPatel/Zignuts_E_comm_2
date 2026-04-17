"use client";

import AdminActivity from "@/app/admin/components/AdminActivity";
import AdminGuard from "@/app/admin/components/AdminGuard";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminMetrics from "@/app/admin/components/AdminMetrics";

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
          <AdminHeader />
          <AdminMetrics />
          <AdminActivity />
        </div>
      </main>
    </AdminGuard>
  )}