"use client";

import { useOrders, useUpdateOrderStatus, OrderStatus } from "@/app/admin/api/orders";
import { useToast } from "@/contexts/ToastProvider";

const statusColors: Record<OrderStatus, string> = {
  Processing: "bg-amber-100 text-amber-800",
  Processed: "bg-blue-100 text-blue-800",
  Delivered: "bg-emerald-100 text-emerald-800",
};

export default function AdminOrderList() {
  const { data: orders, isLoading, isError } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.showSuccess(`Order marked as ${status}.`);
    } catch {
      toast.showError("Failed to update order status.");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-500">Failed to load orders.</p>
      </div>
    );
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-950">Orders</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          All customer orders and their current status.
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">
          No orders yet. Once customers place orders, they will appear here.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 max-w-[120px] truncate">
                    {order.userId.slice(0, 12)}…
                  </td>
                  <td className="px-6 py-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-xs text-slate-600">
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ₹{order.total?.toFixed(2) ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        statusColors[order.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      {order.status === "Processing" && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, "Processed")}
                          disabled={updateStatus.isPending}
                          className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                        >
                          Mark Processed
                        </button>
                      )}
                      {order.status !== "Delivered" && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, "Delivered")}
                          disabled={updateStatus.isPending}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status === "Delivered" && (
                        <span className="text-xs text-emerald-600 font-medium">✓ Complete</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
