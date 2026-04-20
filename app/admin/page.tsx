import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminMetrics from "./components/AdminMetrics";
import AdminProductList from "@/app/admin/components/AdminProductList";
import AdminCategoryList from "@/app/admin/components/AdminCategoryList";
import AdminOrderList from "@/app/admin/components/AdminOrderList";
import { COOKIE_NAMES } from "@/constants/constants";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

async function checkAdminAuth() {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    redirect("/auth/login");
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(accessToken);
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      redirect("/auth/login");
    }

    const userData = userDoc.data();
    if (userData?.role === "admin") {
      return;
    } else {
      console.log("FAIL: User does not have admin role.");
    }
  } catch (error: any) {
    console.error("FAIL: Admin session verification threw an error:", error.message);
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
            <AdminOrderList />
            <AdminProductList />
            <AdminCategoryList />
          </div>
        </div>
      </div>
    </main>
  );
}