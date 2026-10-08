export default function LearningPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            MY LEARNING
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Your learning space
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Continue learning from your documents and track the topics you
            are studying.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Documents</p>
            <p className="mt-2 text-3xl font-bold">1</p>
            <p className="mt-1 text-xs text-slate-400">
              Learning resources
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Topics</p>
            <p className="mt-2 text-3xl font-bold">18</p>
            <p className="mt-1 text-xs text-slate-400">
              Indexed learning sections
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Progress</p>
            <p className="mt-2 text-3xl font-bold">0%</p>
            <p className="mt-1 text-xs text-slate-400">
              Start your learning journey
            </p>
          </div>

        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Your documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Documents uploaded to LearnWeave AI will appear here.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
              ▤
            </div>

            <h3 className="font-semibold">
              Learning library
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your uploaded PDFs will become searchable learning resources.
              You will be able to continue learning from them here.
            </p>

          </div>

        </section>

        <div className="mt-8">
          <a
            href="/"
            className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            ← Back to Study Assistant
          </a>
        </div>

      </div>
    </main>
  );
}