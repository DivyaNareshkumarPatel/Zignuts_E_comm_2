"use client";

import { useState } from "react";
import { useProducts, useDeleteProduct, useUpdateProduct, Product } from "@/app/admin/api/products";
import { useCategories } from "@/app/admin/api/categories";
import { useToast } from "@/contexts/ToastProvider";

export default function AdminProductList() {
  const { data: products, isLoading: isProductsLoading, isError: isProductsError } = useProducts();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const toast = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading products...</p>
      </div>
    );
  }

  if (isProductsError) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-500">Failed to load products.</p>
      </div>
    );
  }

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const category = categories?.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products?.filter(p => p.categoryId === selectedCategory);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.showSuccess("Product deleted.");
    } catch (error) {
      toast.showError("Failed to delete product.");
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditStock(product.stock.toString());
    setEditCategoryId(product.categoryId || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName || !editPrice || !editStock || !editCategoryId) return;

    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        name: editName,
        price: Number(editPrice),
        stock: Number(editStock),
        categoryId: editCategoryId,
      });
      toast.showSuccess("Product updated.");
      setEditingProduct(null);
    } catch (error) {
      toast.showError("Failed to update product.");
    }
  };

  return (
    <>
      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 p-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Products</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">All inventory available on your store.</p>
          </div>
          
          {categories && categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="">Uncategorized</option>
            </select>
          )}
        </div>
        
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No products found for the selected view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                         onClick={() => openEditModal(product)}
                         className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                         Edit
                      </button>
                      <button 
                         onClick={() => handleDelete(product.id)}
                         disabled={deleteProduct.isPending}
                         className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                         Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm"
            onClick={() => setEditingProduct(null)}
          />
          <div className="relative w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-950">Edit Product</h2>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Product Name
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />
              </label>
              
              <label className="block text-sm font-medium text-slate-700">
                Category
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Stock
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    required
                  />
                </label>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-full px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProduct.isPending}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {updateProduct.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
