
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://learnweave-ai.onrender.com";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
       body: JSON.stringify({
  full_name: name.trim(),
  email: email.trim().toLowerCase(),
  password,
}),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
  const message = Array.isArray(data.detail)
    ? data.detail
        .map((item: { msg?: string; loc?: (string | number)[] }) =>
          `${item.loc?.join(".") ?? "Field"}: ${item.msg ?? "Invalid input"}`
        )
        .join(", ")
    : typeof data.detail === "string"
      ? data.detail
      : `Request failed (${response.status})`;

  throw new Error(message);
}

      setSuccess("Account created successfully. Redirecting to sign in...");

      window.setTimeout(() => {
        router.push("/signin");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to LearnWeave AI."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-600 bg-[#0b1020] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-200";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b19] px-4 py-10 text-white sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-700/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
      />

      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111528] p-6 shadow-2xl shadow-black/30 sm:p-9">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-lg text-lg font-extrabold tracking-tight text-white transition hover:opacity-90"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl text-white shadow-lg shadow-violet-900/30">
            ✦
          </span>
          <span>
            LearnWeave{" "}
            <span className="text-violet-400">AI</span>
          </span>
        </Link>

        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            Start your journey
          </p>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Build better study habits, explore new concepts, and make your
            learning journey more effective.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={inputClass}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="h-4 w-4 accent-violet-500"
            />
            Show passwords
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-200"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-500 hover:to-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-400">Already learning with us?</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <p className="text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-bold text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-slate-500">
          Learn at your own pace. One concept at a time.
        </p>
      </section>
    </main>
  );
}
