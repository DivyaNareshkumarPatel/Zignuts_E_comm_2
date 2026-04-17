const stats = [
  { label: "Total Orders", value: "142", description: "Recent sales in the last 30 days." },
  { label: "Pending Shipments", value: "24", description: "Orders waiting to be fulfilled." },
  { label: "New Customers", value: "37", description: "Unique signups this month." },
  { label: "Site Visits", value: "18.2k", description: "Traffic over the last 7 days." },
];

export default function AdminMetrics() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_-30px_rgba(255,255,255,0.2)]"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">{item.label}</p>
          <p className="mt-4 text-4xl font-semibold text-white">{item.value}</p>
          <p className="mt-3 text-sm leading-6 text-white/70">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
