import Link from "next/link";

const activity = [
  { title: "Latest user", value: "alice@example.com", subtitle: "Joined 3 days ago" },
  { title: "Inventory alert", value: "2 products low in stock", subtitle: "Review restock priority" },
  { title: "Support tickets", value: "4 open tickets", subtitle: "Pending responses" },
];

export default function AdminActivity() {
  return (
    <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_40px_80px_-40px_rgba(255,255,255,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Recent actions</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Review the latest activity and keep your store running smoothly.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
        >
          Manage users
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {activity.map((item) => (
          <article key={item.title} className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">{item.title}</p>
            <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
            <p className="mt-2 text-sm text-white/70">{item.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
