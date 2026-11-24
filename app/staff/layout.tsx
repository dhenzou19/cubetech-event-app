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
      {/* 1. MATCHED THE HEADER EXACTLY TO HomeClient */}
      <header className="relative z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <nav aria-label="Staff navigation" className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8">
          
          <Link href="/" aria-label="gather. home" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_5px_12px_-5px_rgba(37,99,235,0.75)]">
              <Wifi className="size-[19px]" strokeWidth={2.1} />
            </span>
            <span className="text-[19px] font-bold tracking-[-0.07em]">gather<span className="text-blue-600">.</span></span>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-7">
            {isLoginPage ? (
              <Link href="/" className="flex items-center gap-2 rounded-lg text-[13px] font-medium text-slate-600 transition hover:text-blue-600">
                <ArrowLeft className="size-4" /> Back to site
              </Link>
            ) : (
              <>
                {navigation.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-lg text-[13px] font-medium transition ${active ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <Link href="/staff/login" className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                  Sign Out
                </Link>
              </>
            )}
          </div>

        </nav>
      </header>
      <main className="relative min-h-[calc(100vh-76px)] overflow-hidden">{children}</main>
    </div>
  )
}