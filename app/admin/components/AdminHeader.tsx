import Link from "next/link";

export default function AdminHeader() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-pink-600">Admin hub</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">Dashboard for your store</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Monitor performance, manage inventory, and track orders in one stylish admin view.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-pink-200 bg-pink-50 px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
          >
            View storefront
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Admin settings
          </Link>
        </div>
      </div>
    </div>
  );
}
