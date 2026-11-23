"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://learnweave-ai.onrender.com";
type Question = { question: string; options: string[]; answer: string; explanation: string };
const interests = ["Machine Learning", "Python", "Data Science", "Web Development", "Mathematics", "Biology"];

export default function AssessmentsPage() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("learnweave_interests");
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        // Restore a client preference after hydration without reading browser storage during SSR.
        if (Array.isArray(parsed) && typeof parsed[0] === "string") {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setTopic(parsed[0]);
        }
      } catch { /* Ignore malformed saved preferences. */ }
    }
  }, []);

  async function startAssessment() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/v1/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ topic: topic.trim(), num_questions: 5 }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : `Assessment unavailable (${response.status}).`);
      if (!Array.isArray(data.questions) || data.questions.length === 0) throw new Error("No questions were generated. Upload study material and try again.");
      setQuestions(data.questions);
      setCurrent(0); setSelected(""); setScore(0); setFinished(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate an assessment. Please try again.");
    } finally { setLoading(false); }
  }

  function submitAnswer() {
    if (!selected) return;
    const nextScore = score + (selected === questions[current].answer ? 1 : 0);
    setScore(nextScore);
    setSelected("");
    if (current === questions.length - 1) setFinished(true);
    else setCurrent((index) => index + 1);
  }

  function reset() { setQuestions([]); setFinished(false); setCurrent(0); setScore(0); setError(""); }

  return <main className="min-h-screen bg-[#fbf8f1] text-slate-800">
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <Link href="/learning" className="text-sm font-semibold text-amber-800 hover:text-amber-950">← Back to your learning</Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Practice studio</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Test what you know.</h1>
      <p className="mt-4 max-w-2xl text-slate-600">Build a short assessment from your uploaded study materials. Choose a subject you care about and get questions grounded in your documents.</p>

      {error && <div role="alert" className="mt-7 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}

      {!questions.length && <section className="mt-8 rounded-3xl border border-amber-100 bg-white p-7 shadow-sm sm:p-9">
        <label htmlFor="topic" className="block text-sm font-bold">Choose a subject</label>
        <select id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-100">
          <option value="">All uploaded study materials</option>
          {interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
        </select>
        <p className="mt-2 text-xs text-slate-500">Your saved learning interests are selected automatically when available.</p>
        <button type="button" onClick={startAssessment} disabled={loading} className="mt-6 rounded-xl bg-amber-700 px-6 py-3 font-bold text-white transition hover:bg-amber-800 disabled:opacity-60">{loading ? "Building your questions…" : "Generate assessment →"}</button>
      </section>}

      {questions.length > 0 && !finished && <section className="mt-8 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wide text-amber-800">Question {current + 1} of {questions.length}</p><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">{topic || "Your materials"}</span></div>
        <h2 className="mt-4 text-2xl font-bold leading-snug">{questions[current].question}</h2>
        <div className="mt-6 space-y-3">{questions[current].options.map((option) => <button key={option} type="button" onClick={() => setSelected(option)} className={`w-full rounded-xl border p-4 text-left text-sm transition ${selected === option ? "border-amber-600 bg-amber-50 text-amber-950" : "border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"}`}>{option}</button>)}</div>
        <button type="button" onClick={submitAnswer} disabled={!selected} className="mt-7 rounded-xl bg-amber-700 px-6 py-3 font-bold text-white hover:bg-amber-800 disabled:opacity-40">{current === questions.length - 1 ? "Finish assessment" : "Next question →"}</button>
      </section>}

      {finished && <section className="mt-8 rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Assessment complete</p><h2 className="mt-3 text-3xl font-extrabold">Your score</h2>
        <p className="mt-4 text-5xl font-extrabold text-amber-800">{score}/{questions.length}</p>
        <p className="mt-3 text-slate-600">Questions were generated from the study material available for {topic || "your selected documents"}.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={reset} className="rounded-xl border border-amber-200 px-5 py-3 font-bold text-amber-900 hover:bg-amber-50">Choose another subject</button><button type="button" onClick={startAssessment} className="rounded-xl bg-amber-700 px-5 py-3 font-bold text-white hover:bg-amber-800">Try again</button></div>
      </section>}
      <div className="mt-8 flex gap-5 text-sm font-semibold text-amber-800"><Link href="/documents">Study materials →</Link><Link href="/knowledge-map">Knowledge map →</Link></div>
    </div>
  </main>;
}
