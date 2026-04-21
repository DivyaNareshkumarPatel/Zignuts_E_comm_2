"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/app/admin/api/products";
import { Category } from "@/app/admin/api/categories";
import { useAddToCart } from "@/app/admin/api/cart";
import { useToast } from "@/contexts/ToastProvider";
import { getUserIdFromToken } from "@/utils/getUserFromToken";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
  categories: Category[];
}

export default function ProductCard({ product, categories }: ProductCardProps) {
  const router = useRouter();
  const toast = useToast();
  const userId = getUserIdFromToken();
  const { items: cartItems, addToCart } = useCart();
  const apiAddToCart = useAddToCart();

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleAddToCart = async () => {
    if (!userId) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast.showSuccess(`${product.name} added to cart!`);

    try {
      const existingItem = cartItems.find((i) => i.id === product.id);
      let updatedItems;

      if (existingItem) {
        updatedItems = cartItems.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [
          ...cartItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            categoryId: product.categoryId,
            imageUrl: product.imageUrl,
          },
        ];
      }

      await apiAddToCart.mutateAsync({ userId, items: updatedItems });
    } catch (error) {
      console.error("Failed to sync cart to database", error);
      toast.showError("Failed to sync with server. Please refresh.");
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.1)]">
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <span className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Out of Stock
            </span>
          </div>
        )}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 z-10 bg-slate-900/5 opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            {getCategoryName(product.categoryId)}
          </span>
          <h3 className="text-xl font-semibold text-slate-950 transition group-hover:text-slate-700">
            {product.name}
          </h3>
          <p className="mt-2 text-lg font-medium text-slate-700">
            ₹{product.price.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={apiAddToCart.isPending || isOutOfStock}
          className={`mt-6 flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${isOutOfStock
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : "bg-slate-950 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}