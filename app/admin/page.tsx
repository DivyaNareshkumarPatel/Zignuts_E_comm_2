import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminMetrics from "./components/AdminMetrics";
import AdminProductList from "@/app/admin/components/AdminProductList";
import AdminCategoryList from "@/app/admin/components/AdminCategoryList";
import { COOKIE_NAMES } from "@/constants/constants";
import {
  createAccessToken,
  createRefreshToken,
  getPublicUserById,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  if (accessToken) {
    const userId = verifyAccessToken(accessToken);
    if (userId) {
      const user = await getPublicUserById(userId);
      if (user?.role === "admin") {
        return;
      }
    }
  }

  if (refreshToken) {
    const userId = verifyRefreshToken(refreshToken);
    if (userId) {
      const user = await getPublicUserById(userId);
      if (user?.role === "admin") {
        const newAccessToken = createAccessToken(user.id);
        const newRefreshToken = createRefreshToken(user.id);

        cookieStore.set({
          name: COOKIE_NAMES.ACCESS_TOKEN,
          value: newAccessToken,
          path: "/",
          maxAge: 15 * 60,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        cookieStore.set({
          name: COOKIE_NAMES.REFRESH_TOKEN,
          value: newRefreshToken,
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        return;
      }
    }
  }

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
            <AdminProductList />
            <AdminCategoryList />
          </div>
        </div>
      </div>
    </main>
  );
}
