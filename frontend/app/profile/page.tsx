
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Student = {
  id: number;
  full_name: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const token =
        localStorage.getItem("learnweave_token") ||
        sessionStorage.getItem("learnweave_token");

      if (!token) {
        router.replace("/signin");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (response.status === 401) {
          localStorage.removeItem("learnweave_token");
          localStorage.removeItem("learnweave_student");
          sessionStorage.removeItem("learnweave_token");
          sessionStorage.removeItem("learnweave_student");
          router.replace("/signin");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load your profile.");
        }

        const data: Student = await response.json();

        if (!cancelled) {
          setStudent(data);

          const storage = localStorage.getItem("learnweave_token")
            ? localStorage
            : sessionStorage;

          storage.setItem("learnweave_student", JSON.stringify(data));
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to connect to the server. Please check that your backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("learnweave_token");
    localStorage.removeItem("learnweave_student");
    sessionStorage.removeItem("learnweave_token");
    sessionStorage.removeItem("learnweave_student");
    router.replace("/signin");
  }

  const initials = student?.full_name
    ? student.full_name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "LW";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ff]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
          <p className="mt-4 text-sm text-gray-600">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ff] px-5">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="text-4xl">⚠️</div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Profile unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {error || "We could not retrieve your account information."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800"
          >
            Try again
          </button>
          <button
            onClick={handleLogout}
            className="ml-3 mt-6 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ff] text-gray-900">
      <header className="sticky top-0 z-10 border-b border-violet-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            LearnWeave <span className="text-violet-700">AI</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <Link href="/" className="hover:text-violet-700">
              Dashboard
            </Link>
            <Link href="/learning" className="hover:text-violet-700">
              My Learning
            </Link>
            <Link href="/tutor" className="hover:text-violet-700">
              AI Tutor
            </Link>
            <Link href="/knowledge-map" className="hover:text-violet-700">
              Knowledge Map
            </Link>
            <Link href="/assessments" className="hover:text-violet-700">
              Assessments
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            Account settings
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-gray-500">
            Manage your account and keep track of your learning journey.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
            <div className="h-28 bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700" />

            <div className="px-6 pb-7">
              <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-violet-100 text-3xl font-extrabold text-violet-800 shadow-sm">
                {initials}
              </div>

              <h2 className="mt-5 break-words text-2xl font-bold">
                {student.full_name}
              </h2>
              <p className="mt-1 break-all text-sm text-gray-500">
                {student.email}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Signed in
              </div>

              <div className="mt-7 border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account ID
                </p>
                <p className="mt-2 font-semibold text-gray-700">
                  LW-{String(student.id).padStart(4, "0")}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Sign out of LearnWeave AI
              </button>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Personal information</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your registered account details.
                  </p>
                </div>
                <div className="rounded-xl bg-violet-50 p-3 text-xl">
                  👤
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Full name
                  </p>
                  <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium">
                    {student.full_name}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email address
                  </p>
                  <div className="mt-2 break-all rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium">
                    {student.email}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Student ID
                  </p>
                  <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium">
                    {student.id}
                  </div>
                </div>

                <p className="text-xs leading-5 text-gray-400">
                  These details are retrieved from your LearnWeave AI account.
                  Editing profile information is not enabled yet.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">Your learning space</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Continue learning with your personalized study tools.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/learning"
                  className="rounded-2xl border border-violet-100 p-4 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  <span className="text-2xl">📚</span>
                  <p className="mt-3 font-bold">My Learning</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Explore your learning materials.
                  </p>
                </Link>

                <Link
                  href="/tutor"
                  className="rounded-2xl border border-violet-100 p-4 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  <span className="text-2xl">✨</span>
                  <p className="mt-3 font-bold">AI Tutor</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Ask questions and learn concepts.
                  </p>
                </Link>

                <Link
                  href="/knowledge-map"
                  className="rounded-2xl border border-violet-100 p-4 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  <span className="text-2xl">🧠</span>
                  <p className="mt-3 font-bold">Knowledge Map</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Explore connected topics.
                  </p>
                </Link>

                <Link
                  href="/assessments"
                  className="rounded-2xl border border-violet-100 p-4 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  <span className="text-2xl">🎯</span>
                  <p className="mt-3 font-bold">Assessments</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Practice and test your knowledge.
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </div>

        <footer className="py-8 text-center text-xs text-gray-400">
          LearnWeave AI · Your personalized learning companion
        </footer>
      </div>
    </main>
  );
}
