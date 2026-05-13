'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ClientNav({ clientId, coachId }: { clientId: string; coachId: string }) {
  const pathname = usePathname()
  const base = `/dashboard/clients/${clientId}`

  const links = [
    { href: base, label: 'Overview' },
    { href: `${base}/habits`, label: 'Habits' },
    { href: `${base}/goals`, label: 'Goals' },
    { href: `${base}/journal`, label: 'Journal' },
    { href: `${base}/notes`, label: '📝 Session Notes' },
  ]

  return (
    <div className="flex gap-1 flex-wrap">
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            link.href === base
              ? pathname === base
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              : pathname.startsWith(link.href)
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
