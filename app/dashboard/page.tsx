import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  physical: { label: 'Physical', emoji: '💪' },
  spiritual: { label: 'Spiritual', emoji: '🙏' },
  mental_emotional: { label: 'Mental / Emotional', emoji: '🧠' },
  nutritional: { label: 'Nutritional', emoji: '🥗' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await admin
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single()

  if (profile?.role === 'coach') {
    return <CoachOverview coachId={profile.id} coachName={profile.name} />
  }

  return <UserOverview profile={profile} />
}

// ─── Coach Overview ───────────────────────────────────────────────────────────

async function CoachOverview({ coachId, coachName }: { coachId: string; coachName?: string }) {
  const { data: clients } = await admin
    .from('users')
    .select('id, name, email, created_at')
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false })

  const clientList = clients ?? []

  // Fetch habit completion for each client this week
  const monday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    return d.toISOString().split('T')[0]
  })()

  const clientStats = await Promise.all(
    clientList.map(async client => {
      const { data: habits } = await admin.from('habits').select('id').eq('user_id', client.id).eq('active', true)
      const { data: logs } = await admin.from('daily_logs').select('value_bool').eq('user_id', client.id).gte('date', monday)
      const total = (habits?.length ?? 0) * 7
      const done = logs?.filter(l => l.value_bool).length ?? 0
      const pct = total > 0 ? Math.round((done / total) * 100) : null
      return { ...client, habitCount: habits?.length ?? 0, weekPct: pct }
    })
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {coachName ? `Welcome back, ${coachName.split(' ')[0]}` : 'Coach Dashboard'} 🏆
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-emerald-600">{clientList.length}</p>
          <p className="text-sm text-gray-500 mt-1">Active Clients</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-emerald-600">
            {clientStats.filter(c => c.weekPct !== null && c.weekPct >= 70).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">On Track This Week</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-emerald-600">
            {clientStats.filter(c => c.weekPct !== null && c.weekPct < 40).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Need Attention</p>
        </div>
      </div>

      {/* Client list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Your Clients</h2>
          <Link href="/dashboard/clients" className="text-sm text-emerald-600 hover:underline">View all</Link>
        </div>

        {clientList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center text-gray-400">
            <p className="text-lg mb-2">No clients yet</p>
            <p className="text-sm">Clients are linked to you when they complete Luma onboarding on Telegram.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientStats.map(client => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold">
                    {(client.name ?? client.email ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {client.name ?? client.email}
                    </p>
                    <p className="text-xs text-gray-400">{client.email} · {client.habitCount} habits</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {client.weekPct !== null ? (
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${client.weekPct >= 70 ? 'text-emerald-600' : client.weekPct >= 40 ? 'text-yellow-500' : 'text-red-400'}`}>
                        {client.weekPct}%
                      </p>
                      <p className="text-xs text-gray-400">this week</p>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">No data</span>
                  )}
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── User Overview ────────────────────────────────────────────────────────────

async function UserOverview({ profile }: { profile: any }) {
  if (!profile || profile.onboarding_step !== 'complete') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Welcome to Luma!</h2>
        <p className="text-gray-500 mt-2">
          Start your onboarding by messaging{' '}
          <a href="https://t.me/lumacoachbot" className="text-emerald-600 font-medium underline" target="_blank">
            @lumacoachbot
          </a>{' '}
          on Telegram first.
        </p>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const monday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    return d.toISOString().split('T')[0]
  })()

  const { data: habits } = await admin.from('habits').select('*').eq('user_id', profile.id).eq('active', true)
  const { data: logs } = await admin.from('daily_logs').select('*').eq('user_id', profile.id).gte('date', monday)
  const { data: journal } = await admin.from('journal_entries').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(3)

  const todayLogs = logs?.filter(l => l.date === today) ?? []
  const loggedIds = new Set(todayLogs.filter(l => l.value_bool).map(l => l.habit_id))
  const weekLogs = logs ?? []

  const byCategory = (habits ?? []).reduce((acc, h) => {
    acc[h.category] = acc[h.category] ?? []
    acc[h.category].push(h)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good {getTimeOfDay()}, {profile.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Today's Habits</h2>
        {Object.entries(byCategory).filter(([cat]) => cat !== 'notes_ideas').map(([cat, catHabits]) => (
          <div key={cat} className="mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              {CATEGORY_LABELS[cat]?.emoji} {CATEGORY_LABELS[cat]?.label}
            </p>
            <div className="space-y-2">
              {(catHabits as any[]).map(habit => {
                const logged = loggedIds.has(habit.id)
                const numberLog = todayLogs.find(l => l.habit_id === habit.id && l.value_number != null)
                return (
                  <div key={habit.id} className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${logged || numberLog ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                    <span className="text-sm text-gray-800">{habit.name}</span>
                    {logged ? (
                      <span className="text-emerald-600 text-sm font-medium">✓ Done</span>
                    ) : numberLog ? (
                      <span className="text-emerald-600 text-sm font-medium">{numberLog.value_number} {habit.unit}</span>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">This Week</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(byCategory).filter(([cat]) => cat !== 'notes_ideas').map(([cat, catHabits]) => {
            const total = (catHabits as any[]).length * 7
            const done = weekLogs.filter(l => (catHabits as any[]).some(h => h.id === l.habit_id) && l.value_bool).length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            return (
              <div key={cat} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">{CATEGORY_LABELS[cat]?.emoji} {CATEGORY_LABELS[cat]?.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pct}%</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {journal && journal.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Recent Notes</h2>
            <Link href="/dashboard/journal" className="text-sm text-emerald-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {journal.map(entry => (
              <div key={entry.id} className="border-l-2 border-emerald-200 pl-4 py-1">
                <p className="text-xs text-gray-400">{entry.entry_type} · {new Date(entry.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 mt-0.5 line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
