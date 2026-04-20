"use client";

import { Product } from "@/app/admin/api/products";
import { Category } from "@/app/admin/api/categories";

interface ProductCardProps {
  product: Product;
  categories: Category[];
}

export default function ProductCard({ product, categories }: ProductCardProps) {
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.1)]">
      {/* Visual Placeholder for Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
          {/* A simple placeholder icon based on title or a generic SVG */}
          <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            {getCategoryName(product.categoryId)}
          </span>
          <h3 className="text-xl font-semibold text-slate-950 group-hover:text-pink-600 transition">
            {product.name}
          </h3>
          <p className="mt-2 text-lg font-medium text-slate-700">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <button className="mt-6 flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
