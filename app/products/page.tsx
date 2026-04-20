"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/app/products/components/ProductCard";
import { useProducts, Product } from "@/app/admin/api/products";
import { useCategories } from "@/app/admin/api/categories";

export default function ProductsPage() {
  const { data: products, isLoading: isProductsLoading } = useProducts();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isLoading = isProductsLoading || isCategoriesLoading;
  const filteredProducts = products?.filter((product: Product) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-white px-6 py-16 sm:px-8 border-b border-slate-200">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600">The Catalog</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Explore our collection.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Discover our latest arrivals and timeless classics carefully curated to elevate your style.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                My Account
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-950 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:pb-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${selectedCategory === "all"
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
            >
              All items
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${selectedCategory === cat.id
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <p className="text-sm text-slate-500 animate-pulse uppercase tracking-[0.2em]">Loading collection...</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-slate-100 p-6 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-slate-950">No products available yet</h2>
            <p className="mt-2 text-slate-500 max-w-md">Our catalog is currently being updated. Please check back later for new arrivals.</p>
          </div>
        ) : (!filteredProducts || filteredProducts.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-slate-100 p-6 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-slate-950">No matches found</h2>
            <p className="mt-2 text-slate-500 max-w-sm">We couldn't find any products matching your search criteria. Try adjusting your filters.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-6 text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories || []}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
