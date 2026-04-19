'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import JournalView from '@/components/JournalView'

export default function JournalPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Journal & Notes</h1>
      {userId && <JournalView userId={userId} />}
    </div>
  )
}
