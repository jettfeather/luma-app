import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Luma — Track Goals, Build Habits, Grow with AI",
  description: "Luma is your AI life coach — track habits, set goals, journal your journey, and get coached with real data and analytics. For individuals and coaches.",
}

const FEATURES = [
  {
    icon: "📊",
    title: "Real Analytics, Not Guesswork",
    body: "See streaks, completion rates, and trends across every area of your life — physical, mental, spiritual, and nutritional.",
  },
  {
    icon: "🤖",
    title: "AI That Knows You",
    body: "Luma learns your habits, goals, and patterns over time. Every morning briefing and evening review is personalized to where you actually are.",
  },
  {
    icon: "💬",
    title: "Log Anything via Telegram",
    body: "No app to open. Just message Luma like a friend. Log a workout, capture a thought, update a goal — it all flows into your dashboard automatically.",
  },
  {
    icon: "🎯",
    title: "Goal Tracking Across Life Areas",
    body: "Set and track goals in every pillar of your life. Your coach and your AI see the same data so nothing falls through the cracks.",
  },
  {
    icon: "📓",
    title: "Journal, Ideas & Letters",
    body: "Capture thoughts, prayers, ideas, and reflections. Everything is searchable, filterable, and editable from your dashboard.",
  },
  {
    icon: "👥",
    title: "Shared Coach Access",
    body: "Your coach sees your dashboard in real-time — the same data, the same view. Like a shared Google Doc, but for your whole life.",
  },
]

const STEPS = [
  { step: "01", title: "Sign up & connect Telegram", body: "Create your account, link the Luma bot, and go through a short AI onboarding that sets up your goals and habits." },
  { step: "02", title: "Log your day naturally", body: "Message Luma on Telegram to log habits, capture thoughts, or update goals. No forms. No friction." },
  { step: "03", title: "Review your progress", body: "Open your dashboard to see analytics, streaks, journal entries, and insights — and share it with your coach." },
]

const PLANS = [
  {
    name: "Individual",
    price: "$XX",
    per: "/ month",
    description: "For people serious about personal growth.",
    features: ["AI-powered daily check-ins", "Habit & goal tracking dashboard", "Journal & notes library", "Weekly progress analytics", "Telegram bot access"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Coach",
    price: "$XX",
    per: "/ month",
    description: "For coaches who want to level up their clients.",
    features: ["Everything in Individual", "Unlimited client dashboards", "Real-time shared client view", "Coach notes & annotations", "Client progress overview"],
    cta: "Start Coaching",
    highlight: true,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">Luma</span>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 hidden sm:block">How it works</a>
            <a href="#for-coaches" className="text-sm text-gray-500 hover:text-gray-900 hidden sm:block">For coaches</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 hidden sm:block">Pricing</a>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/login" className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          AI-powered coaching, built for real life
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
          Track your goals.<br />
          <span className="text-emerald-600">Measure your growth.</span><br />
          Coached by AI.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Luma combines daily AI check-ins, habit analytics, and a shared coaching dashboard — so you and your coach always know exactly where you stand.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-emerald-700 transition-colors">
            Start for free
          </Link>
          <a href="#how-it-works" className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl text-base font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors">
            See how it works
          </a>
        </div>
      </section>

      {/* Dashboard preview placeholder */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3">📈</div>
            <p className="text-emerald-600 font-medium">Dashboard preview</p>
            <p className="text-sm text-emerald-400 mt-1">Coming soon</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple by design</h2>
            <p className="text-gray-500 max-w-xl mx-auto">No complicated apps. No habit of building a new habit. Luma fits into how you already communicate.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.step} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="text-3xl font-bold text-emerald-100 mb-4">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything in one place</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Luma brings together habits, goals, journaling, and analytics so nothing gets siloed.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For coaches */}
      <section id="for-coaches" className="bg-emerald-600 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                For coaches
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                See your clients exactly as they see themselves
              </h2>
              <p className="text-emerald-100 leading-relaxed mb-8">
                When a client shares their Luma dashboard, you see everything they see — habits, goals, journal entries, streaks. Edit together in real-time, like a shared Google Doc for their whole life.
              </p>
              <ul className="space-y-3">
                {["Real-time client dashboard access", "Edit goals and notes alongside your client", "Track all clients from one coach view", "AI handles daily check-ins between sessions"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-emerald-50 text-sm">
                    <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="inline-block mt-10 bg-white text-emerald-700 font-medium px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
                Start coaching with Luma
              </Link>
            </div>
            <div className="bg-emerald-500/40 rounded-3xl h-72 flex items-center justify-center border border-emerald-400/30">
              <div className="text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-emerald-100 font-medium">Coach dashboard preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple pricing</h2>
            <p className="text-gray-500">Whether you're growing on your own or scaling a coaching practice.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.highlight ? 'border-emerald-500 shadow-lg shadow-emerald-100' : 'border-gray-200'}`}>
                {plan.highlight && (
                  <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-4">Most popular</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400">{plan.per}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block text-center py-3 rounded-xl font-medium transition-colors ${plan.highlight ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start growing?</h2>
          <p className="text-gray-500 mb-8">Join Luma and get an AI coach that shows up every day — with the data to prove it's working.</p>
          <Link href="/login" className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-emerald-700 transition-colors inline-block">
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-emerald-600">Luma</span>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Luma. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600">Sign in</Link>
            <a href="https://t.me/lumacoachbot" target="_blank" className="text-xs text-gray-400 hover:text-gray-600">Telegram</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
