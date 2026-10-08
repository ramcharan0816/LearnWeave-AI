
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Source = {
  filename?: string;
  page_number?: number;
  chunk_index?: number;
  content?: string;
  similarity_score?: number;
};

type Document = {
  filename: string;
  total_chunks: number;
  total_pages: number;
  uploaded_at: string | null;
};


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  async function uploadDocument() {
    if (!file) {
      setUploadMessage("Please select a PDF file first.");
      return;
    }

    setUploading(true);
    setError("");
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/api/v1/documents/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Upload failed (${response.status})`
        );
      }

      setUploaded(true);
      setUploadMessage(
        data.message ||
          `${file.name} uploaded successfully. You can now ask questions.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload the document."
      );
    } finally {
      setUploading(false);
    }
  }

  async function askQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) return;

    setAsking(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch(`${API_URL}/api/v1/rag/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          top_k: 3,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Question failed (${response.status})`
        );
      }

      setAnswer(data.answer || "The API returned no answer.");
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate an answer."
      );
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              L
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                LearnWeave
              </h1>
              <p className="text-xs text-slate-500">AI Learning Space</p>
            </div>
          </div>

         <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
  Workspace
</p>

<Link
  href="/"
  className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 font-medium text-indigo-700"
>
  <span>⌂</span>
  <span>Study assistant</span>
</Link>

<Link
  href="/learning"
  className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
>
  <span>▤</span>
  <span>My documents</span>
</Link>

<Link
  href="/assessments"
  className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
>
  <span>◷</span>
  <span>Recent activity</span>
</Link>

          <div className="mt-auto rounded-2xl bg-slate-50 p-4">
            <div className="mb-2 text-sm font-semibold">Your AI study space</div>
            <p className="text-xs leading-5 text-slate-500">
              Learn from your own materials with document-grounded AI answers.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white md:hidden">
                L
              </div>
              <div>
                <p className="text-sm font-semibold">Study assistant</p>
                <p className="text-xs text-slate-500">
                  Your personal AI learning companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              AI workspace
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
            <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-7 text-white shadow-lg shadow-indigo-200 sm:p-10">
              <p className="mb-3 text-sm font-medium text-indigo-100">
                YOUR PERSONALIZED LEARNING SPACE
              </p>
              <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                Turn your study materials into understanding.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Upload your notes, ask questions, and explore clear answers
                grounded in your learning resources.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-white/15 px-3 py-2">
                  Document-based learning
                </span>
                <span className="rounded-full bg-white/15 px-3 py-2">
                  AI-powered answers
                </span>
                <span className="rounded-full bg-white/15 px-3 py-2">
                  Source references
                </span>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Learning materials</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload a PDF to your study space.
                    </p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-2.5 text-xl text-indigo-600">
                    ▤
                  </div>
                </div>

                <label
                  htmlFor="pdf-upload"
                  className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl text-indigo-600 shadow-sm">
                    ↑
                  </div>
                  <span className="text-sm font-semibold">
                    Choose a PDF to upload
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Select a file from your device
                  </span>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(event) => {
                      const selected = event.target.files?.[0] || null;
                      setFile(selected);
                      setUploaded(false);
                      setUploadMessage("");
                      setError("");
                    }}
                  />
                </label>

                {file && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                    <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
                      PDF
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setUploaded(false);
                        setUploadMessage("");
                      }}
                      className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                      aria-label="Remove selected file"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={uploadDocument}
                  disabled={!file || uploading}
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {uploading ? "Uploading..." : "Upload document"}
                </button>

                {uploadMessage && (
                  <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                    {uploadMessage}
                  </p>
                )}

                {uploaded && (
                  <p className="mt-3 text-xs text-slate-500">
                    Your document has been submitted to the backend.
                  </p>
                )}

                <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                  Upload PDF files containing text-based study material.
                  Your backend extracts and indexes the content for retrieval.
                </div>
              </section>

              <section className="flex min-h-[480px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Ask your study assistant</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Ask a question about your learning material.
                    </p>
                  </div>
                  <div className="rounded-xl bg-violet-50 p-2.5 text-xl text-violet-600">
                    ✧
                  </div>
                </div>

                <div className="flex flex-1 flex-col rounded-2xl bg-slate-50 p-4">
                  {!answer && !asking && (
                    <div className="m-auto max-w-xs py-8 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-indigo-600 shadow-sm">
                        ✧
                      </div>
                      <h4 className="font-semibold">What would you like to learn?</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Ask a question and get an AI-generated answer with
                        references to your documents.
                      </p>
                    </div>
                  )}

                  {asking && (
                    <div className="m-auto py-8 text-center">
                      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                      <p className="text-sm font-medium text-slate-600">
                        Finding information and generating your answer...
                      </p>
                    </div>
                  )}

                  {answer && !asking && (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          AI answer
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                          {answer}
                        </p>
                      </div>

                      {sources.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Sources ({sources.length})
                          </h4>
                          <div className="space-y-2">
                            {sources.map((source, index) => (
                              <div
                                key={`${source.filename || "source"}-${source.page_number || index}-${index}`}
                                className="rounded-xl border border-slate-200 bg-white p-3"
                              >
                                <p className="text-sm font-medium text-slate-700">
                                  {source.filename || `Source ${index + 1}`}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {source.page_number
                                    ? `Page ${source.page_number}`
                                    : "Document reference"}
                                  {typeof source.similarity_score === "number"
                                    ? ` · Similarity ${(source.similarity_score * 100).toFixed(1)}%`
                                    : ""}
                                </p>
                                {source.content && (
                                  <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-500">
                                    {source.content}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <form onSubmit={askQuestion} className="mt-4">
                  <label htmlFor="question" className="sr-only">
                    Ask a question
                  </label>
                  <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                    <textarea
                      id="question"
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder="Ask something about your study material..."
                      rows={2}
                      className="max-h-32 min-h-12 flex-1 resize-y bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!question.trim() || asking}
                      className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {asking ? "..." : "Ask ↗"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Press Enter to ask · Shift + Enter for a new line
                  </p>
                </form>
              </section>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              >
                <strong className="mr-1">Something went wrong:</strong>
                {error}
              </div>
            )}

            <footer className="py-8 text-center text-xs text-slate-400">
              LearnWeave AI · Learn at your own pace
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}