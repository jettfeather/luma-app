'use client'

import { useEffect, useState } from 'react'
import CircleProgress from './CircleProgress'

const CATEGORIES: Record<string, { label: string; emoji: string; color: string }> = {
  physical: { label: 'Physical', emoji: '💪', color: '#10b981' },
  spiritual: { label: 'Spiritual', emoji: '🙏', color: '#8b5cf6' },
  mental_emotional: { label: 'Mental / Emotional', emoji: '🧠', color: '#3b82f6' },
  nutritional: { label: 'Nutritional', emoji: '🥗', color: '#f59e0b' },
}

function getStreak(logs: any[], habitId: string): number {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const log = logs.find(l => l.habit_id === habitId && l.date === dateStr)
    if (log?.value_bool || log?.value_number != null) {
      streak++
    } else if (i === 0) {
      continue // today not logged yet is ok
    } else {
      break
    }
  }
  return streak
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

  const today = new Date().toISOString().split('T')[0]

  const byCategory = habits.reduce((acc: Record<string, any[]>, h) => {
    acc[h.category] = acc[h.category] ?? []; acc[h.category].push(h); return acc
  }, {} as Record<string, any[]>)

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="h-4 rounded-lg w-32 mb-4" style={{ background: 'var(--card-border)' }} />
          <div className="space-y-3">
            {[1, 2].map(j => <div key={j} className="h-12 rounded-xl" style={{ background: 'var(--card-border)' }} />)}
          </div>
        </div>
      ))}
    </div>
  )

  if (habits.length === 0) return (
    <div className="card p-12 text-center">
      <div className="text-4xl mb-3">🔥</div>
      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No habits yet</p>
      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
        Set up habits by messaging Luma on Telegram.
      </p>
    </div>
  )

  return (
    <div className="space-y-6 stagger">
      {Object.entries(byCategory).map(([cat, catHabits]) => {
        const { label, emoji, color } = CATEGORIES[cat] ?? { label: cat, emoji: '📌', color: '#10b981' }
        const weekDone = catHabits.filter(h =>
          days.some(d => logs.find(l => l.habit_id === h.id && l.date === d && (l.value_bool || l.value_number != null)))
        ).length
        const weekPct = catHabits.length > 0 ? Math.round((weekDone / (catHabits.length * 7)) * 100) : 0

        return (
          <div key={cat} className="card animate-fade-in-up overflow-hidden">
            {/* Category header */}
            <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--card-border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${color}15` }}>
                  {emoji}
                </div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color }}>{weekPct}%</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>this week</span>
              </div>
            </div>

            {/* Day headers */}
            <div className="px-6 pt-4 pb-1">
              <div className="grid gap-2" style={{ gridTemplateColumns: '1fr repeat(7, 36px)' }}>
                <div />
                {days.map(d => (
                  <div key={d} className="text-center">
                    <div className={`text-[11px] font-medium ${d === today ? 'text-emerald-500' : ''}`}
                      style={{ color: d === today ? color : 'var(--text-muted)' }}>
                      {new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                    </div>
                    {d === today && <div className="w-1 h-1 rounded-full mx-auto mt-0.5" style={{ background: color }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Habits */}
            <div className="px-6 pb-4 space-y-2">
              {(catHabits as any[]).map(habit => {
                const streak = getStreak(logs, habit.id)
                const completion = days.map(d => {
                  const log = logs.find(l => l.habit_id === habit.id && l.date === d)
                  if (!log) return null
                  if (habit.habit_type === 'checkbox') return log.value_bool ? 'done' : 'missed'
                  if (log.value_number != null) return 'number'
                  return null
                })

                return (
                  <div key={habit.id} className="grid gap-2 py-2 border-b last:border-0"
                    style={{ gridTemplateColumns: '1fr repeat(7, 36px)', borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{habit.name}</span>
                      {streak >= 2 && (
                        <span className="text-xs font-semibold shrink-0 flex items-center gap-0.5"
                          style={{ color: '#f59e0b' }}>
                          🔥{streak}
                        </span>
                      )}
                    </div>
                    {completion.map((status, i) => (
                      <div key={i} className="flex items-center justify-center">
                        {status === 'done' ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                            style={{ background: color }}>
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        ) : status === 'number' ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: `${color}20`, border: `1.5px solid ${color}` }}>
                            <span className="text-xs font-bold" style={{ color }}>#</span>
                          </div>
                        ) : status === 'missed' ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(239,68,68,0.1)' }}>
                            <span className="text-[10px]" style={{ color: '#ef4444' }}>✕</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full" style={{ background: 'var(--content-bg)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
