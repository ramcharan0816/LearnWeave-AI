
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
    "w-full rounded-xl border border-[#deded2] bg-[#fffefa] px-4 py-3 text-sm font-medium text-[#1b3029] placeholder:text-[#969c8f] outline-none transition duration-200 focus:border-[#557e63] focus:ring-4 focus:ring-[#557e63]/10";

  const labelClass = "mb-2 block text-sm font-semibold text-[#34483b]";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0eee4] px-4 py-8 text-[#1b3029] sm:px-8 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-[#d6dfce]/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#f2d9b7]/60 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#d8d8cc] bg-[#fffdf7] shadow-[0_28px_80px_-36px_rgba(26,48,40,0.35)] md:min-h-[760px] md:grid-cols-[0.92fr_1.08fr]">
        <section className="relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden bg-[#173b32] p-7 text-white sm:p-10 md:min-h-full md:p-12 lg:p-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_15%,rgba(135,174,119,0.28),transparent_42%),radial-gradient(ellipse_at_90%_90%,rgba(209,166,101,0.20),transparent_38%)]" />
          <div aria-hidden="true" className="absolute -right-28 top-16 -z-10 h-80 w-80 rounded-full border border-white/10 md:top-32 md:h-[28rem] md:w-[28rem]">
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="absolute inset-24 rounded-full border border-white/10" />
          </div>

          <Link href="/" className="inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-white">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#dce9c9] text-xl font-black text-[#173b32]">L<span className="sr-only">LearnWeave</span></span>
            <span className="text-lg font-bold tracking-tight">LearnWeave <span className="font-medium text-[#c4d2aa]">AI</span></span>
          </Link>

          <div className="relative mt-8 max-w-lg md:mt-14">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#dce9c9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d3a962]" /> A space made for you
            </div>
            <h1 className="max-w-md text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
              Make room for
              <br />
              <span className="font-serif font-normal italic text-[#dce9c9]">what’s next.</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#d6e0d5] sm:text-base">
              Bring your interests together, build a steady rhythm, and keep every new idea within reach.
            </p>

            <div className="mt-8 space-y-4 border-t border-white/15 pt-6">
              <p className="flex items-center gap-3 text-sm text-[#e4e9dd]"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs text-[#dce9c9]">01</span> Keep study materials organized</p>
              <p className="flex items-center gap-3 text-sm text-[#e4e9dd]"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs text-[#dce9c9]">02</span> Explore subjects that interest you</p>
              <p className="flex items-center gap-3 text-sm text-[#e4e9dd]"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs text-[#dce9c9]">03</span> See your progress take shape</p>
            </div>
          </div>

          <p className="mt-8 text-xs tracking-wide text-[#b5c7b9]">Learn at your pace · Grow your way</p>
        </section>

        <section className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
          <Link href="/" className="mb-7 inline-flex w-fit items-center gap-2 text-base font-bold tracking-tight text-[#173b32] md:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173b32] text-sm text-[#dce9c9]">L</span> LearnWeave <span className="font-medium text-[#74876c]">AI</span>
          </Link>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#74876c]">Start your journey</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1b3029] sm:text-4xl">Create your account.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#6c7569]">One thoughtful step toward learning that feels like yours.</p>
          </div>

          <form onSubmit={handleSignUp} className="mt-7 space-y-4">
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

          <label className="flex cursor-pointer items-center gap-3 text-sm text-[#6c7569]">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="h-4 w-4 rounded border-[#bdc7b8] accent-[#315e49]"
            />
            Show passwords
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-[#e7c9bd] bg-[#fff5f0] px-4 py-3 text-sm leading-6 text-[#9c4937]"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-[#bbd1bb] bg-[#eff5ec] px-4 py-3 text-sm leading-6 text-[#315e49]"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#1d4939] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(23,59,50,0.7)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#173b32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#789b77] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating your space…" : <>Create your account <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></>}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#6c7569]">Already have an account? <Link href="/signin" className="font-bold text-[#315e49] hover:text-[#173b32] hover:underline">Sign in</Link></p>
        <p className="mt-5 text-xs leading-5 text-[#92978b]">Your learning space is ready when you are.</p>
      </section>
      </div>
    </main>
  );
}
