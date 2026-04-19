import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import NavBar from '@/components/NavBar'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await admin
    .from('users')
    .select('role')
    .eq('email', user.email)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar userEmail={user.email ?? ''} role={profile?.role} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
