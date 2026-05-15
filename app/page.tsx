import Link from 'next/link'
import { Metadata } from 'next'
import RevealOnScroll from '@/components/RevealOnScroll'
import ScrollNav from '@/components/ScrollNav'

export const metadata: Metadata = {
  title: 'Luma — AI Life Coach & Habit Tracker',
  description: 'Luma is your AI life coach — track habits, set goals, journal your journey, and get coached with real data and analytics.',
}

const FEATURES = [
  {
    icon: '📊', color: '#10b981',
    title: 'Real-time Analytics',
    body: 'Habit streaks, weekly completion rates, and category breakdowns — all live.',
    wide: false,
  },
  {
    icon: '🤖', color: '#3b82f6',
    title: 'AI That Learns You',
    body: 'Every briefing is tailored to where you actually are — not a generic template.',
    wide: false,
  },
  {
    icon: '👥', color: '#ec4899',
    title: 'Shared Coach View',
    body: 'Your coach sees your dashboard in real-time. Edit goals together, like a shared Google Doc for your whole life.',
    wide: true,
  },
  {
    icon: '🔥', color: '#f59e0b',
    title: 'Streak Tracking',
    body: 'Build momentum with visual streaks across every habit and life area.',
    wide: false,
  },
  {
    icon: '💬', color: '#8b5cf6',
    title: 'Chat via Telegram',
    body: 'No apps to open. Just message Luma — log a workout, capture a thought, update a goal.',
    wide: false,
  },
]

