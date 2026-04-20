"use client";

import Link from "next/link";
import ProductCard from "@/app/products/components/ProductCard";
import { useProducts } from "@/app/admin/api/products";
import { useCategories } from "@/app/admin/api/categories";

export default function HomeFeatured() {
  const { data: products, isLoading: isProductsLoading } = useProducts();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  // Show only up to 4 latest products (or randomly, but we'll slice 4)
  const featuredProducts = products?.slice(0, 4) || [];

  if (isProductsLoading || isCategoriesLoading || featuredProducts.length === 0) {
    return null; // Do not render if loading or empty
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Latest Additions
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Hand-picked accessories and staples perfect for your everyday look.
            </p>
          </div>
          <Link
             href="/products"
             className="inline-flex items-center justify-center rounded-full bg-slate-900 border border-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 hover:border-slate-800"
          >
             View all products
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              categories={categories || []} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
