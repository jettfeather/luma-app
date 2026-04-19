import HabitsView from '@/components/HabitsView'

export default async function ClientHabits({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Last 7 days.</p>
      </div>
      <HabitsView userId={clientId} />
    </div>
  )
}
