'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OnboardingPage() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const res = await fetch(`/api/create-profile?email=${user.email}`)
      const data = await res.json()
      setRole(data?.role ?? 'user')
      setLoading(false)
    }
    getRole()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-10 text-center">
        <div className="text-4xl mb-4">{role === 'coach' ? '🏆' : '👋'}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {role === 'coach' ? 'Welcome, Coach!' : 'Welcome to Luma!'}
        </h1>
        <p className="text-gray-500 mb-8">
          {role === 'coach'
            ? 'Your account is set up. Head to your dashboard to invite your first client.'
            : 'One last step — connect the Luma bot on Telegram so it can send you daily check-ins.'}
        </p>

        {role === 'coach' ? (
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Steps */}
            <div className="text-left space-y-4">
              {[
                { step: '1', text: 'Open Telegram and search for @lumacoachbot' },
                { step: '2', text: 'Press Start or send /start' },
                { step: '3', text: 'Luma will walk you through setting up your habits and goals' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <p className="text-gray-700 text-sm pt-0.5">{s.text}</p>
                </div>
              ))}
            </div>

            <a
              href="https://t.me/lumacoachbot"
              target="_blank"
              className="block w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Open Telegram Bot
            </a>

            <Link href="/dashboard" className="block text-sm text-gray-400 hover:text-gray-600">
              Skip for now →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
