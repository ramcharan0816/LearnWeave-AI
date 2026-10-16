
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Student = {
  name?: string;
  full_name?: string;
  email?: string;
};


function Icon({
  name,
  size = 21,
}: {
  name: string;
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "home":
      return <svg {...props}><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></svg>;
    case "file":
      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>;
    case "book":
      return <svg {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16M8 7h8M8 11h7" /></svg>;
    case "sparkles":
      return <svg {...props}><path d="m12 3 2.1 5.9L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-2.1z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2z" /></svg>;
    case "chart":
      return <svg {...props}><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-7" /></svg>;
    case "user":
      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case "arrow":
      return <svg {...props}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
    case "check":
      return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
    default:
      return null;
  }
}

export default function Home() {
  const [name, setName] = useState("Learner");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("learnweave_student") ||
        sessionStorage.getItem("learnweave_student");

      if (saved) {
        const student = JSON.parse(saved) as Student;
        const fullName = student.name || student.full_name;

        if (fullName) {
          setName(fullName.trim().split(/\s+/)[0]);
        } else if (student.email) {
          setName(student.email.split("@")[0]);
        }
      }
    } catch {
      // Keep the default greeting if profile data is unavailable.
    }
  }, []);

  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    { label: "Dashboard", href: "/", icon: "home" },
    { label: "My Documents", href: "/documents", icon: "file" },
    { label: "My Learning", href: "/learning", icon: "book" },
    { label: "AI Tutor", href: "/documents#ai-tutor", icon: "sparkles" },
    { label: "Assessments", href: "/assessments", icon: "chart" },
  ];

  const actions = [
    {
      title: "My Documents",
      description: "Upload and manage your study PDFs.",
      icon: "file",
      color: "bg-violet-50 text-violet-700",
      href: "/documents",
      linkText: "Open documents",
    },
    {
      title: "AI Study Tutor",
      description: "Ask questions about your study material.",
      icon: "sparkles",
      color: "bg-blue-50 text-blue-700",
      href: "/documents#ai-tutor",
      linkText: "Ask a question",
    },
    {
      title: "My Learning",
      description: "Continue exploring your learning space.",
      icon: "book",
      color: "bg-emerald-50 text-emerald-700",
      href: "/learning",
      linkText: "Explore learning",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/70">
              <Icon name="sparkles" size={24} />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                LearnWeave <span className="text-violet-600">AI</span>
              </p>
              <p className="hidden text-[11px] tracking-wide text-slate-400 sm:block">
                YOUR PERSONAL LEARNING SPACE
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  item.label === "Dashboard"
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-violet-700"
                }`}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{name}</p>
              <p className="text-xs text-slate-400">Student account</p>
            </div>
            <Link
              href="/profile"
              title="My profile"
              aria-label="Open profile"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-violet-100 bg-violet-100 text-sm font-bold text-violet-700 ring-4 ring-violet-50 hover:border-violet-300"
            >
              {initials || <Icon name="user" />}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenu((open) => !open)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu}
              className="rounded-xl border border-slate-200 px-3 py-2 text-slate-600 xl:hidden"
            >
              {mobileMenu ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <nav className="border-t border-slate-100 bg-white p-3 xl:hidden">
            <div className="grid gap-1 sm:grid-cols-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              YOUR LEARNING WORKSPACE
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {name} <span className="text-violet-600">✦</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Your learning journey starts here. Organize your materials,
              explore concepts, and make every study session count.
            </p>
          </div>

          <Link
            href="/documents"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            <Icon name="file" size={18} />
            Open My Documents
            <Icon name="arrow" size={16} />
          </Link>
        </section>

        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#30206f] via-[#5137a7] to-[#7758df] p-6 text-white shadow-xl shadow-violet-200/60 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-12 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100">
                <Icon name="sparkles" size={15} />
                YOUR AI-POWERED STUDY SPACE
              </div>
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
                Learn with clarity.
                <span className="block text-violet-200">
                  Grow with confidence.
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-violet-100 sm:text-base">
                Bring your study materials into one place and use your AI
                tutor to understand topics at your own pace.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Organize study PDFs",
                  "Ask questions with AI",
                  "Learn at your pace",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
              <Link
                href="/documents"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
              >
                Start learning <Icon name="arrow" size={17} />
              </Link>
            </div>

            <div className="hidden justify-center lg:flex">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-[36px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-4 rounded-[28px] border border-white/15" />
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white text-violet-700 shadow-xl">
                  <Icon name="sparkles" size={48} />
                </div>
                <div className="absolute -right-7 top-7 rounded-2xl bg-white px-4 py-3 text-violet-800 shadow-lg">
                  <p className="text-xs font-semibold">AI Tutor</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Ready when you are
                  </p>
                </div>
                <div className="absolute -bottom-4 -left-8 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Icon name="check" size={17} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold">Your study space</p>
                      <p className="text-[10px] text-slate-500">
                        All in one place
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Your learning tools
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose where you want to start today.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.color}`}
                  >
                    <Icon name={action.icon} size={23} />
                  </div>
                  <span className="rounded-full bg-slate-50 p-2 text-slate-400 transition group-hover:bg-violet-50 group-hover:text-violet-700">
                    <Icon name="arrow" size={17} />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {action.title}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-violet-700">
                  {action.linkText} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                A small step every day
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Ready for your next study session?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Choose a PDF, ask your AI tutor a question, and use the answer
                to guide your revision.
              </p>
            </div>
            <Link
              href="/documents"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              Go to study workspace
              <Icon name="arrow" size={17} />
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200/80 py-6 text-center">
          <p className="text-sm font-semibold text-slate-600">LearnWeave AI</p>
          <p className="mt-1 text-xs text-slate-400">
            Learn at your own pace. Understand one concept at a time.
          </p>
        </footer>
      </main>
    </div>
  );
}
