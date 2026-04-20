"use client";

import { useState } from "react";
import { useCategories, useDeleteCategory, useUpdateCategory, Category } from "@/app/admin/api/categories";
import { useToast } from "@/contexts/ToastProvider";

export default function AdminCategoryList() {
  const { data: categories, isLoading, isError } = useCategories();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();
  const toast = useToast();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.showSuccess("Category deleted.");
    } catch (error) {
      toast.showError("Failed to delete category.");
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    try {
      await updateCategory.mutateAsync({ id: editingCategory.id, name: editName });
      toast.showSuccess("Category updated.");
      setEditingCategory(null);
    } catch (error) {
      toast.showError("Failed to update category.");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-500">Failed to load categories.</p>
      </div>
    );
  }

  return (
    <>
      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-950">Categories</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">All available product categories.</p>
        </div>
        
        {!categories || categories.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No categories found. Add one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {categories.map((category) => (
                  <tr key={category.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                    <td className="px-6 py-4">{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openEditModal(category)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        disabled={deleteCategory.isPending}
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

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm"
            onClick={() => setEditingCategory(null)}
          />
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-950">Edit Category</h2>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Category Name
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />
              </label>
              <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="rounded-full px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateCategory.isPending}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {updateCategory.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
