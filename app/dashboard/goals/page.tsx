'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GoalsView from '@/components/GoalsView'

export default function GoalsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Goals</h1>
        <p className="text-gray-500 text-sm mt-1">Edit your goals for each life area. Luma will use these to guide your daily check-ins.</p>
      </div>
      {userId && <GoalsView userId={userId} />}
    </div>
  )
}
