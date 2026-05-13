'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, Plus, X } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const AREAS = [
  { key: 'physical',         label: 'Physical',           emoji: '💪', color: '#10b981', desc: 'Fitness, movement & body' },
  { key: 'spiritual',        label: 'Spiritual',           emoji: '🙏', color: '#8b5cf6', desc: 'Mindfulness, faith & purpose' },
  { key: 'mental_emotional', label: 'Mental / Emotional',  emoji: '🧠', color: '#3b82f6', desc: 'Focus, clarity & wellbeing' },
  { key: 'nutritional',      label: 'Nutritional',         emoji: '🥗', color: '#f59e0b', desc: 'Diet, hydration & fuel' },
]

const PRESET_HABITS: Record<string, string[]> = {
  physical:         ['Morning workout', 'Walk 10,000 steps', 'Stretch / yoga', 'Cold shower', 'Sleep 8 hours'],
  spiritual:        ['Morning meditation', 'Gratitude journaling', 'Prayer / reflection', 'Read 20 min', 'Digital detox hour'],
  mental_emotional: ['No-phone morning', 'Journaling', 'Read a book', 'Therapy / check-in', 'Screen-free hour before bed'],
  nutritional:      ['Drink 2L water', 'No added sugar', 'Eat vegetables', 'No alcohol', 'Meal prep Sunday'],
}

