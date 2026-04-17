import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="bg-gradient-to-r from-pink-100 via-white to-slate-100 px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-pink-600">Style your story</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Get the latest drops delivered instantly.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Create an account for personalized recommendations, early access to sales, and effortless checkout on every order.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Link
              href="/auth/signup"
              className="inline-flex min-w-[9rem] items-center justify-center rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              Sign up
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex min-w-[9rem] items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
