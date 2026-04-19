import GoalsView from '@/components/GoalsView'

export default async function ClientGoals({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
        <p className="text-gray-500 text-sm mt-1">Edit alongside your client in real-time.</p>
      </div>
      <GoalsView userId={clientId} />
    </div>
  )
}
