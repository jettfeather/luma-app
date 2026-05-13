'use client'

import { useEffect, useState } from 'react'

export default function SessionNotes({ coachId, clientId }: { coachId: string; clientId: string }) {
  const [notes, setNotes] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchNotes() }, [coachId, clientId])

  async function fetchNotes() {
    const res = await fetch(`/api/session-notes?coachId=${coachId}&clientId=${clientId}`)
    setNotes(await res.json())
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    await fetch('/api/session-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coachId, clientId, content }),
    })
    setContent('')
    await fetchNotes()
    setSaving(false)
  }

  async function deleteNote(id: string) {
    await fetch(`/api/session-notes?id=${id}`, { method: 'DELETE' })
    fetchNotes()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-base">📝</span>
        <h2 className="font-semibold text-gray-900">Session Notes</h2>
        <span className="text-xs text-gray-400 ml-1">— only visible to you</span>
      </div>

      <div className="p-6 space-y-4">
        <form onSubmit={addNote} className="space-y-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a note from today's session..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
          <button
            type="submit"
            disabled={saving || !content.trim()}
            className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Saving...' : 'Add Note'}
          </button>
        </form>

        {notes.length > 0 && (
          <div className="space-y-3 pt-2">
            {notes.map(note => (
              <div key={note.id} className="border-l-2 border-emerald-200 pl-4 py-1 group relative">
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-0 right-0 text-xs text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {notes.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No session notes yet.</p>
        )}
      </div>
    </div>
  )
}
