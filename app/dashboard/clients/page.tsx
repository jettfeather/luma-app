import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await admin
    .from('users')
    .select('id, role')
    .eq('email', user.email)
    .single()

  if (!profile || profile.role !== 'coach') redirect('/dashboard')

  const { data: clients } = await admin
    .from('users')
    .select('id, name, email, created_at')
    .eq('coach_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Clients</h1>
        <p className="text-gray-500 text-sm mt-1">Click into any client to view their dashboard.</p>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center text-gray-400">
          <p className="text-lg mb-2">No clients yet</p>
          <p className="text-sm">Clients are linked to you when they complete Luma onboarding.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {clients.map(client => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div>
                <p className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {client.name ?? client.email}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{client.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  Since {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
