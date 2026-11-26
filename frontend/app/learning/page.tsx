
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Course = {
  id: number;
  title: string;
  category: string;
  description: string;
  progress: number;
  lessons: number;
  completed: number;
  color: string;
  icon: string;
  level: string;
};

const initialCourses: Course[] = [
  {
    id: 1,
    title: "Machine Learning",
    category: "Artificial Intelligence",
    description:
      "Learn supervised learning, model evaluation, feature engineering, and practical ML workflows.",
    progress: 75,
    lessons: 20,
    completed: 15,
    color: "amber",
    icon: "🧠",
    level: "Intermediate",
  },
  {
    id: 2,
    title: "Python for Data Science",
    category: "Programming",
    description:
      "Practice Python, NumPy, Pandas, data cleaning, and exploratory data analysis.",
    progress: 60,
    lessons: 15,
    completed: 9,
    color: "blue",
    icon: "🐍",
    level: "Beginner",
  },
  {
    id: 3,
    title: "Deep Learning",
    category: "Artificial Intelligence",
    description:
      "Explore neural networks, CNNs, model training, and deep learning applications.",
    progress: 35,
    lessons: 20,
    completed: 7,
    color: "green",
    icon: "🔬",
    level: "Intermediate",
  },
];

const navigation = [
  { label: "Dashboard", href: "/", icon: "⌂" },
  { label: "My Documents", href: "/documents", icon: "▤" },
  { label: "My Learning", href: "/learning", icon: "▣" },
  { label: "AI Tutor", href: "/tutor", icon: "✧" },
  { label: "Assessments", href: "/assessments", icon: "⌁" },
];

const learningInterests = ["Machine Learning", "Python", "Data Science", "Web Development", "Mathematics", "Biology"];

