'use client'

import { useEffect, useState } from 'react'
import { Check, Pencil, Plus, X } from 'lucide-react'

const CATEGORIES = [
  { key: 'physical', label: 'Physical', emoji: '💪', color: '#10b981' },
  { key: 'spiritual', label: 'Spiritual', emoji: '🙏', color: '#8b5cf6' },
  { key: 'mental_emotional', label: 'Mental / Emotional', emoji: '🧠', color: '#3b82f6' },
  { key: 'nutritional', label: 'Nutritional', emoji: '🥗', color: '#f59e0b' },
  { key: 'notes_ideas', label: 'Notes & Ideas', emoji: '📝', color: '#6b7280' },
]

export default function GoalsView({ userId, readOnly = false }: { userId: string; readOnly?: boolean }) {
  const [goals, setGoals] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [adding, setAdding] = useState<string | null>(null)
  const [newText, setNewText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchGoals() }, [userId])

  async function fetchGoals() {
    setLoading(true)
    const res = await fetch(`/api/user-data?userId=${userId}&table=goals`)
    setGoals(await res.json() ?? [])
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

  async function addGoal(category: string) {
    if (!newText.trim()) return
    await fetch('/api/user-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'goals', record: { user_id: userId, category, goal_text: newText.trim() } }),
    })
    setAdding(null)
    setNewText('')
    fetchGoals()
  }

  async function deleteGoal(id: string) {
    await fetch('/api/user-data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'goals', id }),
    })
    fetchGoals()
  }

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="h-4 rounded-lg w-32 mb-4" style={{ background: 'var(--card-border)' }} />
          <div className="h-12 rounded-xl" style={{ background: 'var(--card-border)' }} />
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4 stagger">
      {CATEGORIES.map(cat => {
        const catGoals = goals.filter(g => g.category === cat.key)
        return (
          <div key={cat.key} className="card animate-fade-in-up overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--card-border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: `${cat.color}15` }}>
                {cat.emoji}
              </div>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{cat.label}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--content-bg)', color: 'var(--text-muted)' }}>
                {catGoals.length} goal{catGoals.length !== 1 ? 's' : ''}
              </span>
              {!readOnly && (
                <button
                  onClick={() => { setAdding(cat.key); setNewText('') }}
                  className="ml-auto flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: `${cat.color}15`, color: cat.color }}>
                  <Plus size={13} />
                  Add goal
                </button>
              )}
            </div>

            <div className="p-4 space-y-2">
              {adding === cat.key && (
                <div className="flex gap-2 mb-2">
                  <textarea
                    autoFocus
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addGoal(cat.key) } }}
                    placeholder="Type a new goal..."
                    rows={2}
                    className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                    style={{
                      background: 'var(--content-bg)',
                      border: `1.5px solid ${cat.color}`,
                      color: 'var(--text-primary)',
                    }}
                  />
                  <div className="flex flex-col gap-1">
                    <button onClick={() => addGoal(cat.key)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90"
                      style={{ background: cat.color }}>
                      <Check size={15} />
                    </button>
                    <button onClick={() => setAdding(null)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ color: 'var(--text-muted)' }}>
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

              {catGoals.length === 0 && adding !== cat.key ? (
                <p className="text-sm px-2 py-3" style={{ color: 'var(--text-muted)' }}>
                  {readOnly ? 'No goals set yet.' : 'No goals yet — add one above or tell Luma on Telegram!'}
                </p>
              ) : catGoals.map(goal => (
                <div key={goal.id} className="group">
                  {editing === goal.id ? (
                    <div className="flex gap-2">
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        rows={2}
                        className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                        style={{
                          background: 'var(--content-bg)',
                          border: `1.5px solid ${cat.color}`,
                          color: 'var(--text-primary)',
                        }}
                      />
                      <div className="flex flex-col gap-1">
                        <button onClick={() => saveGoal(goal.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90"
                          style={{ background: cat.color }}>
                          <Check size={15} />
                        </button>
                        <button onClick={() => setEditing(null)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5"
                          style={{ color: 'var(--text-muted)' }}>
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl transition-all hover:bg-black/3 dark:hover:bg-white/3 group">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: cat.color }} />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{goal.goal_text}</p>
                      </div>
                      {!readOnly && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
                          <button
                            onClick={() => { setEditing(goal.id); setEditText(goal.goal_text) }}
                            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                            style={{ color: 'var(--text-muted)' }}>
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                            style={{ color: 'var(--text-muted)' }}>
                            <X size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
