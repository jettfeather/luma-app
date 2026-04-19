'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const TYPES = ['All', 'Journal', 'Thought', 'Letter', 'Prayer', 'Idea', 'Note']

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { fetchEntries() }, [])

  async function fetchEntries() {
    const { data: { user } } = await supabase.auth.getUser()
    const res = await fetch(`/api/user-data?email=${user?.email}&table=journal_entries`)
    const data = await res.json()
    setEntries(data ?? [])
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

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Journal & Notes</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === t ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No entries yet.</p>
          <p className="text-sm mt-1">Tell Luma on Telegram to capture something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{entry.entry_type}</span>
                  <span className="text-xs text-gray-400 ml-2">{new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <button
                  onClick={() => { setEditing(entry.id); setEditContent(entry.content) }}
                  className="text-xs text-gray-300 hover:text-emerald-500 transition-colors"
                >
                  Edit
                </button>
              </div>

              {entry.title && <p className="font-medium text-gray-900 mb-2">{entry.title}</p>}

              {editing === entry.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEntry(entry.id)} className="bg-emerald-600 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-emerald-700">Save</button>
                    <button onClick={() => setEditing(null)} className="text-gray-400 text-xs px-4 py-1.5 rounded-lg hover:bg-gray-100">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{entry.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
