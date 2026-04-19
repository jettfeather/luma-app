import JournalView from '@/components/JournalView'

export default async function ClientJournal({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Journal & Notes</h1>
      <JournalView userId={clientId} />
    </div>
  )
}
