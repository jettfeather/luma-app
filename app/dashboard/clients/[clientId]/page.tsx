import { createClient as createAdmin } from '@supabase/supabase-js'
import HabitsView from '@/components/HabitsView'
import GoalsView from '@/components/GoalsView'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function ClientOverview({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params

  const { data: client } = await admin
    .from('users')
    .select('name, email')
    .eq('id', clientId)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{client?.name ?? client?.email}&apos;s Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Viewing as coach — you can edit goals and journal entries.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Goals</h2>
        <GoalsView userId={clientId} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Habit Tracker</h2>
        <HabitsView userId={clientId} />
      </div>
    </div>
  )
}
