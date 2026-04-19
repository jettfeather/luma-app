'use client'

import { useEffect, useState } from 'react'

const CATEGORIES = [
  { key: 'physical', label: 'Physical', emoji: '💪' },
  { key: 'spiritual', label: 'Spiritual', emoji: '🙏' },
  { key: 'mental_emotional', label: 'Mental / Emotional', emoji: '🧠' },
  { key: 'nutritional', label: 'Nutritional', emoji: '🥗' },
  { key: 'notes_ideas', label: 'Notes & Ideas', emoji: '📝' },
]

export default function GoalsView({ userId, readOnly = false }: { userId: string; readOnly?: boolean }) {
  const [goals, setGoals] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchGoals() }, [userId])

  async function fetchGoals() {
    setLoading(true)
    const res = await fetch(`/api/user-data?userId=${userId}&table=goals`)
    const data = await res.json()
    setGoals(data ?? [])
    setLoading(false)
  }

  async function saveGoal(id: string) {
    await fetch('/api/user-data', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'goals', id, updates: { goal_text: editText } }),
    })
    setEditing(null)
    fetchGoals()
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      {CATEGORIES.map(cat => {
        const catGoals = goals.filter(g => g.category === cat.key)
        return (
          <div key={cat.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">{cat.emoji} {cat.label}</h2>
            {catGoals.length === 0 ? (
              <p className="text-sm text-gray-400">No goals set yet. Tell Luma on Telegram!</p>
            ) : (
              <div className="space-y-3">
                {catGoals.map(goal => (
                  <div key={goal.id}>
                    {editing === goal.id ? (
                      <div className="flex gap-2">
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="flex-1 border border-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          rows={2}
                        />
                        <div className="flex flex-col gap-1">
                          <button onClick={() => saveGoal(goal.id)} className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700">Save</button>
                          <button onClick={() => setEditing(null)} className="text-gray-400 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between group">
                        <p className="text-sm text-gray-700">{goal.goal_text}</p>
                        {!readOnly && (
                          <button
                            onClick={() => { setEditing(goal.id); setEditText(goal.goal_text) }}
                            className="ml-3 text-xs text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
