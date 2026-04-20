import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminMetrics from "./components/AdminMetrics";
import AdminProductList from "@/app/admin/components/AdminProductList";
import AdminCategoryList from "@/app/admin/components/AdminCategoryList";
import AdminOrderList from "@/app/admin/components/AdminOrderList";
import { COOKIE_NAMES } from "@/constants/constants";
import {
  getPublicUserById,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  // 1. Check Access Token
  if (accessToken) {
    const userId = verifyAccessToken(accessToken);
    if (userId) {
      const user = await getPublicUserById(userId);
      if (user?.role === "admin") {
        return; // Authorized via access token
      }
    }
  }

  // 2. Check Refresh Token
  if (refreshToken) {
    const userId = verifyRefreshToken(refreshToken);
    if (userId) {
      const user = await getPublicUserById(userId);
      if (user?.role === "admin") {
        // Authorized via refresh token.
        // We CANNOT set cookies in a Server Component, but we allow the render.
        // The client-side application (e.g., AuthProvider/Axios interceptor) 
        // will automatically hit /api/auth/refresh to update the cookies.
        return;
      }
    }
  }

  // 3. If neither token is valid, redirect to login
  redirect("/auth/login");
}

export default async function AdminDashboardPage() {
  await checkAdminAuth();
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <AdminHeader />
        <div className="mt-8 space-y-8">
          <AdminMetrics />

          <div className="grid gap-8 lg:grid-cols-1">
            <AdminOrderList />
            <AdminProductList />
            <AdminCategoryList />
          </div>
        </div>
      </div>
    </main>
  );
}