const TONES = [
  { key: 'motivational', label: 'Motivational', emoji: '🔥', desc: 'High energy, celebrate every win' },
  { key: 'gentle',       label: 'Gentle',       emoji: '🌱', desc: 'Kind, encouraging, compassionate' },
  { key: 'strict',       label: 'Strict',       emoji: '⚡', desc: 'Direct, no excuses, results-first' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [role, setRole]         = useState<string | null>(null)
  const [userId, setUserId]     = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)
  const [step, setStep]         = useState(0)
  const [saving, setSaving]     = useState(false)
  const router                  = useRouter()
  const supabase                = createClient()

  // Form state
  const [name, setName]             = useState('')
  const [areas, setAreas]           = useState<string[]>([])
  const [habits, setHabits]         = useState<Record<string, string[]>>({})
  const [customInput, setCustom]    = useState<Record<string, string>>({})
  const [tone, setTone]             = useState('motivational')
  const [morningTime, setMorning]   = useState('07:00')
  const [eveningTime, setEvening]   = useState('20:00')

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const res  = await fetch(`/api/create-profile?email=${user.email}`)
      const data = await res.json()
      setRole(data?.role ?? 'user')
      setUserId(data?.id ?? null)
      if (data?.name) setName(data.name)
      setLoading(false)
    }
    init()
  }, [])

  // ── helpers ──
  function toggleArea(key: string) {
    setAreas(prev =>
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    )
  }

  function toggleHabit(area: string, habit: string) {
    setHabits(prev => {
      const current = prev[area] ?? []
      return {
        ...prev,
        [area]: current.includes(habit) ? current.filter(h => h !== habit) : [...current, habit],
      }
    })
  }

  function addCustom(area: string) {
    const text = (customInput[area] ?? '').trim()
    if (!text) return
    setHabits(prev => ({ ...prev, [area]: [...(prev[area] ?? []), text] }))
    setCustom(prev => ({ ...prev, [area]: '' }))
  }

  function removeHabit(area: string, habit: string) {
    setHabits(prev => ({ ...prev, [area]: (prev[area] ?? []).filter(h => h !== habit) }))
  }

  // ── total steps (coaches skip to name only) ──
  const totalSteps = role === 'coach' ? 1 : 5

  // ── finish ──
  async function finish() {
    if (!userId) return
    setSaving(true)

    const updates: Record<string, any> = {
      id: userId,
      name: name.trim() || undefined,
      onboarding_step: 'complete',
    }

    if (role !== 'coach') {
      updates.bot_areas     = areas
      updates.bot_tone      = tone
      updates.bot_morning_time = morningTime
      updates.bot_evening_time = eveningTime
    }

    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    // Create habits for users
    if (role !== 'coach') {
      const habitRecords = areas.flatMap(area =>
        (habits[area] ?? []).map(h => ({
          user_id: userId,
          category: area,
          name: h,
          habit_type: 'checkbox',
          active: true,
        }))
      )
      if (habitRecords.length > 0) {
        await fetch('/api/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'habits', records: habitRecords }),
        })
      }
    }

    router.push('/dashboard')
  }

  function next() {
    if (step < totalSteps - 1) setStep(s => s + 1)
    else finish()
  }

  function canProceed() {
    if (step === 0) return name.trim().length >= 2
    if (step === 1) return areas.length > 0
    if (step === 2) return areas.every(a => (habits[a] ?? []).length > 0)
    return true
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--content-bg)' }}>
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'var(--content-bg)' }}>

      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="transition-all duration-300"
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i <= step ? '#10b981' : 'var(--card-border)',
            }} />
        ))}
      </div>

      <div className="card w-full max-w-lg p-8 animate-scale-in">

        {/* ── Step 0: Name ── */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>
                {role === 'coach' ? 'Coach setup' : 'Step 1 of 5'}
              </p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {role === 'coach' ? 'Welcome, Coach! 🏆' : 'First, what\'s your name? 👋'}
              </h1>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                {role === 'coach'
                  ? 'What should your clients see as your display name?'
                  : 'Luma will use this to personalise your daily check-ins.'}
              </p>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canProceed() && next()}
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
              style={{
                background: 'var(--content-bg)',
                border: '1.5px solid var(--card-border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        )}

        {/* ── Step 1: Areas (user only) ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>Step 2 of 5</p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Which areas do you want to level up? ✨
              </h1>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Pick everything that matters to you. You can adjust later.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AREAS.map(area => {
                const active = areas.includes(area.key)
                return (
                  <button key={area.key} onClick={() => toggleArea(area.key)}
                    className="relative p-4 rounded-2xl text-left transition-all border-2"
                    style={{
                      background: active ? `${area.color}10` : 'var(--content-bg)',
                      borderColor: active ? area.color : 'var(--card-border)',
                    }}>
                    {active && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: area.color }}>
                        <Check size={11} color="white" />
                      </div>
                    )}
                    <div className="text-2xl mb-2">{area.emoji}</div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{area.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{area.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Habits (user only) ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>Step 3 of 5</p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Pick your habits 🎯
              </h1>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Select or add the daily habits you want Luma to track.
              </p>
            </div>
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1">
              {areas.map(areaKey => {
                const area     = AREAS.find(a => a.key === areaKey)!
                const selected = habits[areaKey] ?? []
                const presets  = PRESET_HABITS[areaKey] ?? []
                return (
                  <div key={areaKey}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">{area.emoji}</span>
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{area.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {presets.map(h => {
                        const on = selected.includes(h)
                        return (
                          <button key={h} onClick={() => toggleHabit(areaKey, h)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all border"
                            style={{
                              background: on ? `${area.color}15` : 'var(--content-bg)',
                              borderColor: on ? area.color : 'var(--card-border)',
                              color: on ? area.color : 'var(--text-secondary)',
                            }}>
                            {on && <span className="mr-1">✓</span>}{h}
                          </button>
                        )
                      })}
                      {/* custom habits added */}
                      {selected.filter(h => !presets.includes(h)).map(h => (
                        <span key={h} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border"
                          style={{ background: `${area.color}15`, borderColor: area.color, color: area.color }}>
                          {h}
                          <button onClick={() => removeHabit(areaKey, h)} className="hover:opacity-70">
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                    {/* custom input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom habit…"
                        value={customInput[areaKey] ?? ''}
                        onChange={e => setCustom(prev => ({ ...prev, [areaKey]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addCustom(areaKey)}
                        className="flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all"
                        style={{
                          background: 'var(--content-bg)',
                          border: '1px solid var(--card-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <button onClick={() => addCustom(areaKey)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                        style={{ background: `${area.color}20`, color: area.color }}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Step 3: Tone (user only) ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>Step 4 of 5</p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                How should Luma coach you?
              </h1>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                This shapes how Luma messages and motivates you every day.
              </p>
            </div>
            <div className="space-y-3">
              {TONES.map(t => (
                <button key={t.key} onClick={() => setTone(t.key)}
                  className="w-full p-4 rounded-2xl text-left transition-all border-2 flex items-center gap-4"
                  style={{
                    background: tone === t.key ? 'var(--accent-soft)' : 'var(--content-bg)',
                    borderColor: tone === t.key ? 'var(--accent)' : 'var(--card-border)',
                  }}>
                  <span className="text-2xl">{t.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.desc}</div>
                  </div>
                  {tone === t.key && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--accent)' }}>
                      <Check size={11} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Times (user only) ── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>Step 5 of 5</p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                When should Luma check in? ⏰
              </h1>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Set your morning briefing and evening review times. You can always change these later.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Morning briefing', emoji: '🌅', value: morningTime, set: setMorning },
                { label: 'Evening review',   emoji: '🌙', value: eveningTime, set: setEvening },
              ].map(t => (
                <div key={t.label} className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: 'var(--content-bg)', border: '1px solid var(--card-border)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.emoji}</span>
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
                  </div>
                  <input type="time" value={t.value} onChange={e => t.set(e.target.value)}
                    className="rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1.5px solid var(--card-border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Make sure to connect @lumacoachbot on Telegram to receive these messages.
            </p>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}>
              ← Back
            </button>
          ) : <div />}

          <button
            onClick={next}
            disabled={!canProceed() || saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {step === totalSteps - 1 ? "Let's go!" : 'Continue'}
                {step < totalSteps - 1 && <ChevronRight size={15} />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
