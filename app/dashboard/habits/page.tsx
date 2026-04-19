'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import HabitsView from '@/components/HabitsView'

export default function HabitsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Last 7 days. Log habits by messaging Luma on Telegram.</p>
      </div>
      {userId && <HabitsView userId={userId} />}
    </div>
  )
}
