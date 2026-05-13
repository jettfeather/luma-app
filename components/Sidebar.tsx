'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from './ThemeProvider'
import {
  LayoutDashboard, Flame, Target, BookOpen,
  Settings, Users, Sun, Moon, LogOut, Zap
} from 'lucide-react'

const USER_NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/habits', label: 'Habits', icon: Flame },
  { href: '/dashboard/goals', label: 'Goals', icon: Target },
  { href: '/dashboard/journal', label: 'Journal', icon: BookOpen },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const COACH_NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ userEmail, role }: { userEmail: string; role?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  const nav = role === 'coach' ? COACH_NAV : USER_NAV

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="sidebar w-64 min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Luma</span>
          {role === 'coach' && (
            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
              Coach
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(item => {
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              style={{ color: active ? 'white' : 'var(--text-secondary)' }}
            >
              <Icon size={18} className={active ? 'text-white' : ''} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-1 border-t mt-4 pt-4" style={{ borderColor: 'var(--sidebar-border)' }}>
        {/* Telegram */}
        <a
          href="https://t.me/lumacoachbot"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full hover:bg-emerald-500/10"
          style={{ color: 'var(--accent)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
          </svg>
          Open Telegram
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* User + sign out */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{userEmail}</p>
          </div>
          <button
            onClick={signOut}
            className="ml-2 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut size={15} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>
    </aside>
  )
}
