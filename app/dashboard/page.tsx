import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'
import CircleProgress from '@/components/CircleProgress'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const CATEGORIES = [
  { key: 'physical', label: 'Physical', emoji: '💪', color: '#10b981' },
  { key: 'spiritual', label: 'Spiritual', emoji: '🙏', color: '#8b5cf6' },
  { key: 'mental_emotional', label: 'Mental', emoji: '🧠', color: '#3b82f6' },
  { key: 'nutritional', label: 'Nutrition', emoji: '🥗', color: '#f59e0b' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await admin.from('users').select('*').eq('email', user.email).single()

  if (profile?.role === 'coach') return <CoachOverview coachId={profile.id} coachName={profile.name} />
  return <UserOverview profile={profile} />
}

async function CoachOverview({ coachId, coachName }: { coachId: string; coachName?: string }) {
  const { data: clients } = await admin
    .from('users').select('id, name, email, created_at').eq('coach_id', coachId).order('created_at', { ascending: false })

  const clientList = clients ?? []
  const monday = (() => {
    const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().split('T')[0]
  })()

  const clientStats = await Promise.all(clientList.map(async client => {
    const { data: habits } = await admin.from('habits').select('id').eq('user_id', client.id).eq('active', true)
    const { data: logs } = await admin.from('daily_logs').select('value_bool').eq('user_id', client.id).gte('date', monday)
    const total = (habits?.length ?? 0) * 7
    const done = logs?.filter(l => l.value_bool).length ?? 0
    const pct = total > 0 ? Math.round((done / total) * 100) : null
    return { ...client, habitCount: habits?.length ?? 0, weekPct: pct }
  }))

  const onTrack = clientStats.filter(c => c.weekPct !== null && c.weekPct >= 70).length
  const needsAttention = clientStats.filter(c => c.weekPct !== null && c.weekPct < 40).length

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>Coach Dashboard</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {coachName ? `Good ${getTimeOfDay()}, ${coachName.split(' ')[0]}` : 'Your Clients'} 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 stagger">
        {[
          { label: 'Active Clients', value: clientList.length, color: '#10b981' },
          { label: 'On Track This Week', value: onTrack, color: '#3b82f6' },
          { label: 'Need Attention', value: needsAttention, color: needsAttention > 0 ? '#ef4444' : '#10b981' },
        ].map(stat => (
          <div key={stat.label} className="card p-6 animate-fade-in-up">
            <p className="text-4xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Client list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Clients</h2>
          <Link href="/dashboard/clients" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            View all →
          </Link>
        </div>

        {clientList.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No clients yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Go to Clients to invite your first client.
            </p>
            <Link href="/dashboard/clients"
              className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: 'var(--accent)' }}>
              Invite a client
            </Link>
          </div>
        ) : (
          <div className="space-y-3 stagger">
            {clientStats.map(client => (
              <Link key={client.id} href={`/dashboard/clients/${client.id}`}
                className="card p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-all animate-fade-in-up block">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    {(client.name ?? client.email ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {client.name ?? client.email}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  {client.weekPct !== null ? (
                    <div className="flex items-center gap-3">
                      <CircleProgress pct={client.weekPct} size={40} stroke={4}
                        color={client.weekPct >= 70 ? '#10b981' : client.weekPct >= 40 ? '#f59e0b' : '#ef4444'} />
                      <div className="text-right">
                        <p className="text-sm font-semibold" style={{
                          color: client.weekPct >= 70 ? '#10b981' : client.weekPct >= 40 ? '#f59e0b' : '#ef4444'
                        }}>{client.weekPct}%</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>this week</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No data yet</span>
                  )}
                  <span style={{ color: 'var(--accent)' }} className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

async function UserOverview({ profile }: { profile: any }) {
  if (!profile || profile.onboarding_step !== 'complete') {
    return (
      <div className="card p-16 text-center animate-scale-in max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"
          style={{ background: 'var(--accent-soft)' }}>⚡</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Welcome to Luma!</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Connect the Telegram bot to start tracking your habits and goals.
        </p>
        <a href="https://t.me/lumacoachbot" target="_blank"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}>
          Open @lumacoachbot
        </a>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const monday = (() => {
    const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().split('T')[0]
  })()

  const [{ data: habits }, { data: logs }, { data: journal }] = await Promise.all([
    admin.from('habits').select('*').eq('user_id', profile.id).eq('active', true),
    admin.from('daily_logs').select('*').eq('user_id', profile.id).gte('date', monday),
    admin.from('journal_entries').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(3),
  ])

  const todayLogs = logs?.filter(l => l.date === today) ?? []
  const loggedIds = new Set(todayLogs.filter(l => l.value_bool).map(l => l.habit_id))
  const weekLogs = logs ?? []
  const allHabits = habits ?? []

  const byCategory = allHabits.reduce((acc, h) => {
    acc[h.category] = acc[h.category] ?? []; acc[h.category].push(h); return acc
  }, {} as Record<string, any[]>)

  const todayTotal = allHabits.filter(h => h.category !== 'notes_ideas').length
  const todayDone = todayLogs.filter(l => l.value_bool || l.value_number != null).length
  const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Good {getTimeOfDay()}, {profile.name?.split(' ')[0]} 👋
        </h1>
      </div>

      {/* Today overview */}
      <div className="grid grid-cols-3 gap-4 stagger">
        <div className="card p-6 col-span-1 flex flex-col items-center justify-center gap-2 animate-fade-in-up">
          <div className="relative">
            <CircleProgress pct={todayPct} size={80} stroke={7} color="#10b981" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{todayPct}%</span>
            </div>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Today</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{todayDone}/{todayTotal} habits</p>
        </div>

        <div className="card p-6 col-span-2 animate-fade-in-up">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>This Week by Area</p>
          <div className="space-y-3">
            {CATEGORIES.filter(cat => byCategory[cat.key]?.length > 0).map(cat => {
              const catHabits = byCategory[cat.key] ?? []
              const total = catHabits.length * 7
              const done = weekLogs.filter(l => catHabits.some((h: any) => h.id === l.habit_id) && l.value_bool).length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={cat.key} className="flex items-center gap-3">
                  <span className="text-base w-5">{cat.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cat.label}</span>
                      <span className="text-xs font-semibold" style={{ color: cat.color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Today's habits */}
      <div className="card animate-fade-in-up">
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Habits</h2>
            <Link href="/dashboard/habits" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {CATEGORIES.filter(cat => byCategory[cat.key]?.length > 0).map(cat => (
            <div key={cat.key}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                {cat.emoji} {cat.label}
              </p>
              <div className="space-y-2">
                {byCategory[cat.key].map((habit: any) => {
                  const logged = loggedIds.has(habit.id)
                  const numLog = todayLogs.find(l => l.habit_id === habit.id && l.value_number != null)
                  return (
                    <div key={habit.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                      style={{ background: logged || numLog ? `${cat.color}10` : 'var(--content-bg)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{habit.name}</span>
                      {logged ? (
                        <span className="text-xs font-semibold flex items-center gap-1" style={{ color: cat.color }}>
                          <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
                            style={{ background: cat.color }}>✓</span> Done
                        </span>
                      ) : numLog ? (
                        <span className="text-xs font-semibold" style={{ color: cat.color }}>
                          {numLog.value_number} {habit.unit}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Not logged</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent journal */}
      {journal && journal.length > 0 && (
        <div className="card animate-fade-in-up">
          <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Notes</h2>
            <Link href="/dashboard/journal" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>View all →</Link>
          </div>
          <div className="p-6 space-y-4">
            {journal.map(entry => (
              <div key={entry.id} className="flex gap-4">
                <div className="w-1 rounded-full shrink-0 mt-1" style={{ background: 'var(--accent)', minHeight: 40 }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}>
                      {entry.entry_type}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{entry.content}</p>
                </div>
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