const STEPS = [
  { num: '01', color: '#10b981', title: 'Create your account', body: 'Sign up as a user or coach in 30 seconds.' },
  { num: '02', color: '#3b82f6', title: 'Answer a few questions', body: 'Tell Luma your focus areas and habits. Your dashboard is built instantly.' },
  { num: '03', color: '#8b5cf6', title: 'Connect on Telegram', body: 'Luma checks in every morning and evening via @lumacoachbot.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#07070f', color: '#f0f0f8' }} className="min-h-screen overflow-x-hidden">
      <ScrollNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

        {/* Glowing orbs */}
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'float 10s ease-in-out infinite' }} />
        <div className="absolute pointer-events-none" style={{ top: '20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'floatReverse 13s ease-in-out infinite' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '40%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'float 16s ease-in-out infinite 2s' }} />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI-powered coaching, built for real life
            </div>

            <h1 className="font-black leading-none mb-6" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}>
              The coaching<br />
              platform that<br />
              <span style={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 40%, #818cf8 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                actually works.
              </span>
            </h1>

            <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: 'rgba(240,240,248,0.55)' }}>
              Daily AI check-ins, habit analytics, and a real-time coaching dashboard — so you and your coach always know exactly where you stand.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/login"
                className="px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 32px rgba(16,185,129,0.35)' }}>
                Start for free →
              </Link>
              <a href="#how"
                className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,240,248,0.8)' }}>
                See how it works
              </a>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { v: '4 areas', l: 'of your life' },
                { v: '2× daily', l: 'AI check-ins' },
                { v: '< 5 min', l: 'to set up' },
              ].map(s => (
                <div key={s.l} className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="font-bold" style={{ color: '#34d399' }}>{s.v}</span>
                  <span className="ml-1.5" style={{ color: 'rgba(240,240,248,0.4)' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product mockup */}
          <div className="relative hidden lg:block">
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)', filter: 'blur(20px)', transform: 'scale(1.1)' }} />

            <div className="relative rounded-3xl overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0d0d15' }}>
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="mx-auto rounded-full px-4 py-1 text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                  app.lumacoach.com/dashboard
                </div>
              </div>

              {/* Fake app UI */}
              <div className="flex" style={{ height: 380 }}>
                {/* Sidebar */}
                <div className="w-14 flex flex-col items-center pt-5 gap-4" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0d0d15' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" /></svg>
                  </div>
                  {['■','■','■','■'].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-xl" style={{ background: i === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)' }} />
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 overflow-hidden">
                  <p className="text-xs font-medium mb-1" style={{ color: '#34d399' }}>Thursday, May 15</p>
                  <p className="font-bold text-base mb-4" style={{ color: '#f0f0f8' }}>Good morning, Alex 👋</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { v: '73%', l: 'Today', c: '#10b981' },
                      { v: '🔥8', l: 'Streak', c: '#f59e0b' },
                      { v: '4/5', l: 'Habits', c: '#3b82f6' },
                    ].map(s => (
                      <div key={s.l} className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-sm font-bold" style={{ color: s.c }}>{s.v}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bars */}
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>This week</p>
                  {[
                    { label: '💪 Physical', pct: 85, color: '#10b981' },
                    { label: '🙏 Spiritual', pct: 71, color: '#8b5cf6' },
                    { label: '🧠 Mental', pct: 60, color: '#3b82f6' },
                  ].map(b => (
                    <div key={b.label} className="mb-2.5">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{b.label}</span>
                        <span className="text-[10px] font-bold" style={{ color: b.color }}>{b.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                      </div>
                    </div>
                  ))}

                  {/* Habits */}
                  <p className="text-[10px] font-semibold uppercase tracking-wider mt-3 mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Today's habits</p>
                  {[
                    { name: 'Morning workout', done: true },
                    { name: 'Drink 2L water', done: true },
                    { name: 'Evening journal', done: false },
                  ].map(h => (
                    <div key={h.name} className="flex items-center gap-2 mb-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: h.done ? '#10b981' : 'rgba(255,255,255,0.06)', border: h.done ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                        {h.done && <span className="text-white text-[8px] font-bold">✓</span>}
                      </div>
                      <span className="text-[11px]" style={{ color: h.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', textDecoration: h.done ? 'line-through' : 'none' }}>{h.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl px-4 py-3 shadow-2xl"
              style={{ background: '#1a1a2e', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 24px rgba(139,92,246,0.2)' }}>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Coach view 🔒</p>
              <p className="text-sm font-bold" style={{ color: '#f0f0f8' }}>Live client data</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how" style={{ background: '#0d0d16', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#34d399' }}>Simple by design</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>Up and running in minutes</h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(240,240,248,0.45)' }}>
              No complicated onboarding. Answer a few questions and your dashboard is ready.
            </p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <RevealOnScroll key={step.num} delay={i * 100}>
                <div className="relative rounded-3xl p-8 h-full transition-all duration-300 hover:-translate-y-1 group"
                  style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="absolute top-6 right-6 text-5xl font-black leading-none select-none"
                    style={{ color: `${step.color}15`, WebkitTextStroke: `1px ${step.color}25` }}>
                    {step.num}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${step.color}15` }}>
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: step.color, boxShadow: `0 0 10px ${step.color}80` }} />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: '#f0f0f8' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,248,0.45)' }}>{step.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features bento ───────────────────────────────────────────────── */}
      <section style={{ background: '#07070f' }} className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#818cf8' }}>Features</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>Everything in one place</h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(240,240,248,0.45)' }}>
              Habits, goals, journaling, and analytics — all connected and all live.
            </p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 70} className={f.wide ? 'md:col-span-2' : ''}>
                <div className="rounded-3xl p-7 h-full transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                  style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{ background: `radial-gradient(ellipse at top left, ${f.color}08 0%, transparent 60%)` }} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform group-hover:scale-110"
                      style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}>
                      {f.icon}
                    </div>
                    <h3 className="text-base font-bold mb-2" style={{ color: '#f0f0f8' }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,248,0.45)' }}>{f.body}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── For coaches ──────────────────────────────────────────────────── */}
      <section id="coaches" style={{ background: '#0d0d16', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#a78bfa' }}>For coaches</p>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                See your clients the way they see themselves
              </h2>
              <p className="leading-relaxed mb-8" style={{ color: 'rgba(240,240,248,0.5)' }}>
                When a client shares their Luma dashboard, you see everything — habits, goals, journal entries, streaks. Edit together in real-time, leave private session notes they never see.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  ['#10b981', 'Real-time shared dashboard access'],
                  ['#3b82f6', 'Edit goals and habits for clients directly'],
                  ['#8b5cf6', 'Private session notes only you see'],
                  ['#f59e0b', 'Client progress analytics at a glance'],
                ].map(([color, text]) => (
                  <li key={text} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(240,240,248,0.7)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${color}20` }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 0 28px rgba(139,92,246,0.35)' }}>
                Start coaching with Luma →
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={150}>
              {/* Coach invite card mockup */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
                  <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0d0d15' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Client dashboard — Alex Johnson</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Client header */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>A</div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#f0f0f8' }}>Alex Johnson</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>alex@example.com</p>
                      </div>
                      <div className="ml-auto text-xs font-bold" style={{ color: '#10b981' }}>78% this week</div>
                    </div>
                    {/* Bars */}
                    {[['💪 Physical','#10b981',85],['🙏 Spiritual','#8b5cf6',70],['🧠 Mental','#3b82f6',60]].map(([l,c,p]) => (
                      <div key={String(l)}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{String(l)}</span>
                          <span className="text-xs font-bold" style={{ color: String(c) }}>{String(p)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full" style={{ width: `${p}%`, background: String(c) }} />
                        </div>
                      </div>
                    ))}
                    {/* Session note */}
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#a78bfa' }}>📝 Private session note</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Great progress on morning routine. Focus next week on evening wind-down and sleep consistency...
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 rounded-2xl px-4 py-3"
                  style={{ background: '#1a1a2e', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 20px rgba(139,92,246,0.15)' }}>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Only you see this 🔒</p>
                  <p className="text-sm font-bold" style={{ color: '#f0f0f8' }}>Coach notes</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section style={{ background: '#07070f', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="py-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '4', label: 'Life areas tracked', color: '#10b981' },
            { value: '2×', label: 'Daily AI check-ins', color: '#3b82f6' },
            { value: '∞', label: 'Journal entries', color: '#8b5cf6' },
            { value: '100%', label: 'Yours to customize', color: '#f59e0b' },
          ].map((s, i) => (
            <RevealOnScroll key={s.label} delay={i * 80} className="text-center">
              <p className="text-5xl font-black mb-2" style={{ color: s.color, textShadow: `0 0 30px ${s.color}60` }}>{s.value}</p>
              <p className="text-sm" style={{ color: 'rgba(240,240,248,0.4)' }}>{s.label}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ background: '#0d0d16' }} className="py-28">
        <div className="max-w-4xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#60a5fa' }}>Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>Simple, honest pricing</h2>
            <p className="max-w-lg mx-auto" style={{ color: 'rgba(240,240,248,0.45)' }}>
              Whether you&apos;re growing solo or running a coaching practice.
            </p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                name: 'Individual', price: '$XX', period: '/mo',
                desc: 'For people serious about personal growth.',
                color: '#10b981', highlight: false,
                features: ['AI daily check-ins (morning + evening)', 'Habit & goal dashboard', 'Journal & notes library', 'Streak tracking', 'Bot tone & schedule customization'],
                cta: 'Start free',
              },
              {
                name: 'Coach', price: '$XX', period: '/mo',
                desc: 'For coaches who want a real edge.',
                color: '#8b5cf6', highlight: true,
                features: ['Everything in Individual', 'Unlimited client dashboards', 'Real-time shared client view', 'Private session notes', 'Client progress analytics', 'Invite clients by email'],
                cta: 'Start coaching',
              },
            ].map((plan, i) => (
              <RevealOnScroll key={plan.name} delay={i * 120}>
                <div className="relative rounded-3xl p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: plan.highlight ? '#13101e' : '#13131f',
                    border: `1px solid ${plan.highlight ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: plan.highlight ? '0 0 60px rgba(139,92,246,0.12)' : 'none',
                  }}>
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="text-xs font-bold px-4 py-1.5 rounded-full text-white"
                        style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                        Most popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-base font-bold mb-1" style={{ color: '#f0f0f8' }}>{plan.name}</h3>
                    <p className="text-sm" style={{ color: 'rgba(240,240,248,0.4)' }}>{plan.desc}</p>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-5xl font-black" style={{ color: '#f0f0f8' }}>{plan.price}</span>
                      <span className="text-sm" style={{ color: 'rgba(240,240,248,0.4)' }}>{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(240,240,248,0.65)' }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${plan.color}20` }}>
                          <span className="text-[9px] font-bold" style={{ color: plan.color }}>✓</span>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login"
                    className="block text-center py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
                    style={plan.highlight
                      ? { background: `linear-gradient(135deg, ${plan.color}, #6d28d9)`, color: 'white' }
                      : { background: `${plan.color}12`, color: plan.color, border: `1px solid ${plan.color}25` }
                    }>
                    {plan.cta} →
                  </Link>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ background: '#07070f' }} className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
        <RevealOnScroll className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Ready to start{' '}
            <span style={{
              background: 'linear-gradient(135deg, #10b981, #34d399 40%, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>growing?</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,240,248,0.45)' }}>
            Join Luma and get an AI coach that shows up every day — with the data to prove it&apos;s working.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-lg font-bold text-white transition-all hover:opacity-90 hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 50px rgba(16,185,129,0.4)' }}>
            Create your free account →
          </Link>
        </RevealOnScroll>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} className="py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" /></svg>
            </div>
            <span className="font-bold" style={{ color: '#f0f0f8' }}>Luma</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Luma. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>Sign in</Link>
            <a href="https://t.me/lumacoachbot" target="_blank" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
