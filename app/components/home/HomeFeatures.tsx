const features = [
  {
    title: "Fashion curated daily",
    description: "Fresh styles and new arrivals selected for your season-ready wardrobe.",
  },
  {
    title: "Express delivery",
    description: "Fast shipping options so your outfit arrives before the weekend.",
  },
  {
    title: "Safe checkout",
    description: "Secure payment processing with easy returns and order tracking.",
  },
];

export default function HomeFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-pink-600">Why shop with us</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Everything you need for a stylish shopping experience.</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/70 transition hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
