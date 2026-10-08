import Link from "next/link";

const topics = [
  {
    name: "Machine Learning",
    progress: 75,
    status: "Strong",
  },
  {
    name: "Supervised Learning",
    progress: 68,
    status: "Good",
  },
  {
    name: "Regression",
    progress: 55,
    status: "Improving",
  },
  {
    name: "Classification",
    progress: 42,
    status: "Needs attention",
  },
  {
    name: "Neural Networks",
    progress: 30,
    status: "Needs attention",
  },
];

export default function KnowledgeMapPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            KNOWLEDGE MAP
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Your knowledge map
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Understand which concepts you have mastered and which topics need
            more attention.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Learning mastery
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your current understanding across important topics.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
              Overall mastery · 54%
            </div>
          </div>

          <div className="space-y-6">

            {topics.map((topic) => (
              <div key={topic.name}>

                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {topic.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {topic.status}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-600">
                    {topic.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>

              </div>
            ))}

          </div>

        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
              !
            </div>

            <h2 className="font-semibold text-rose-900">
              Topics needing attention
            </h2>

            <p className="mt-2 text-sm leading-6 text-rose-700">
              Classification and Neural Networks currently have lower mastery.
              These topics can become priorities for your next study session.
            </p>

          </section>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              ✓
            </div>

            <h2 className="font-semibold text-emerald-900">
              Strong areas
            </h2>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              Machine Learning and Supervised Learning currently show stronger
              progress in your learning map.
            </p>

          </section>

        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            How the knowledge map will evolve
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            As LearnWeave AI gains quiz results, learning activity, and
            document interactions, this page can become a dynamic knowledge
            graph showing relationships between concepts and your mastery.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">

            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-400">Documents</p>
              <p className="mt-1 font-semibold">→</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-400">Concepts</p>
              <p className="mt-1 font-semibold">→</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-400">Assessments</p>
              <p className="mt-1 font-semibold">→</p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-4 text-center">
              <p className="text-xs text-indigo-500">Mastery</p>
              <p className="mt-1 font-semibold text-indigo-700">AI Map</p>
            </div>

          </div>

        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Study Assistant
          </Link>
        </div>

      </div>
    </main>
  );
}