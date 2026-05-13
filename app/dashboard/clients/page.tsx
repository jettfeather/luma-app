'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [sending, setSending] = useState(false)
  const [coachEmail, setCoachEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return
    setCoachEmail(user.email)

    const [clientsRes, invitesRes] = await Promise.all([
      fetch(`/api/user-data?email=${user.email}&table=users&role=coach`),
      fetch(`/api/invites?coachEmail=${user.email}`),
    ])
    // Fetch clients via coach_id
    const profileRes = await fetch(`/api/create-profile?email=${user.email}`)
    const profile = await profileRes.json()
    if (profile?.id) {
      const res = await fetch(`/api/clients?coachId=${profile.id}`)
      const data = await res.json()
      setClients(data ?? [])
    }
    setInvites(await invitesRes.json() ?? [])
    setLoading(false)
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coachEmail, clientEmail: inviteEmail }),
    })
    const data = await res.json()
    if (data.token) {
      const link = `${window.location.origin}/login?invite=${data.token}&email=${encodeURIComponent(inviteEmail)}`
      setInviteLink(link)
      setInviteEmail('')
      fetchData()
    }
    setSending(false)
  }

  async function copyLink(token: string, email: string) {
    const link = `${window.location.origin}/login?invite=${token}&email=${encodeURIComponent(email)}`
    await navigator.clipboard.writeText(link)
    alert('Invite link copied!')
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Clients</h1>
        <p className="text-gray-500 text-sm mt-1">Invite clients by email and view their dashboards.</p>
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Invite a Client</h2>
        <form onSubmit={sendInvite} className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="client@email.com"
            required
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {sending ? 'Generating...' : 'Generate Link'}
          </button>
        </form>

        {inviteLink && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-medium text-emerald-700 mb-2">Invite link generated — share this with your client:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{inviteLink}</code>
              <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active clients */}
      {clients.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Active Clients ({clients.length})</h2>
          <div className="space-y-3">
            {clients.map(client => (
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
                    <p className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">{client.name ?? client.email}</p>
                    <p className="text-xs text-gray-400">{client.email}</p>
                  </div>
                </div>
                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pending invites */}
      {invites.filter(i => !i.accepted).length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Pending Invites</h2>
          <div className="space-y-2">
            {invites.filter(i => !i.accepted).map(invite => (
              <div key={invite.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">{invite.email}</p>
                  <p className="text-xs text-gray-400">Sent {new Date(invite.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => copyLink(invite.token, invite.email)}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Copy link
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {clients.length === 0 && invites.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center text-gray-400">
          <p>No clients yet. Invite one above.</p>
        </div>
      )}
    </div>
  )
}
