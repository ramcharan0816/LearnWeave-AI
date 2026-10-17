import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b19] px-5 py-12 text-white sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-700/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-32 h-[28rem] w-[28rem] rounded-full bg-indigo-600/20 blur-3xl"
      />

      <section className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#11172a]/95 p-7 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-12">
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-3xl font-bold text-white shadow-lg shadow-violet-900/40 ring-1 ring-white/20">
          L
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-300">
          Your personal learning space
        </p>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          LearnWeave{" "}
          <span className="text-violet-400">AI</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-8 text-slate-300 sm:text-lg">
          Make learning feel simpler. Explore concepts, build your knowledge,
          and take the next step in your learning journey.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-lg font-bold text-violet-300">01</div>
            <p className="mt-2 text-sm font-semibold text-white">
              Stay organized
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Keep your learning journey focused.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-lg font-bold text-violet-300">02</div>
            <p className="mt-2 text-sm font-semibold text-white">
              Explore ideas
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Learn one concept at a time.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-lg font-bold text-violet-300">03</div>
            <p className="mt-2 text-sm font-semibold text-white">
              Keep growing
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Make progress at your own pace.
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signin"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
          >
            Sign in
            <span aria-hidden="true" className="ml-2">→</span>
          </Link>

          <Link
            href="/signup"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-violet-300/40 bg-violet-400/5 px-6 py-3 text-sm font-bold text-violet-200 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/70 hover:bg-violet-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
          >
            Create account
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Learn at your own pace. Grow with confidence.
        </div>
      </section>
    </main>
  );
}
