"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, useAddToCart, useUserOrders, usePlaceOrder, CartItem } from "@/app/admin/api/cart";
import { useToast } from "@/contexts/ToastProvider";
import { getUserIdFromToken } from "@/utils/getUserFromToken";

const statusColors: Record<string, string> = {
  Processing: "bg-amber-100 text-amber-800",
  Processed: "bg-blue-100 text-blue-800",
  Delivered: "bg-emerald-100 text-emerald-800",
};

export default function UserDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<"cart" | "orders">("cart");
  useEffect(() => {
    const id = getUserIdFromToken();
    if (!id) {
      router.push("/auth/login");
    } else {
      setUserId(id);
    }
  }, [router]);

  const { data: cartItems, isLoading: isCartLoading } = useCart(userId);
  const { data: orders, isLoading: isOrdersLoading } = useUserOrders(userId);
  const addToCart = useAddToCart();
  const placeOrder = usePlaceOrder();

  const cartTotal = (cartItems || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = async (item: CartItem, delta: number) => {
    if (!userId) return;
    const newQty = item.quantity + delta;
    let updatedItems: CartItem[];

    if (newQty <= 0) {
      updatedItems = (cartItems || []).filter((i) => i.id !== item.id);
    } else {
      updatedItems = (cartItems || []).map((i) =>
        i.id === item.id ? { ...i, quantity: newQty } : i
      );
    }

    await addToCart.mutateAsync({ userId, items: updatedItems });
  };

  const handlePlaceOrder = async () => {
    if (!userId || !cartItems || cartItems.length === 0) return;

    try {
      await placeOrder.mutateAsync({ userId, items: cartItems, total: cartTotal });
      toast.showSuccess("Order placed successfully! 🎉");
      setTab("orders");
    } catch {
      toast.showError("Failed to place order. Please try again.");
    }
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500 animate-pulse">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">My Account</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">Dashboard</h1>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Keep Shopping
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex gap-1 rounded-2xl bg-slate-200 p-1 w-fit mb-8">
          {(["cart", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold capitalize transition ${tab === t
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {t === "cart" ? `Cart (${cartItems?.length ?? 0})` : "Order History"}
            </button>
          ))}
        </div>

        {tab === "cart" && (
          <div className="space-y-6">
            {isCartLoading ? (
              <div className="rounded-[1.5rem] bg-white border border-slate-200 p-10 text-center text-sm text-slate-500 animate-pulse">
                Loading your cart...
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="rounded-[1.5rem] bg-white border border-slate-200 p-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Your cart is empty</h2>
                <p className="mt-2 text-sm text-slate-500">Browse the store and add items to get started.</p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-[1.5rem] bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-5 p-5">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                          <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="mt-0.5 text-sm text-slate-500">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        <p className="w-20 text-right font-semibold text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-950">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={placeOrder.isPending}
                    className="mt-6 w-full rounded-full bg-slate-950 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {placeOrder.isPending ? "Placing Order..." : "Place Order →"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {tab === "orders" && (
          <div className="space-y-4">
            {isOrdersLoading ? (
              <div className="rounded-[1.5rem] bg-white border border-slate-200 p-10 text-center text-sm text-slate-500 animate-pulse">
                Loading your orders...
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="rounded-[1.5rem] bg-white border border-slate-200 p-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">No orders yet</h2>
                <p className="mt-2 text-sm text-slate-500">Once you place an order it will appear here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-[1.5rem] bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                      <p className="text-xs font-mono text-slate-400">Order #{order.id.slice(0, 10)}</p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] ?? "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-semibold text-slate-950">₹{order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-6 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
