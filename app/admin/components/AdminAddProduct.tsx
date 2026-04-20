"use client";

import { useState, type FormEvent } from "react";
import { useAddProduct } from "@/app/admin/api/products";
import { useCategories } from "@/app/admin/api/categories";
import { useToast } from "@/contexts/ToastProvider";

export default function AdminAddProduct() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const addProduct = useAddProduct();
  const { data: categories } = useCategories();
  const toast = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !price || !stock || !categoryId) {
      toast.showError("Please fill out all fields.");
      return;
    }

    try {
      await addProduct.mutateAsync({
        name,
        price: Number(price),
        stock: Number(stock),
        categoryId,
      });

      toast.showSuccess("Product added successfully!");
      setIsOpen(false);
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
    } catch (error) {
      toast.showError(error instanceof Error ? error.message : "Failed to add product.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Add Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-950/10">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-950">Add new product</h2>
              <p className="mt-2 text-sm text-slate-500">Fill in the details to add a new product to your inventory.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Product Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="e.g. Minimalist Watch"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Category
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Price ($)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    placeholder="29.99"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Initial Stock
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    placeholder="100"
                    required
                  />
                </label>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addProduct.isPending}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addProduct.isPending ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
