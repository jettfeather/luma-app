import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar'

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
    <div className="flex min-h-screen" style={{ background: 'var(--content-bg)' }}>
      <Sidebar userEmail={user.email ?? ''} role={profile?.role} />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
