import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  physical: { label: 'Physical', emoji: '💪' },
  spiritual: { label: 'Spiritual', emoji: '🙏' },
  mental_emotional: { label: 'Mental / Emotional', emoji: '🧠' },
  nutritional: { label: 'Nutritional', emoji: '🥗' },
  notes_ideas: { label: 'Notes & Ideas', emoji: '📝' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const service = createServiceClient(SUPABASE_URL, SERVICE_KEY)

  // Get user profile from our users table
  const { data: profile } = await service
    .from('users')
    .select('*')
    .eq('email', user!.email)
    .single()

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

  // Get today's logs
  const today = new Date().toISOString().split('T')[0]
  const monday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay() + 1)
    return d.toISOString().split('T')[0]
  })()

  const { data: habits } = await service.from('habits').select('*').eq('user_id', profile.id).eq('active', true)
  const { data: logs } = await service.from('daily_logs').select('*').eq('user_id', profile.id).gte('date', monday)
  const { data: goals } = await service.from('goals').select('*').eq('user_id', profile.id)
  const { data: journal } = await service.from('journal_entries').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(3)

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

      {/* Today's habits */}
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

      {/* This week summary */}
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

      {/* Recent journal */}
      {journal && journal.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Recent Notes</h2>
            <a href="/dashboard/journal" className="text-sm text-emerald-600 hover:underline">View all</a>
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
