import Link from "next/link";
import AdminAddProduct from "@/app/admin/components/AdminAddProduct";
import AdminAddCategory from "@/app/admin/components/AdminAddCategory";

export default function AdminHeader() {
  return (
    <div className="rounded-[1.5rem] bg-white p-8 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Admin dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Store overview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            A simple dashboard for orders, stock, and customer activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            View store
          </Link>
          <AdminAddCategory />
          <AdminAddProduct />
        </div>
      </div>
    </div>
  );
}
