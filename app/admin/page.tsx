import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const ALLOWED_EMAILS = ['jettfeatherston@gmail.com', 'hello@prohoods.com']

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function AdminPage() {
  // Auth gate
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ALLOWED_EMAILS.includes(user.email ?? '')) redirect('/dashboard')

  const monday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    return d.toISOString().split('T')[0]
  })()

  // Fetch all data in parallel
  const [
    { data: allUsers },
    { data: allHabits },
    { data: weekLogs },
  ] = await Promise.all([
    admin.from('users').select('id, name, email, role, coach_id, created_at').order('created_at', { ascending: false }),
    admin.from('habits').select('user_id').eq('active', true),
    admin.from('daily_logs').select('id').gte('date', monday),
  ])

  const users = allUsers ?? []
  const habits = allHabits ?? []

  // Derived stats
  const totalUsers = users.length
  const totalCoaches = users.filter(u => u.role === 'coach').length
  const totalHabits = habits.length
  const totalLogsThisWeek = weekLogs?.length ?? 0

  // Habits count per user (grouped in JS)
  const habitCountByUser = habits.reduce((acc: Record<string, number>, h) => {
    acc[h.user_id] = (acc[h.user_id] ?? 0) + 1
    return acc
  }, {})

  // Recent signups (already ordered desc)
  const recentSignups = users.slice(0, 10)

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const stats = [
    { label: 'Total Users', value: totalUsers, color: '#10b981', icon: '👥' },
    { label: 'Total Coaches', value: totalCoaches, color: '#8b5cf6', icon: '🎯' },
    { label: 'Active Habits', value: totalHabits, color: '#3b82f6', icon: '✅' },
    { label: 'Logs This Week', value: totalLogsThisWeek, color: '#f59e0b', icon: '📊' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--content-bg)' }}>
      {/* Top bar */}
      <header
        style={{
          background: 'var(--card-bg)',
          borderBottom: '1px solid var(--card-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Luma logo mark */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              L
            </div>
            <span className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
              Luma
            </span>
            <span style={{ color: 'var(--card-border)', fontSize: '1.25rem' }}>/</span>
            <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              🔒 Admin
            </span>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}>
            Super Admin
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {/* Page header */}
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>{todayStr}</p>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🔒 Admin Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Platform overview — all data is live from Supabase
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-5 stagger">
          {stats.map(stat => (
            <div key={stat.label} className="card p-6 animate-fade-in-up">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <div
                  className="w-2 h-2 rounded-full mt-1"
                  style={{ background: stat.color }}
                />
              </div>
              <p
                className="text-4xl font-bold count-up"
                style={{ color: stat.color }}
              >
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* All users table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              All Users
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--content-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
              {totalUsers} total
            </span>
          </div>

          <div className="card overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    {['Name', 'Email', 'Role', 'Coach linked', 'Habits', 'Joined'].map(col => (
                      <th
                        key={col}
                        className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)', background: 'var(--content-bg)' }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: i < users.length - 1 ? '1px solid var(--card-border)' : undefined,
                      }}
                    >
                      {/* Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: u.role === 'coach'
                              ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                              : 'linear-gradient(135deg, #10b981, #059669)' }}
                          >
                            {(u.name ?? u.email ?? '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {u.name ?? '—'}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5">
                        <span style={{ color: 'var(--text-secondary)' }}>{u.email ?? '—'}</span>
                      </td>

                      {/* Role badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={u.role === 'coach'
                            ? { background: 'rgba(139,92,246,0.12)', color: '#7c3aed' }
                            : { background: 'rgba(16,185,129,0.12)', color: '#059669' }}
                        >
                          {u.role === 'coach' ? '🎯 Coach' : '👤 User'}
                        </span>
                      </td>

                      {/* Coach linked */}
                      <td className="px-5 py-3.5">
                        {u.coach_id ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: '#10b981' }}>
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                              style={{ background: '#10b981', fontSize: 10 }}
                            >✓</span>
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      {/* Habits count */}
                      <td className="px-5 py-3.5">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {habitCountByUser[u.id] ?? 0}
                        </span>
                      </td>

                      {/* Created at */}
                      <td className="px-5 py-3.5">
                        <span style={{ color: 'var(--text-muted)' }}>
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                              })
                            : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        No users yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent signups */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Signups
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--content-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
              Last 10
            </span>
          </div>

          <div className="space-y-3 stagger">
            {recentSignups.map(u => (
              <div key={u.id} className="card px-5 py-4 flex items-center justify-between animate-fade-in-up">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: u.role === 'coach'
                      ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                      : 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    {(u.name ?? u.email ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                      {u.name ?? u.email ?? 'Unknown'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={u.role === 'coach'
                      ? { background: 'rgba(139,92,246,0.12)', color: '#7c3aed' }
                      : { background: 'rgba(16,185,129,0.12)', color: '#059669' }}
                  >
                    {u.role === 'coach' ? '🎯 Coach' : '👤 User'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
            {recentSignups.length === 0 && (
              <div className="card px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                No signups yet
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
