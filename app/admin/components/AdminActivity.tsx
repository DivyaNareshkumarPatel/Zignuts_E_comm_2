import Link from "next/link";

const activity = [
  { title: "New signup", value: "jackie@example.com", subtitle: "Joined 1 hour ago" },
  { title: "Low stock", value: "Merino Tee — 5 left", subtitle: "Restock before the weekend" },
  { title: "New order", value: "#A2749", subtitle: "Ready for fulfillment" },
];

export default function AdminActivity() {
  return (
    <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Recent activity</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Review the latest updates and keep your fashion store on track.</p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-full border border-pink-200 bg-pink-50 px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
        >
          Open user manager
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {activity.map((item) => (
          <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <p className="text-sm uppercase tracking-[0.35em] text-pink-600">{item.title}</p>
            <p className="mt-4 text-xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
