"use client";

import { useState, type FormEvent } from "react";
import { useAddCategory } from "@/app/admin/api/categories";
import { useToast } from "@/contexts/ToastProvider";

export default function AdminAddCategory() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const addCategory = useAddCategory();
  const toast = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name) {
      toast.showError("Please enter a category name.");
      return;
    }

    try {
      await addCategory.mutateAsync({ name });
      toast.showSuccess("Category added successfully!");
      setIsOpen(false);
      setName("");
    } catch (error) {
      toast.showError(error instanceof Error ? error.message : "Failed to add category.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
      >
        Add Category
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-950/10">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-950">Add new category</h2>
              <p className="mt-2 text-sm text-slate-500">Organize your products with categories.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium text-slate-700">
                Category Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="e.g. Winter Collection"
                  required
                />
              </label>

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
                  disabled={addCategory.isPending}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addCategory.isPending ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
