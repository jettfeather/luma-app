'use client'

import { useEffect, useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'

const TYPES = ['All', 'Journal', 'Thought', 'Letter', 'Prayer', 'Idea', 'Note']

const TYPE_COLORS: Record<string, string> = {
  Journal: '#10b981', Thought: '#3b82f6', Letter: '#8b5cf6',
  Prayer: '#f59e0b', Idea: '#ec4899', Note: '#6b7280',
}

export default function JournalView({ userId, readOnly = false }: { userId: string; readOnly?: boolean }) {
  const [entries, setEntries] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchEntries() }, [userId])

  async function fetchEntries() {
    setLoading(true)
    const res = await fetch(`/api/user-data?userId=${userId}&table=journal_entries`)
    setEntries(await res.json() ?? [])
    setLoading(false)
  }

  async function saveEntry(id: string) {
    await fetch('/api/user-data', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'journal_entries', id, updates: { content: editContent } }),
    })
    setEditing(null)
    fetchEntries()
  }

  const filtered = filter === 'All' ? entries : entries.filter(e => e.entry_type === filter)

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="flex gap-3 mb-3">
            <div className="h-5 w-16 rounded-full" style={{ background: 'var(--card-border)' }} />
            <div className="h-5 w-24 rounded-full" style={{ background: 'var(--card-border)' }} />
          </div>
          <div className="space-y-2">
            <div className="h-4 rounded-lg" style={{ background: 'var(--card-border)' }} />
            <div className="h-4 rounded-lg w-3/4" style={{ background: 'var(--card-border)' }} />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: filter === t ? (TYPE_COLORS[t] ?? '#10b981') : 'var(--card-bg)',
              color: filter === t ? 'white' : 'var(--text-secondary)',
              border: `1.5px solid ${filter === t ? (TYPE_COLORS[t] ?? '#10b981') : 'var(--card-border)'}`,
            }}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">📓</div>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No entries yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Tell Luma on Telegram to capture something!
          </p>
        </div>
      ) : (
        <div className="space-y-4 stagger">
          {filtered.map(entry => {
            const color = TYPE_COLORS[entry.entry_type] ?? '#10b981'
            return (
              <div key={entry.id} className="card animate-fade-in-up overflow-hidden">
                <div className="flex" style={{ borderLeft: `3px solid ${color}` }}>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: `${color}15`, color }}>
                          {entry.entry_type}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {!readOnly && editing !== entry.id && (
                        <button
                          onClick={() => { setEditing(entry.id); setEditContent(entry.content) }}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                          style={{ color: 'var(--text-muted)' }}>
                          <Pencil size={13} />
                        </button>
                      )}
                    </div>

                    {entry.title && (
                      <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{entry.title}</p>
                    )}

                    {editing === entry.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          rows={4}
                          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                          style={{
                            background: 'var(--content-bg)',
                            border: `1.5px solid ${color}`,
                            color: 'var(--text-primary)',
                          }}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => saveEntry(entry.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                            style={{ background: color }}>
                            <Check size={13} /> Save
                          </button>
                          <button onClick={() => setEditing(null)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ color: 'var(--text-muted)' }}>
                            <X size={13} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                        {entry.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
