import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminActivity from "@/app/admin/components/AdminActivity";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminMetrics from "@/app/admin/components/AdminMetrics";
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
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-slate-100 text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.15)]">
          <AdminHeader />
          <div className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <AdminMetrics />
            <AdminActivity />
          </div>
        </div>
      </div>
    </main>
  );
}
