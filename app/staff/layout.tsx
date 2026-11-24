'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wifi, ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

const navigation = [
  { href: '/staff/attendees', label: 'View Attendees' },
  { href: '/staff/checkin', label: 'Check-In' },
]

export default function StaffLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/staff/login'

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="relative z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <nav aria-label="Staff navigation" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <Link href="/" aria-label="gather. home" className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_5px_12px_-5px_rgba(37,99,235,0.75)]"><Wifi className="size-[18px]" strokeWidth={2.1} /></span>
            <span className="text-[19px] font-bold tracking-[-0.07em]">gather<span className="text-blue-600">.</span></span>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {isLoginPage ? (
              // Show only "Back to site" if on the login page
              <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                <ArrowLeft className="size-4" /> Back to site
              </Link>
            ) : (
              // Show full navigation if logged in
              <>
                {navigation.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-lg px-2.5 py-2 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:px-3.5 sm:text-[13px] ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <Link href="/staff/login" className="ml-1 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:ml-2 sm:px-3.5 sm:text-[13px]">
                  Sign Out
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">{children}</main>
    </div>
  )
}