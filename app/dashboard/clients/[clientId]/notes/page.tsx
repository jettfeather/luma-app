import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import SessionNotes from '@/components/SessionNotes'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function NotesPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: coach } = await admin.from('users').select('id').eq('email', user.email).single()
  if (!coach) redirect('/dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Session Notes</h1>
        <p className="text-gray-500 text-sm mt-1">Private notes visible only to you as the coach.</p>
      </div>
      <SessionNotes coachId={coach.id} clientId={clientId} />
    </div>
  )
}
