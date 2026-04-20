"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/getUserFromToken";
import { useCart } from "@/app/admin/api/cart";

// Components
import DashboardHeader from "./components/Dashboardheader";
import DashboardTabs from "./components/DashboardTabs";
import CartTab from "./components/CartTab";
import OrdersTab from "./components/OrdersTab";

export default function UserDashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<"cart" | "orders">("cart");

  // We fetch cart here just to pass the cartCount to the Tabs component
  const { data: cartItems } = useCart(userId);

  // Resolve userId on client side
  useEffect(() => {
    const id = getUserIdFromToken();
    if (!id) {
      router.push("/auth/login");
    } else {
      setUserId(id);
    }
  }, [router]);

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500 animate-pulse">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <DashboardHeader />

      <div className="mx-auto max-w-4xl px-6 py-8">
        <DashboardTabs
          tab={tab}
          setTab={setTab}
          cartCount={cartItems?.length ?? 0}
        />

        {tab === "cart" ? (
          <CartTab
            userId={userId}
            onOrderPlaced={() => setTab("orders")}
          />
        ) : (
          <OrdersTab
            userId={userId}
          />
        )}
      </div>
    </main>
  );
}