"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/app/admin/api/products";
import { Category } from "@/app/admin/api/categories";
import { CartItem, useCart, useAddToCart } from "@/app/admin/api/cart";
import { useToast } from "@/contexts/ToastProvider";
import { getUserIdFromToken } from "@/utils/getUserFromToken";

interface ProductCardProps {
  product: Product;
  categories: Category[];
}

export default function ProductCard({ product, categories }: ProductCardProps) {
  const router = useRouter();
  const toast = useToast();
  const userId = getUserIdFromToken();
  const { data: cartItems } = useCart(userId);
  const addToCart = useAddToCart();

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleAddToCart = async () => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
    const existing = cartItems || [];
    const existingItem = existing.find((i) => i.id === product.id);

    let updatedItems: CartItem[];
    if (existingItem) {
      updatedItems = existing.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [
        ...existing,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          categoryId: product.categoryId,
        },
      ];
    }

    try {
      await addToCart.mutateAsync({ userId, items: updatedItems });
      toast.showSuccess(`${product.name} added to cart!`);
    } catch {
      toast.showError("Failed to add to cart. Please try again.");
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.1)]">
      {/* Visual Placeholder for Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <span className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
          <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 transition group-hover:opacity-100" />
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
          disabled={addToCart.isPending || isOutOfStock}
          className={`mt-6 flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${isOutOfStock
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-slate-950 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : addToCart.isPending
              ? "Adding..."
              : userId
                ? "Add to Cart"
                : "Login to Add to Cart"}
        </button>
      </div>
    </div>
  );
}
