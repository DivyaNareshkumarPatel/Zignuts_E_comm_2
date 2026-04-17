import Link from "next/link";

const categories = [
  { name: "Women", accent: "bg-pink-100 text-pink-600" },
  { name: "Men", accent: "bg-sky-100 text-sky-700" },
  { name: "Kids", accent: "bg-amber-100 text-amber-700" },
  { name: "Beauty", accent: "bg-violet-100 text-violet-700" },
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-pink-200/70 blur-3xl" />
      <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-violet-200/80 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
        <header className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-slate-50/90 px-6 py-4 shadow-lg shadow-slate-200/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500 text-white shadow-md shadow-pink-200/50 font-black">
              M
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Myntra style</p>
              <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Fashion for every mood.</h1>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            <Link href="#women" className="hover:text-slate-900">Women</Link>
            <Link href="#men" className="hover:text-slate-900">Men</Link>
            <Link href="#kids" className="hover:text-slate-900">Kids</Link>
            <Link href="#beauty" className="hover:text-slate-900">Beauty</Link>
          </nav>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm shadow-pink-200/60">
              New season styles · Up to 70% off
            </div>
            <div className="space-y-6">
              <h2 className="max-w-3xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                Shop the latest fashion drops, curated for every statement.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Discover bold new arrivals, wardrobe essentials, and beauty must-haves with quick delivery and easy returns.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-pink-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Shop now
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Join now
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/80">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Free delivery</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">On orders above ₹999</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/80">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Easy returns</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">10-day return policy</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] bg-gradient-to-br from-pink-100 via-white to-slate-100 p-6 shadow-lg shadow-pink-200/40">
              <p className="text-xs uppercase tracking-[0.35em] text-pink-700">Featured drop</p>
              <h3 className="mt-4 text-3xl font-bold text-slate-950">Weekend wardrobe</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Lightweight looks, trending hues, and premium casual wear for every plan.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <div key={category.name} className={`rounded-3xl px-4 py-4 shadow-sm ${category.accent}`}>
                    <p className="text-sm font-semibold">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-5 shadow-sm shadow-slate-200/60">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Style edit</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Best sellers</p>
              </div>
              <div className="rounded-[2rem] bg-white p-5 shadow-sm shadow-slate-200/60">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Spotlight</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Limited time offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
