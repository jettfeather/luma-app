import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: coach } = await admin
    .from('users')
    .select('id, role')
    .eq('email', user.email)
    .single()

  if (!coach || coach.role !== 'coach') redirect('/dashboard')

  const { data: client } = await admin
    .from('users')
    .select('id, name, email, coach_id')
    .eq('id', clientId)
    .single()

  if (!client || client.coach_id !== coach.id) redirect('/dashboard/clients')

  const navLinks = [
    { href: `/dashboard/clients/${clientId}`, label: 'Overview' },
    { href: `/dashboard/clients/${clientId}/habits`, label: 'Habits' },
    { href: `/dashboard/clients/${clientId}/goals`, label: 'Goals' },
    { href: `/dashboard/clients/${clientId}/journal`, label: 'Journal' },
  ]

  return (
    <div className="space-y-6">
      {/* Client context bar */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm">
            {(client.name ?? client.email ?? '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{client.name ?? client.email}</p>
            <p className="text-xs text-gray-400">{client.email}</p>
          </div>
        </div>
        <Link href="/dashboard/clients" className="text-xs text-emerald-600 hover:text-emerald-800">
          ← All clients
        </Link>
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  )
}
