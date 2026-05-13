'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const AREAS = [
  { key: 'physical', label: 'Physical', emoji: '💪' },
  { key: 'spiritual', label: 'Spiritual', emoji: '🙏' },
  { key: 'mental_emotional', label: 'Mental / Emotional', emoji: '🧠' },
  { key: 'nutritional', label: 'Nutritional', emoji: '🥗' },
]

const TONES = [
  { key: 'motivational', label: 'Motivational', desc: 'Energetic, push-oriented, hype you up' },
  { key: 'gentle', label: 'Gentle', desc: 'Soft, encouraging, no pressure' },
  { key: 'strict', label: 'Strict', desc: 'Direct, no excuses, hold you accountable' },
]

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [morningTime, setMorningTime] = useState('07:00')
  const [eveningTime, setEveningTime] = useState('20:00')
  const [tone, setTone] = useState('motivational')
  const [areas, setAreas] = useState<string[]>(['physical', 'spiritual', 'mental_emotional', 'nutritional'])
  const [coachEmail, setCoachEmail] = useState('')
  const [connectingCoach, setConnectingCoach] = useState(false)
  const [coachConnected, setCoachConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const res = await fetch(`/api/settings?email=${user.email}`)
    const data = await res.json()
    if (data) {
      setProfile(data)
      setMorningTime(data.bot_morning_time ?? '07:00')
      setEveningTime(data.bot_evening_time ?? '20:00')
      setTone(data.bot_tone ?? 'motivational')
      setAreas(data.bot_areas ?? ['physical', 'spiritual', 'mental_emotional', 'nutritional'])
      if (data.coach_id) setCoachConnected(true)
    }
  }

  async function saveSettings() {
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: profile.id,
        bot_morning_time: morningTime,
        bot_evening_time: eveningTime,
        bot_tone: tone,
        bot_areas: areas,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function connectToCoach(e: React.FormEvent) {
    e.preventDefault()
    setConnectingCoach(true)
    const res = await fetch('/api/settings/connect-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profile.id, coachEmail }),
    })
    const data = await res.json()
    if (data.ok) { setCoachConnected(true); fetchProfile() }
    else alert(data.error ?? 'Coach not found. Make sure the email is correct.')
    setConnectingCoach(false)
  }

  function toggleArea(key: string) {
    setAreas(prev =>
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    )
  }

  if (!profile) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Customize how Luma shows up for you.</p>
      </div>

      {/* Bot message times */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <h2 className="font-semibold text-gray-900">Daily Check-in Times</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Morning briefing</label>
            <input
              type="time"
              value={morningTime}
              onChange={e => setMorningTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evening review</label>
            <input
              type="time"
              value={eveningTime}
              onChange={e => setEveningTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Life areas */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Life Areas to Track</h2>
        <div className="grid grid-cols-2 gap-3">
          {AREAS.map(area => (
            <button
              key={area.key}
              type="button"
              onClick={() => toggleArea(area.key)}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                areas.includes(area.key)
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{area.emoji}</span>
              <span className="ml-2">{area.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Coaching Tone</h2>
        <div className="space-y-3">
          {TONES.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTone(t.key)}
              className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${
                tone === t.key
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-sm font-medium ${tone === t.key ? 'text-emerald-700' : 'text-gray-900'}`}>{t.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={saveSettings}
        disabled={saving}
        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
      </button>

      {/* Connect to coach — only for non-coach users without a coach */}
      {profile.role !== 'coach' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Connect to a Coach</h2>
          {coachConnected ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-xs">✓</span>
              You're connected to a coach. They can see your dashboard.
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">Have a Luma coach? Enter their email to share your dashboard with them.</p>
              <form onSubmit={connectToCoach} className="flex gap-3">
                <input
                  type="email"
                  value={coachEmail}
                  onChange={e => setCoachEmail(e.target.value)}
                  placeholder="coach@email.com"
                  required
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={connectingCoach}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {connectingCoach ? '...' : 'Connect'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
