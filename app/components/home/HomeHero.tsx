import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Subtle noise/grain texture overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 sm:px-8 lg:px-10 lg:py-36 text-center">
        <p className="mx-auto text-xs font-bold uppercase tracking-[0.45em] text-slate-400">
          The New Standard
        </p>

        <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold tracking-tighter text-white sm:text-7xl">
          Elegance in every order.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Discover hand-curated collections designed for those who appreciate the finer details.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-semibold text-slate-950 transition-all hover:bg-slate-100 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
          >
            Shop the Collection
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 px-10 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {/* Fade into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}
