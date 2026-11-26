"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Student = { name?: string; full_name?: string; email?: string };

function Icon({ name, size = 21 }: { name: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  switch (name) {
    case "home": return <svg {...props}><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></svg>;
    case "file": return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>;
    case "book": return <svg {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16M8 7h8M8 11h7" /></svg>;
    case "sparkles": return <svg {...props}><path d="m12 3 2.1 5.9L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-2.1z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2z" /></svg>;
    case "chart": return <svg {...props}><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-7" /></svg>;
    case "user": return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case "arrow": return <svg {...props}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
    case "check": return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
    default: return null;
  }
}

export default function Home() {
  const [name, setName] = useState("Learner");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("learnweave_student") || sessionStorage.getItem("learnweave_student");
      if (saved) {
        const student = JSON.parse(saved) as Student;
        const fullName = student.name || student.full_name;
        if (fullName) {
          // Profile data is available only after browser hydration.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setName(fullName.trim().split(/\s+/)[0]);
        } else if (student.email) setName(student.email.split("@")[0]);
      }
    } catch {
      // Keep the default greeting if saved profile data is unavailable.
    }
  }, []);

  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const navItems = [
    { label: "Dashboard", href: "/home-dashboard", icon: "home" },
    { label: "Documents", href: "/documents", icon: "file" },
    { label: "Learning", href: "/learning", icon: "book" },
    { label: "AI Tutor", href: "/documents#ai-tutor", icon: "sparkles" },
    { label: "Assessments", href: "/assessments", icon: "chart" },
  ];
  const actions = [
    { title: "Your library", eyebrow: "01 / ORGANIZE", description: "Keep the PDFs and study material you rely on close at hand.", icon: "file", tone: "lime", href: "/documents", linkText: "Open documents" },
    { title: "AI study tutor", eyebrow: "02 / UNDERSTAND", description: "Ask focused questions and explore ideas in your own material.", icon: "sparkles", tone: "mint", href: "/documents#ai-tutor", linkText: "Start a conversation" },
    { title: "Learning paths", eyebrow: "03 / PROGRESS", description: "Shape a study rhythm that fits the way you like to learn.", icon: "book", tone: "coral", href: "/learning", linkText: "Explore learning" },
    { title: "Knowledge map", eyebrow: "04 / CONNECT", description: "See how the ideas you study relate to each other.", icon: "chart", tone: "mint", href: "/knowledge-map", linkText: "View your map" },
  ];

  return (
    <div className="lw-dashboard min-h-screen bg-[#07110e] text-[#edf4ec]">
      <div aria-hidden="true" className="lw-dashboard-grid pointer-events-none fixed inset-0 opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07110e]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <Link href="/home-dashboard" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c5ff58] text-[#102019] shadow-[0_0_28px_rgba(197,255,88,0.25)]"><Icon name="sparkles" size={23} /></div>
            <div><p className="text-lg font-bold tracking-tight text-white">LearnWeave <span className="text-[#c5ff58]">AI</span></p><p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[#82978b] sm:block">Learning, in motion</p></div>
          </Link>
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {navItems.map((item) => <Link key={item.label} href={item.href} className={["flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[13px] font-medium transition", item.label === "Dashboard" ? "bg-white/[0.09] text-[#c5ff58] ring-1 ring-white/[0.08]" : "text-[#91a399] hover:bg-white/[0.06] hover:text-white"].join(" ")}><Icon name={item.icon} size={16} />{item.label}</Link>)}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold text-white">{name}</p><p className="text-[11px] text-[#82978b]">Your learning space</p></div>
            <Link href="/profile" title="My profile" aria-label="Open profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c5ff58]/30 bg-[#c5ff58]/10 text-sm font-bold text-[#d9ff9a] transition hover:bg-[#c5ff58]/20">{initials || <Icon name="user" size={18} />}</Link>
            <button type="button" onClick={() => setMobileMenu((open) => !open)} aria-label="Toggle navigation" aria-expanded={mobileMenu} className="rounded-full border border-white/10 px-3 py-2 text-[#dce7dc] xl:hidden">{mobileMenu ? "✕" : "☰"}</button>
          </div>
        </div>
        {mobileMenu && <nav className="border-t border-white/10 bg-[#0b1712] p-3 xl:hidden" aria-label="Mobile navigation"><div className="grid gap-1 sm:grid-cols-2">{navItems.map((item) => <Link key={item.label} href={item.href} onClick={() => setMobileMenu(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#a8b8ad] transition hover:bg-white/[0.06] hover:text-[#c5ff58]"><Icon name={item.icon} size={18} />{item.label}</Link>)}</div></nav>}
      </header>

      <main className="relative mx-auto max-w-[1480px] px-4 pb-12 pt-8 sm:px-7 sm:pt-12 lg:px-10">
        <section className="relative isolate mb-10 overflow-hidden rounded-[32px] border border-white/[0.1] px-6 py-8 shadow-[0_36px_100px_-55px_rgba(116,221,104,0.4)] sm:px-10 sm:py-11 lg:px-14 lg:py-14" style={{ background: "radial-gradient(circle at 78% 28%, rgba(197,255,88,0.16), transparent 24%), radial-gradient(circle at 98% 100%, rgba(86,210,170,0.15), transparent 34%), linear-gradient(135deg, #14241b 0%, #0c1712 56%, #111a12 100%)" }}>
          <div aria-hidden="true" className="absolute -right-28 -top-44 h-[460px] w-[460px] rounded-full border border-white/[0.08]" />
          <div aria-hidden="true" className="absolute -right-7 -top-24 h-[330px] w-[330px] rounded-full border border-white/[0.08]" />
          <div aria-hidden="true" className="absolute bottom-0 right-[11%] h-px w-1/3 bg-gradient-to-r from-transparent via-[#c5ff58]/40 to-transparent" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c5ff58]/20 bg-[#c5ff58]/[0.08] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8ff9b]"><span className="h-1.5 w-1.5 rounded-full bg-[#c5ff58] shadow-[0_0_12px_#c5ff58]" />Your personal learning system</div>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-[64px]">Make room for your next <span className="font-serif font-normal italic text-[#c5ff58]">aha.</span></h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#b0c0b5] sm:text-base">Welcome back, {name}. Bring your material together, follow the questions that matter, and turn study time into real understanding.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/documents" className="inline-flex items-center gap-2 rounded-full bg-[#c5ff58] px-5 py-3 text-sm font-bold text-[#102019] shadow-[0_8px_30px_rgba(197,255,88,0.18)] transition hover:-translate-y-0.5 hover:bg-[#d4ff83]">Open your library <Icon name="arrow" size={17} /></Link>
                <Link href="/documents#ai-tutor" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"><Icon name="sparkles" size={17} />Talk to your tutor</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium text-[#91a399]"><span className="inline-flex items-center gap-2"><Icon name="check" size={14} />Your materials, together</span><span className="inline-flex items-center gap-2"><Icon name="check" size={14} />Answers grounded in your PDFs</span></div>
            </div>
            <div className="relative mx-auto flex h-[270px] w-full max-w-[390px] items-center justify-center sm:h-[330px]">
              <div aria-hidden="true" className="lw-orbit absolute h-[258px] w-[258px] rounded-full border border-[#c5ff58]/20 sm:h-[310px] sm:w-[310px]" />
              <div aria-hidden="true" className="absolute h-[205px] w-[205px] rounded-full border border-dashed border-white/15 sm:h-[250px] sm:w-[250px]" />
              <div aria-hidden="true" className="absolute h-[145px] w-[145px] rounded-full bg-[#c5ff58]/10 blur-2xl" />
              <div className="lw-float relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-[34px] border border-white/20 bg-white/[0.08] text-[#c5ff58] shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:h-36 sm:w-36"><Icon name="sparkles" size={42} /><span className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/80">LearnWeave AI</span></div>
              <div className="absolute left-0 top-10 rounded-2xl border border-white/10 bg-[#102019]/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:left-1"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#879a8d]">Study material</p><p className="mt-1 text-xs font-semibold text-white">Your library, ready</p></div>
              <div className="absolute bottom-7 right-0 rounded-2xl border border-white/10 bg-[#102019]/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:right-1"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#c5ff58]/10 text-[#c5ff58]"><Icon name="sparkles" size={16} /></span><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#879a8d]">AI tutor</p><p className="mt-0.5 text-xs font-semibold text-white">Ready when you are</p></div></div></div>
              <span className="absolute right-[16%] top-[16%] h-2 w-2 rounded-full bg-[#f8a77a] shadow-[0_0_16px_rgba(248,167,122,0.8)]" /><span className="absolute bottom-[18%] left-[18%] h-1.5 w-1.5 rounded-full bg-[#c5ff58] shadow-[0_0_14px_#c5ff58]" />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9caf9f]">Your workspace</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Choose your next move.</h2></div><p className="max-w-md text-sm leading-6 text-[#8fa195]">A focused set of tools for collecting ideas, asking better questions, and finding your way through a topic.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {actions.map((action) => {
              const glow = action.tone === "coral" ? "bg-[#f8a77a]/[0.08]" : action.tone === "mint" ? "bg-[#56d2aa]/[0.08]" : "bg-[#c5ff58]/[0.08]";
              const iconTone = action.tone === "coral" ? "border-[#f8a77a]/20 bg-[#f8a77a]/[0.08] text-[#f8a77a]" : action.tone === "mint" ? "border-[#56d2aa]/20 bg-[#56d2aa]/[0.08] text-[#56d2aa]" : "border-[#c5ff58]/20 bg-[#c5ff58]/[0.08] text-[#c5ff58]";
              return <Link key={action.title} href={action.href} className="group relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#0c1913] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c5ff58]/30 hover:bg-[#102019] hover:shadow-[0_24px_60px_-38px_rgba(197,255,88,0.4)] sm:p-6">
                <div aria-hidden="true" className={["absolute -right-10 -top-12 h-32 w-32 rounded-full blur-3xl", glow].join(" ")} />
                <div className="relative flex items-start justify-between"><div className={["flex h-12 w-12 items-center justify-center rounded-2xl border", iconTone].join(" ")}><Icon name={action.icon} size={22} /></div><span className="text-[10px] font-semibold tracking-wide text-[#72877a]">{action.eyebrow}</span></div>
                <h3 className="relative mt-6 text-lg font-semibold text-white">{action.title}</h3><p className="relative mt-2 min-h-[52px] text-sm leading-6 text-[#91a399]">{action.description}</p>
                <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-semibold text-[#c5ff58]"><span>{action.linkText}</span><span className="transition group-hover:translate-x-1"><Icon name="arrow" size={16} /></span></div>
                <span className="absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 bg-gradient-to-r from-[#c5ff58]/70 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>;
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col justify-between gap-5 rounded-[26px] border border-white/[0.09] bg-[#0c1913] p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9caf9f]">A good place to begin</p><h2 className="mt-2 text-xl font-semibold text-white">Bring one question to your study material.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#91a399]">Open a document, ask about a concept, and use the conversation to guide your next study session.</p></div><Link href="/documents#ai-tutor" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#c5ff58]/25 bg-[#c5ff58]/[0.08] px-5 py-3 text-sm font-semibold text-[#d9ff9a] transition hover:bg-[#c5ff58]/[0.15]">Ask your tutor <Icon name="arrow" size={16} /></Link></div>
          <Link href="/profile" className="group flex items-center gap-4 rounded-[26px] border border-white/[0.09] bg-[#0c1913] p-6 transition hover:border-white/20 sm:min-w-[260px]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-[#c5ff58]"><Icon name="user" size={22} /></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#82978b]">Your account</p><p className="mt-1 truncate text-sm font-semibold text-white">{name}</p></div><span className="text-[#82978b] transition group-hover:translate-x-1 group-hover:text-[#c5ff58]"><Icon name="arrow" size={16} /></span></Link>
        </section>
        <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] pt-6 text-center sm:flex-row sm:text-left"><p className="text-xs font-semibold text-[#a6b4aa]">LearnWeave <span className="text-[#c5ff58]">AI</span></p><p className="text-xs text-[#6f8376]">Learn at your pace · Grow your way</p></footer>
      </main>
    </div>
  );
}
