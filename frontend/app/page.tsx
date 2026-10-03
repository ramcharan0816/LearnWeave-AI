
const learningItems = [
  { title: "Introduction to Machine Learning", category: "Machine Learning", progress: 75, color: "bg-violet-500" },
  { title: "Python for Data Science", category: "Programming", progress: 60, color: "bg-blue-500" },
  { title: "Deep Learning Fundamentals", category: "Artificial Intelligence", progress: 35, color: "bg-emerald-500" },
];

const navigation = [
  { icon: "⌂", label: "Dashboard", active: true },
  { icon: "▤", label: "My Learning", active: false },
  { icon: "✧", label: "AI Tutor", active: false },
  { icon: "◎", label: "Knowledge Map", active: false },
  { icon: "▣", label: "Assessments", active: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800 md:flex">
      <aside className="flex w-full flex-col border-r border-slate-200 bg-white p-5 md:min-h-screen md:w-64">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold text-white">
            L
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LearnWeave</h1>
            <p className="text-xs text-slate-500">AI Learning Platform</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                item.active
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto hidden rounded-2xl bg-violet-50 p-4 md:block">
          <div className="mb-2 text-2xl">✦</div>
          <h3 className="font-semibold text-slate-800">Keep learning!</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Small steps every day lead to big achievements.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
            RC
          </div>
          <div>
            <p className="text-sm font-semibold">Student</p>
            <p className="text-xs text-slate-500">Personal workspace</p>
          </div>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Your personal learning space</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, Ram!
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Continue your learning journey and achieve your goals.
            </p>
          </div>
          <button className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700">
            + New Learning Goal
          </button>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Learning Hours", value: "24.5", note: "This month", icon: "◷" },
            { label: "Topics Studied", value: "18", note: "Across all subjects", icon: "▤" },
            { label: "Current Streak", value: "7 days", note: "Keep it going!", icon: "⚡" },
            { label: "Average Mastery", value: "72%", note: "Based on sample data", icon: "◎" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-600">
                  {stat.icon}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Continue Learning</h3>
                <p className="mt-1 text-sm text-slate-500">Pick up where you left off</p>
              </div>
              <button className="text-sm font-semibold text-violet-600">View all</button>
            </div>

            <div className="space-y-6">
              {learningItems.map((item) => (
                <div key={item.title}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                    </div>
                    <span className="text-sm font-semibold">{item.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                ✧
              </div>
              <p className="text-sm font-medium text-violet-100">Your AI Learning Companion</p>
              <h3 className="mt-2 text-xl font-bold">Need help understanding a topic?</h3>
              <p className="mt-2 text-sm leading-6 text-violet-100">
                Explore concepts, ask questions, and get personalized explanations.
              </p>
              <button className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50">
                Explore AI Tutor →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Upcoming Revision</h3>
              <p className="mt-1 text-sm text-slate-500">Topics to revisit</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                    01
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">Python Fundamentals</p>
                    <p className="text-xs text-slate-500">Suggested revision</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                    02
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">Supervised Learning</p>
                    <p className="text-xs text-slate-500">Suggested revision</p>
                  </div>
                </div>
                <p className="border-t border-slate-100 pt-3 text-xs text-slate-400">
                  Sample content for the initial dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          LearnWeave AI · Learn at your own pace
        </footer>
      </section>
    </main>
  );
}