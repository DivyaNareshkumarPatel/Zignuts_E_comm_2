import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="bg-slate-950 text-white px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-sm shadow-xl shadow-slate-950/10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Ready to start</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Launch a premium storefront today.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Build confidence with clean product presentation, fast checkout, and customer-focused service.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Link
              href="/auth/signup"
              className="inline-flex min-w-[9rem] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Sign up
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex min-w-[9rem] items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
