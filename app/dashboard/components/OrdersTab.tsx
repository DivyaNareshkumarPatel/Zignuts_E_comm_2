"use client";

import { useUserOrders } from "@/app/admin/api/cart";

const statusColors: Record<string, string> = {
    Processing: "bg-amber-100 text-amber-800",
    Processed: "bg-blue-100 text-blue-800",
    Delivered: "bg-emerald-100 text-emerald-800",
};

// Explicitly defining only the properties needed for this component
interface OrdersTabProps {
    userId: string;
}

export default function OrdersTab({ userId }: OrdersTabProps) {
    const { data: orders, isLoading: isOrdersLoading } = useUserOrders(userId);

    if (isOrdersLoading) {
        return (
            <div className="rounded-[1.5rem] bg-white border border-slate-200 p-10 text-center text-sm text-slate-500 animate-pulse">
                Loading your orders...
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="rounded-[1.5rem] bg-white border border-slate-200 p-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">No orders yet</h2>
                <p className="mt-2 text-sm text-slate-500">Once you place an order it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
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
            ))}
        </div>
    );
}