"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://learnweaveai.onrender.com";

type Stage = "email" | "otp" | "password";

async function readResponse(response: Response) {
  const text = await response.text();

  let data: Record<string, unknown> = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      response.status === 404
        ? "The password-reset API was not found. Please try again later."
        : "The server returned an unexpected response. Please try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : typeof data.message === "string"
          ? data.message
          : `Request failed (${response.status}). Please try again.`
    );
  }

  return data;
}

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  async function handleRequestOTP(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await readResponse(
        await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        })
      );

      setStage("otp");
      setSuccess(
        "If an account exists for this email, a reset code will be sent. Check your inbox and spam folder."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to request a reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit code from your email.");
      return;
    }

    setLoading(true);

    try {
      const data = await readResponse(
        await fetch(`${API_URL}/api/v1/auth/verify-reset-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp,
          }),
        })
      );

      if (typeof data.reset_token !== "string" || !data.reset_token) {
        throw new Error("The server did not return a reset token. Please request a new code.");
      }

      setResetToken(data.reset_token);
      setStage("password");
      setSuccess("Your code has been verified. Choose a new password.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Your new password must contain at least eight characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await readResponse(
        await fetch(`${API_URL}/api/v1/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            reset_token: resetToken,
            new_password: newPassword,
          }),
        })
      );

      setSuccess("Password reset successfully. You can now sign in.");
      setNewPassword("");
      setConfirmPassword("");
      window.setTimeout(() => {
        window.location.assign("/signin");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const stepNumber = stage === "email" ? 1 : stage === "otp" ? 2 : 3;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5ff] px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_30px_100px_-35px_rgba(76,29,149,0.3)] md:min-h-[650px] md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-950 p-10 text-white md:flex lg:p-12">
          <div className="absolute -right-20 top-28 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-10 top-40 h-44 w-44 rounded-full border border-white/10" />

          <Link href="/" className="relative text-2xl font-extrabold tracking-tight">
            LearnWeave <span className="text-violet-200">AI</span>
          </Link>

          <div className="relative">
            <div className="mb-7 grid h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/10 text-3xl shadow-lg backdrop-blur">
              ✦
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-200">
              Account recovery
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              A fresh start
              <br />
              begins here.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-violet-100/90">
              Recover access securely and get back to your learning journey.
              Your next idea is only a step away.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-lg">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold">Secure recovery</p>
                <p className="mt-1 text-xs text-violet-200">
                  Email verification required
                </p>
              </div>
            </div>
          </div>

          <p className="relative text-xs text-violet-200">
            Learn smarter. Grow further.
          </p>
        </aside>

        <section className="px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-violet-700 md:hidden"
          >
            LearnWeave <span className="text-indigo-600">AI</span>
          </Link>

          <div className="mt-7 md:mt-1">
            <div className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
              STEP {stepNumber} OF 3
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {stage === "email"
                ? "Forgot your password?"
                : stage === "otp"
                  ? "Check your email"
                  : "Create a new password"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {stage === "email"
                ? "Enter the email linked to your account and we'll help you recover access."
                : stage === "otp"
                  ? `Enter the six-digit verification code sent to ${email}.`
                  : "Choose a strong new password for your account."}
            </p>
          </div>

          <div className="mt-7 flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition ${
                  step <= stepNumber ? "bg-violet-600" : "bg-slate-100"
                }`}
              />
            ))}
          </div>

          {stage === "email" && (
            <form onSubmit={handleRequestOTP} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending request..." : "Send reset code"}
              </button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={handleVerifyOTP} className="mt-8 space-y-5">
              <div>
                <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-slate-700">
                  Six-digit verification code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className={`${inputClass} text-center text-xl font-bold tracking-[0.4em]`}
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  The code expires after 10 minutes. Check your spam folder if you cannot find the email.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify code"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStage("email");
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                Use a different email or request another code
              </button>
            </form>
          )}

          {stage === "password" && (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
              <div>
                <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                  New password
                </label>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter the password again"
                  className={inputClass}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  className="h-4 w-4 accent-violet-700"
                />
                Show passwords
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating password..." : "Reset password"}
              </button>
            </form>
          )}

          {error && (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              {success}
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <Link
              href="/signin"
              className="text-sm font-semibold text-violet-700 transition hover:text-violet-900"
            >
              ← Back to sign in
            </Link>
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            LearnWeave AI · Secure account recovery
          </p>
        </section>
      </div>
    </main>
  );
}
