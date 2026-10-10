
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Sign-in failed. Check your email and password."
        );
      }

      if (!data.access_token || !data.student) {
        throw new Error("Invalid response received from the server.");
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      storage.setItem("learnweave_token", data.access_token);
      storage.setItem(
        "learnweave_student",
        JSON.stringify(data.student)
      );

      otherStorage.removeItem("learnweave_token");
      otherStorage.removeItem("learnweave_student");

      router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to LearnWeave AI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-950 placeholder:text-gray-400 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ff] px-5 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 p-10 text-white md:flex">
          <Link href="/" className="text-2xl font-bold">
            LearnWeave <span className="text-violet-200">AI</span>
          </Link>

          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              ✦
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Welcome
              <br />
              back, learner.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-violet-100">
              Continue your learning journey with AI-powered study tools,
              personalized learning resources, and progress tracking.
            </p>
          </div>

          <p className="text-sm text-violet-200">
            Learn smarter. Grow further.
          </p>
        </section>

        <section className="px-7 py-10 sm:px-12 sm:py-12">
          <Link
            href="/"
            className="text-xl font-bold text-violet-700 md:hidden"
          >
            LearnWeave AI
          </Link>

          <div className="mt-6 md:mt-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to LearnWeave
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your account details to continue learning.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute inset-y-0 right-3 my-auto h-fit text-xs font-semibold text-violet-700 hover:text-violet-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-violet-700"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium text-gray-700"
              >
                Remember me on this device
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">NEW TO LEARNWEAVE?</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-violet-700 hover:text-violet-900"
            >
              Create account
            </Link>
          </p>

          <p className="mt-8 text-center text-xs leading-5 text-gray-400">
            By signing in, you agree to use LearnWeave AI responsibly.
          </p>
        </section>
      </div>
    </main>
  );
}
