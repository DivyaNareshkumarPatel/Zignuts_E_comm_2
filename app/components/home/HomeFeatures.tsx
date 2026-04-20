const features = [
  {
    title: "Curated collections",
    description: "Thoughtfully selected items that make styling easy and enjoyable.",
  },
  {
    title: "Fast delivery",
    description: "Reliable shipping options that get orders delivered quickly and smoothly.",
  },
  {
    title: "Trusted checkout",
    description: "Secure payments, transparent pricing, and a simplified shopping flow.",
  },
];

export default function HomeFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Why choose us</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Simple, polished shopping for every order.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
