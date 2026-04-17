const products = [
  { name: "Printed Maxi Dress", price: "₹1,299", badge: "New" },
  { name: "Casual Sneakers", price: "₹2,499", badge: "Trending" },
  { name: "Denim Jacket", price: "₹1,799", badge: "Best seller" },
  { name: "Silk Kurta Set", price: "₹2,199", badge: "Limited" },
];

export default function HomeGallery() {
  return (
    <section className="bg-slate-50 px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-pink-600">Top picks</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Trending fashion essentials.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition hover:-translate-y-1">
              <div className="h-52 bg-gradient-to-br from-pink-100 via-violet-100 to-slate-100 p-6">
                <div className="h-full rounded-[1.75rem] bg-slate-100" />
              </div>
              <div className="space-y-3 px-6 py-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-slate-950">{product.name}</p>
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-700">
                    {product.badge}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-950">{product.price}</p>
                <p className="text-sm leading-6 text-slate-500">Styled for fresh looks and effortless day-to-night wear.</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
