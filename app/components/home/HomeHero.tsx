import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-r from-slate-100 via-white to-slate-100" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Thoughtful shopping</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              A calm, premium storefront for modern shoppers.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Explore refined product collections, fast delivery, and a clean checkout experience designed for ease and trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Shop now
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Premium service</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Reliable delivery and support</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Fast shipping, simple returns, and a polished checkout flow help your customers feel confident on every order.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Fast shipping",
                "Secure checkout",
                "Hand-curated items",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-slate-100 px-4 py-5 text-center">
                  <p className="text-sm font-semibold text-slate-950">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