export default function LearningPage() {
  const [courses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("learnweave_interests") || "[]");
      if (Array.isArray(saved)) {
        // Restore browser preferences after hydration; localStorage is unavailable during SSR.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInterests(saved.filter((item): item is string => typeof item === "string"));
      }
    } catch { /* Ignore malformed saved preferences. */ }
  }, []);

  function toggleInterest(interest: string) {
    setInterests((current) => {
      const next = current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest];
      localStorage.setItem("learnweave_interests", JSON.stringify(next));
      return next;
    });
  }

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    const personalizedCourses = interests.length
      ? [...courses].sort((a, b) => {
          const matches = (course: Course) => interests.some((interest) => `${course.title} ${course.category} ${course.description}`.toLowerCase().includes(interest.toLowerCase()));
          return Number(matches(b)) - Number(matches(a));
        })
      : courses;

    return personalizedCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "In Progress" &&
          course.progress > 0 &&
          course.progress < 100) ||
        (filter === "Completed" && course.progress === 100);

      return matchesSearch && matchesFilter;
    });
  }, [courses, search, filter, interests]);

  const completedLessons = courses.reduce(
    (total, course) => total + course.completed,
    0
  );

  const totalLessons = courses.reduce(
    (total, course) => total + course.lessons,
    0
  );

  const averageProgress = Math.round(
    courses.reduce((total, course) => total + course.progress, 0) /
      Math.max(courses.length, 1)
  );

  return (
    <div className="min-h-screen bg-[#f2f7f1] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-600 to-teal-600 text-xl text-white shadow-lg shadow-amber-200">
              ✦
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-tight">
                LearnWeave <span className="text-amber-600">AI</span>
              </span>
              <span className="hidden text-[10px] tracking-[1.5px] text-slate-400 sm:block">
                YOUR PERSONAL LEARNING SPACE
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={
                  item.label === "My Learning" ? "page" : undefined
                }
                className={`whitespace-nowrap rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  item.label === "My Learning"
                    ? "bg-amber-50 text-amber-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-amber-700"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">Ram Charan</p>
              <p className="text-xs text-slate-400">Student account</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-amber-200 bg-amber-100 text-sm font-extrabold text-amber-700">
              RC
            </div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 xl:hidden">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                item.label === "My Learning"
                  ? "bg-amber-100 text-amber-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-white px-3 py-2 text-xs font-bold text-amber-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              YOUR LEARNING WORKSPACE
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              My Learning <span className="text-amber-600">✦</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Continue your courses, track your progress, and build your
              skills one lesson at a time.
            </p>
          </div>

          <Link
            href="/documents"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-700"
          >
            + Study Materials
          </Link>
        </section>

        <section aria-labelledby="interest-heading" className="mb-8 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 id="interest-heading" className="font-extrabold">Shape your study feed</h2>
              <p className="mt-1 text-sm text-slate-500">Choose subjects you enjoy. We’ll bring related courses and assessments forward.</p>
            </div>
            <Link href="/assessments" className="text-sm font-bold text-amber-800 hover:text-amber-950">Practice a subject →</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{learningInterests.map((interest) => <button key={interest} type="button" aria-pressed={interests.includes(interest)} onClick={() => toggleInterest(interest)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${interests.includes(interest) ? "border-amber-700 bg-amber-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-amber-400"}`}>{interest}</button>)}</div>
        </section>

        {notice && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="font-bold"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Enrolled courses
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-xl">
                📚
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold">{courses.length}</p>
            <p className="mt-1 text-xs text-slate-400">
              Courses in your workspace
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Lessons completed
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-xl">
                ✓
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold">
              {completedLessons}
              <span className="ml-1 text-base font-semibold text-slate-400">
                / {totalLessons}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Across all listed courses
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Average progress
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-50 text-xl">
                📈
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold">{averageProgress}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-600 transition-all"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#14241b] via-[#0c1712] to-[#111a12] p-6 text-white shadow-xl shadow-amber-200 sm:p-9">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-amber-100">
                ✧ YOUR NEXT STEP
              </span>
              <h2 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl">
                Small lessons.
                <br />
                <span className="text-amber-200">Meaningful progress.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-amber-100">
                Pick up where you left off, revise a difficult concept, or
                use your study materials to explore something new.
              </p>
            </div>

            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-extrabold text-amber-800 transition hover:bg-amber-50"
            >
              Open study workspace <span>→</span>
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Your courses
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose a course to continue your learning journey.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses..."
                aria-label="Search courses"
                className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 sm:w-56"
              />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter courses"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              >
                <option>All</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-lg font-bold">No courses found</p>
              <p className="mt-2 text-sm text-slate-500">
                Try a different search or filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${
                        course.color === "amber"
                          ? "bg-amber-50"
                          : course.color === "blue"
                            ? "bg-lime-50"
                            : "bg-emerald-50"
                      }`}
                    >
                      {course.icon}
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {course.level}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-wider text-amber-600">
                    {course.category}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold">
                    {course.title}
                  </h3>
                  <p className="mt-2 min-h-[66px] text-sm leading-6 text-slate-500">
                    {course.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-700">
                      Your progress
                    </span>
                    <span className="font-extrabold text-amber-700">
                      {course.progress}%
                    </span>
                  </div>

                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${course.title} progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={course.progress}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${
                        course.color === "amber"
                          ? "bg-amber-600"
                          : course.color === "blue"
                            ? "bg-lime-600"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    {course.completed} of {course.lessons} lessons completed
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        `${course.title}: course overview selected. Connect your lesson content or backend to open the actual lessons.`
                      )
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
                  >
                    {course.progress === 100
                      ? "Review course"
                      : "Continue learning"}
                    <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                Make your next session count
              </p>
              <h2 className="mt-2 text-xl font-extrabold">
                Need help understanding a topic?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Open your study documents and use the available AI question
                answering feature to explore your material.
              </p>
            </div>
            <Link
              href="/documents"
              className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 hover:bg-amber-100"
            >
              Open My Documents →
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          <p className="font-bold text-slate-700">LearnWeave AI</p>
          <p className="mt-2">
            Learn at your own pace. Understand one concept at a time.
          </p>
        </footer>
      </main>
    </div>
  );
}
