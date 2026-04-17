import Link from "next/link";

export default function AdminHeader() {
  return (
    <div className="mb-10 rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_40px_80px_-40px_rgba(255,255,255,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">Admin Dashboard</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">Control center</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Monitor key metrics, manage the store, and review activity from one polished admin screen.
          </p>
        </div>
        <div className="grid gap-3 sm:auto-rows-fr sm:grid-flow-col">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
