import Link from "next/link";

export default function TutorPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        <div className="mb-8">
          <p className="text-sm font-medium text-violet-600">
            AI TUTOR
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Your personal AI tutor
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Ask questions about your study materials and learn through
            document-grounded AI explanations.
          </p>
        </div>

        <section className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-7 text-white shadow-lg sm:p-10">

          <div className="max-w-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
              ✧
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Learn with your own study material
            </h2>

            <p className="mt-4 text-sm leading-6 text-indigo-100 sm:text-base">
              LearnWeave AI uses your uploaded learning resources to retrieve
              relevant information and generate grounded answers.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-white/15 px-3 py-2">
                PDF-based learning
              </span>

              <span className="rounded-full bg-white/15 px-3 py-2">
                Semantic retrieval
              </span>

              <span className="rounded-full bg-white/15 px-3 py-2">
                AI answers
              </span>

              <span className="rounded-full bg-white/15 px-3 py-2">
                Source references
              </span>
            </div>
          </div>

        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              ?
            </div>

            <h3 className="font-semibold">
              Ask questions
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ask questions about concepts contained in your uploaded
              learning materials.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              AI
            </div>

            <h3 className="font-semibold">
              Get explanations
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Receive AI-generated explanations based on retrieved document
              content.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              ✓
            </div>

            <h3 className="font-semibold">
              Verify sources
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the document and page references used to generate an
              answer.
            </p>
          </div>

        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Start a tutoring session
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            The complete AI Tutor interface will connect to the existing
            LearnWeave RAG endpoint.
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Open Study Assistant →
          </Link>

        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}