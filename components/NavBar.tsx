'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const USER_NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/habits', label: 'Habits' },
  { href: '/dashboard/goals', label: 'Goals' },
  { href: '/dashboard/journal', label: 'Journal' },
]

const COACH_NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/clients', label: 'Clients' },
]

export default function NavBar({ userEmail, role }: { userEmail: string; role?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const nav = role === 'coach' ? COACH_NAV : USER_NAV

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="font-bold text-emerald-600 text-lg">Luma</span>
          <div className="flex gap-1">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    : pathname.startsWith(item.href)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {role === 'coach' && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium hidden sm:block">Coach</span>
          )}
          <span className="text-xs text-gray-400 hidden sm:block">{userEmail}</span>
          <a
            href="https://t.me/lumacoachbot"
            target="_blank"
            className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Open Telegram
          </a>
          <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600">Sign out</button>
        </div>
      </div>
    </nav>
  )
}
