'use client'

import { useEffect, useState } from 'react'

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  physical: { label: 'Physical', emoji: '💪' },
  spiritual: { label: 'Spiritual', emoji: '🙏' },
  mental_emotional: { label: 'Mental / Emotional', emoji: '🧠' },
  nutritional: { label: 'Nutritional', emoji: '🥗' },
}

export default function HabitsView({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [userId])

  async function fetchData() {
    setLoading(true)
    const [habitsRes, logsRes] = await Promise.all([
      fetch(`/api/user-data?userId=${userId}&table=habits`),
      fetch(`/api/user-data?userId=${userId}&table=daily_logs&days=30`),
    ])
    setHabits(await habitsRes.json() ?? [])
    setLogs(await logsRes.json() ?? [])
    setLoading(false)
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const byCategory = habits.reduce((acc, h) => {
    acc[h.category] = acc[h.category] ?? []
    acc[h.category].push(h)
    return acc
  }, {} as Record<string, any[]>)

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  if (habits.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <p>No habits set up yet.</p>
      <p className="text-sm mt-1">Habits are created during Luma onboarding on Telegram.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {Object.entries(byCategory).map(([cat, catHabits]) => (
        <div key={cat} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">
            {CATEGORY_LABELS[cat]?.emoji} {CATEGORY_LABELS[cat]?.label}
          </h2>
          <div className="grid gap-1" style={{ gridTemplateColumns: '1fr repeat(7, 40px)' }}>
            <div />
            {days.map(d => (
              <div key={d} className="text-center text-xs text-gray-400">
                {new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
              </div>
            ))}
            {(catHabits as any[]).map(habit => {
              const completion = days.map(d => {
                const log = logs.find(l => l.habit_id === habit.id && l.date === d)
                if (!log) return null
                if (habit.habit_type === 'checkbox') return log.value_bool ? 'done' : 'missed'
                if (log.value_number != null) return 'number'
                return null
              })
              return (
                <>
                  <div key={`name-${habit.id}`} className="text-sm text-gray-700 self-center py-1">{habit.name}</div>
                  {completion.map((status, i) => (
                    <div key={i} className="flex items-center justify-center">
                      {status === 'done' ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      ) : status === 'number' ? (
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-xs">#</span>
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-100" />
                      )}
                    </div>
                  ))}
                </>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
