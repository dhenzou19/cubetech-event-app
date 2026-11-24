'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react'
import { loginStaff } from '@/app/actions/auth'

export default function StaffLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const result = await loginStaff(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/staff/checkin')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <section className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[44%] size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.13)_0%,rgba(96,165,250,0.07)_36%,rgba(248,250,252,0)_70%)]" />
        <div className="relative w-full max-w-[440px] rounded-[28px] border border-white bg-white p-7 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.24)] sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100"><LockKeyhole className="size-6" strokeWidth={1.8} /></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">gather. staff</p>
            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.06em] text-slate-950">Staff Portal</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to manage event check-ins.</p>
          </div>

          {error && <div className="mb-5 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="staff-username" className="mb-2 block text-xs font-semibold text-slate-700">Username</label>
                <div className="relative">
                  <UserRound aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-slate-400" />
                  <input id="staff-username" name="username" autoComplete="username" placeholder="Enter your username" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" required />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="staff-password" className="text-xs font-semibold text-slate-700">Password</label>
                  <button type="button" onClick={() => setShowPassword((c) => !c)} className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
                <div className="relative">
                  <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-slate-400" />
                  <input id="staff-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" required />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.75)] transition hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Signing in...' : <>Sign In <ArrowRight className="size-4" /></>}
            </button>
          </form>
          <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-slate-400"><LockKeyhole className="size-3.5" /> Secure staff access</div>
        </div>
      </section>
    </div>
  )
}