
"use client";

import { useEffect, useState } from "react";

type LearningCourse = {
  title: string;
  category: string;
  progress: number;
};

type DashboardData = {
  student_name: string;
  learning_hours: number;
  topics_studied: number;
  current_streak_days: number;
  average_mastery: number;
  courses: LearningCourse[];
  upcoming_revision: string[];
};

const navigation = [
  { icon: "⌂", label: "Dashboard", active: true },
  { icon: "▤", label: "My Learning", active: false },
  { icon: "✧", label: "AI Tutor", active: false },
  { icon: "◎", label: "Knowledge Map", active: false },
  { icon: "▣", label: "Assessments", active: false },
];

const courseColors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
];

export default function Home() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/dashboard/overview"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load dashboard (HTTP ${response.status})`
          );
        }

        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to the backend"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "Learning Hours",
      value: dashboardData
        ? dashboardData.learning_hours
        : "—",
      note: "This month",
      icon: "◷",
    },
    {
      label: "Topics Studied",
      value: dashboardData
        ? dashboardData.topics_studied
        : "—",
      note: "Across all subjects",
      icon: "▤",
    },
    {
      label: "Current Streak",
      value: dashboardData
        ? `${dashboardData.current_streak_days} days`
        : "—",
      note: "Keep it going!",
      icon: "⚡",
    },
    {
      label: "Average Mastery",
      value: dashboardData
        ? `${dashboardData.average_mastery}%`
        : "—",
      note: "Based on your progress",
      icon: "◎",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800 md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col border-r border-slate-200 bg-white p-5 md:min-h-screen md:w-64">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold text-white">
            L
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              LearnWeave
            </h1>
            <p className="text-xs text-slate-500">
              AI Learning Platform
            </p>
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
          <h3 className="font-semibold text-slate-800">
            Keep learning!
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Small steps every day lead to big achievements.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
            RC
          </div>

          <div>
            <p className="text-sm font-semibold">
              {dashboardData?.student_name ?? "Student"}
            </p>
            <p className="text-xs text-slate-500">
              Personal workspace
            </p>
          </div>
        </div>
      </aside>

      {/* Main Dashboard */}
      <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              Your personal learning space
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {dashboardData?.student_name ?? "Ram"}!
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Continue your learning journey and achieve your goals.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            + New Learning Goal
          </button>
        </header>

        {/* Loading and Error States */}
        {loading && (
          <div className="mb-6 rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm text-violet-700">
            Loading your learning dashboard...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">
              Unable to load dashboard data
            </p>
            <p className="mt-1">{error}</p>
            <p className="mt-2">
              Make sure your FastAPI backend is running and CORS
              allows http://localhost:3000.
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-600">
                  {stat.icon}
                </span>
              </div>

              <p className="text-2xl font-bold">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.note}
              </p>
            </div>
          ))}
        </div>

        {/* Learning and Sidebar Cards */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* Continue Learning */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">
                  Continue Learning
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Pick up where you left off
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-violet-600"
              >
                View all
              </button>
            </div>

            <div className="space-y-6">
              {dashboardData?.courses.map((item, index) => (
                <div key={item.title}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.category}
                      </p>
                    </div>

                    <span className="text-sm font-semibold">
                      {item.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        courseColors[index % courseColors.length]
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, item.progress)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {!loading &&
                !error &&
                dashboardData?.courses.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No courses available yet.
                  </p>
                )}

              {loading && (
                <p className="text-sm text-slate-400">
                  Loading courses...
                </p>
              )}
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="space-y-6">
            {/* AI Tutor */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                ✧
              </div>

              <p className="text-sm font-medium text-violet-100">
                Your AI Learning Companion
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Need help understanding a topic?
              </h3>

              <p className="mt-2 text-sm leading-6 text-violet-100">
                Explore concepts, ask questions, and get
                personalized explanations.
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Explore AI Tutor →
              </button>
            </div>

            {/* Upcoming Revision */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">
                Upcoming Revision
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Topics to revisit
              </p>

              <div className="mt-5 space-y-4">
                {dashboardData?.upcoming_revision.map(
                  (topic, index) => (
                    <div
                      key={topic}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${
                          index % 2 === 0
                            ? "bg-blue-50 text-blue-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {topic}
                        </p>
                        <p className="text-xs text-slate-500">
                          Suggested revision
                        </p>
                      </div>
                    </div>
                  )
                )}

                {!loading &&
                  !error &&
                  dashboardData?.upcoming_revision.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No revisions scheduled.
                    </p>
                  )}

                {loading && (
                  <p className="text-sm text-slate-400">
                    Loading revision topics...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-400">
          LearnWeave AI · Learn at your own pace
        </footer>
      </section>
    </main>
  );
}