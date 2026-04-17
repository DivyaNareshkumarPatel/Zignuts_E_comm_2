const stats = [
  { label: "Total orders", value: "142", description: "Sales recorded in the last 30 days." },
  { label: "Pending shipments", value: "24", description: "Orders ready to ship today." },
  { label: "New customers", value: "37", description: "Fresh signups this month." },
  { label: "Store visits", value: "18.2k", description: "Traffic in the last 7 days." },
];

export default function AdminMetrics() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm shadow-slate-200/70 transition hover:-translate-y-1"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-pink-600">{item.label}</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{item.value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
