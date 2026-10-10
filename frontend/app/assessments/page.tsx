"use client";

import Link from "next/link";
import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const demoQuestions: Question[] = [
  {
    question: "What is the main purpose of machine learning?",
    options: [
      "To manually program every decision",
      "To learn patterns from data",
      "To replace databases",
      "To design computer hardware",
    ],
    answer: "To learn patterns from data",
  },
  {
    question: "Which type of learning uses labeled training data?",
    options: [
      "Unsupervised learning",
      "Reinforcement learning",
      "Supervised learning",
      "Random learning",
    ],
    answer: "Supervised learning",
  },
  {
    question: "What is classification generally used for?",
    options: [
      "Predicting categories",
      "Compressing files",
      "Sorting database tables",
      "Rendering web pages",
    ],
    answer: "Predicting categories",
  },
];

export default function AssessmentsPage() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  function startQuiz() {
    setStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setCompleted(false);
  }

  function submitAnswer() {
    if (!selectedAnswer) return;

    const current = demoQuestions[currentQuestion];

    if (selectedAnswer === current.answer) {
      setScore((previous) => previous + 1);
    }

    if (currentQuestion === demoQuestions.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer("");
  }

  function resetQuiz() {
    setStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setCompleted(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            ASSESSMENTS
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Test your understanding
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Generate assessments from your learning materials and identify
            concepts that need more practice.
          </p>
        </div>

        {!started && !completed && (
          <section className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-8 text-white shadow-lg sm:p-10">

            <div className="max-w-2xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                ✓
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                AI-powered learning assessment
              </h2>

              <p className="mt-4 text-sm leading-6 text-indigo-100 sm:text-base">
                LearnWeave AI will generate questions from your uploaded
                study materials so you can test how well you understand the
                concepts.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-indigo-200">
                    Questions
                  </p>
                  <p className="mt-1 font-semibold">
                    AI generated
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-indigo-200">
                    Evaluation
                  </p>
                  <p className="mt-1 font-semibold">
                    Instant scoring
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-indigo-200">
                    Insights
                  </p>
                  <p className="mt-1 font-semibold">
                    Weak topics
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startQuiz}
                className="mt-7 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Start Assessment →
              </button>
            </div>

          </section>
        )}

        {started && !completed && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Question {currentQuestion + 1} of {demoQuestions.length}
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  {demoQuestions[currentQuestion].question}
                </h2>
              </div>

              <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                Score: {score}
              </div>
            </div>

            <div className="space-y-3">
              {demoQuestions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                    selectedAnswer === option
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {currentQuestion === demoQuestions.length - 1
                ? "Finish Assessment"
                : "Next Question →"}
            </button>

          </section>
        )}

        {completed && (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
              ✓
            </div>

            <p className="mt-5 text-sm font-medium text-emerald-600">
              ASSESSMENT COMPLETE
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Your score
            </h2>

            <p className="mt-4 text-5xl font-bold text-indigo-600">
              {score}/{demoQuestions.length}
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
              Your assessment has been completed. Later, LearnWeave AI will
              use your results to identify weak topics and recommend what to
              study next.
            </p>

            <button
              type="button"
              onClick={resetQuiz}
              className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Take Again
            </button>

          </section>
        )}

        <div className="mt-8 flex gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Study Assistant
          </Link>

          <Link
            href="/knowledge-map"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Knowledge Map →
          </Link>
        </div>

      </div>
    </main>
  );
}