
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://learnweave-ai.onrender.com";

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

      const data = await response.json().catch(() => ({}));

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

      router.replace("/home-dashboard");
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
    "w-full rounded-xl border border-[#deded2] bg-[#fffefa] px-4 py-3.5 text-sm font-medium text-[#1b3029] placeholder:text-[#969c8f] outline-none transition duration-200 focus:border-[#557e63] focus:ring-4 focus:ring-[#557e63]/10";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0eee4] px-4 py-8 text-[#1b3029] sm:px-8 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-[#d6dfce]/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#f2d9b7]/60 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#d8d8cc] bg-[#fffdf7] shadow-[0_28px_80px_-36px_rgba(26,48,40,0.35)] md:min-h-[680px] md:grid-cols-[0.92fr_1.08fr]">
        <section className="relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden bg-[#173b32] p-7 text-white sm:p-10 md:min-h-full md:p-12 lg:p-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_15%,rgba(135,174,119,0.28),transparent_42%),radial-gradient(ellipse_at_90%_90%,rgba(209,166,101,0.20),transparent_38%)]" />
          <div aria-hidden="true" className="absolute -right-28 top-20 -z-10 h-80 w-80 rounded-full border border-white/10 md:top-32 md:h-[28rem] md:w-[28rem]">
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="absolute inset-24 rounded-full border border-white/10" />
          </div>

          <Link href="/" className="inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-white">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#dce9c9] text-xl font-black text-[#173b32]">L<span className="sr-only">LearnWeave</span></span>
            <span className="text-lg font-bold tracking-tight">LearnWeave <span className="font-medium text-[#c4d2aa]">AI</span></span>
          </Link>

          <div className="relative mt-10 max-w-lg md:mt-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#dce9c9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d3a962]" /> Your learning space
            </div>
            <h1 className="max-w-md text-[2.65rem] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
              Pick up where
              <br />
              <span className="font-serif font-normal italic text-[#dce9c9]">curiosity</span> left off.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#d6e0d5] sm:text-base">
              Your notes, questions, and next big ideas are right where you left them.
            </p>

            <div className="mt-9 flex items-center gap-3 border-t border-white/15 pt-6">
              <div className="flex -space-x-2" aria-hidden="true">
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#173b32] bg-[#e8c7a0] text-xs font-bold text-[#173b32]">A</span>
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#173b32] bg-[#c6d7b8] text-xs font-bold text-[#173b32]">M</span>
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#173b32] bg-[#e9e6d8] text-xs font-bold text-[#173b32]">R</span>
              </div>
              <p className="text-xs leading-5 text-[#d6e0d5]">A little progress, every day.<br /><span className="font-semibold text-white">A lot of possibility.</span></p>
            </div>
          </div>

          <p className="mt-9 text-xs tracking-wide text-[#b5c7b9]">Learn at your pace · Grow your way</p>
        </section>

        <section className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
          <Link href="/" className="mb-9 inline-flex w-fit items-center gap-2 text-base font-bold tracking-tight text-[#173b32] md:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173b32] text-sm text-[#dce9c9]">L</span> LearnWeave <span className="font-medium text-[#74876c]">AI</span>
          </Link>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#74876c]">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1b3029] sm:text-4xl">Good to see you.</h2>
            <p className="mt-3 text-sm leading-6 text-[#6c7569]">Sign in to continue your learning journey.</p>
          </div>

          <form onSubmit={handleSignIn} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#34483b]"
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
                className="mb-2 block text-sm font-semibold text-[#34483b]"
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
                  className="absolute inset-y-0 right-3 my-auto h-fit rounded-md px-2 py-1 text-xs font-bold text-[#557e63] transition hover:bg-[#edf2e9] hover:text-[#173b32]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-[#bdc7b8] accent-[#315e49]"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium text-[#6c7569]"
              >
                Remember me on this device
              </label>
              </div>
              <Link href="/forgot-password" className="text-sm font-bold text-[#557e63] transition hover:text-[#173b32] hover:underline">Forgot password?</Link>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-[#e7c9bd] bg-[#fff5f0] px-4 py-3 text-sm leading-6 text-[#9c4937]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#1d4939] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(23,59,50,0.7)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#173b32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#789b77] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Opening your workspace…" : <>Continue to your workspace <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></>}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-[#e7e4d9] bg-[#f8f7f0] p-4 sm:p-5">
            <p className="text-sm font-semibold text-[#33483a]">New to LearnWeave?</p>
            <p className="mt-1 text-sm leading-6 text-[#737a6e]">Create an account to keep your study materials and progress together.</p>
            <Link href="/signup" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#315e49] hover:text-[#173b32] hover:underline">Create your account <span aria-hidden="true">→</span></Link>
          </div>

          <p className="mt-8 text-xs leading-5 text-[#92978b]">By continuing, you agree to use LearnWeave AI responsibly.</p>
        </section>
      </div>
    </main>
  );
}

