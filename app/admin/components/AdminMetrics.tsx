"use client";

import { useProducts } from "@/app/admin/api/products";
import { useCategories } from "@/app/admin/api/categories";

export default function AdminMetrics() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const lowStockThreshold = 10;
  const lowStockCount = products?.filter(p => p.stock < lowStockThreshold).length || 0;

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Total Products</p>
        <p className="mt-2 text-3xl font-semibold text-slate-950">{totalProducts}</p>
      </div>
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Total Categories</p>
        <p className="mt-2 text-3xl font-semibold text-slate-950">{totalCategories}</p>
      </div>
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Low Stock Alerts</p>
        <p className={`mt-2 text-3xl font-semibold ${lowStockCount > 0 ? "text-red-600" : "text-emerald-600"}`}>
          {lowStockCount}
        </p>
      </div>
    </div>
  );
}
