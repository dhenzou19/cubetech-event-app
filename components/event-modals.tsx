'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Mail, MapPin, Search, X, Loader2 } from 'lucide-react'
import { registerAttendee } from '@/app/actions/register'
import { findTicket } from '@/app/actions/lookup'

type EventInfo = {
  id: string
  title: string
  date: string
  venue: string
}

type EventModalProps = {
  mode: 'registration' | 'ticket'
  event?: EventInfo
  onClose: () => void
}

export function EventModal({ mode, event, onClose }: EventModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isRegistration = mode === 'registration'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)

    if (isRegistration && event) {
      const result = await registerAttendee({
        eventId: event.id,
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
      })
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push(`/tickets/${result.ticketCode}`)
      }
    } else {
      const result = await findTicket(
        formData.get('ticketCode') as string,
        formData.get('email') as string
      )
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push(`/tickets/${result.ticketCode}`)
      }
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="event-modal-title"
      className={`event-dialog m-auto w-[calc(100%-32px)] border-0 bg-transparent p-0 text-slate-900 outline-none ${isRegistration ? 'max-w-[520px]' : 'max-w-[460px]'}`}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <section className="relative max-h-[min(90dvh,760px)] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <X className="size-[18px]" />
        </button>

        {isRegistration ? (
          <>
            <div className="mb-7 pr-8">
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><CalendarDays className="size-5" /></span>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-blue-700">SAVE YOUR SEAT</p>
              <h2 id="event-modal-title" className="text-[26px] font-semibold leading-tight tracking-[-0.055em] text-slate-900 sm:text-[30px]">{event?.title}</h2>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-500 sm:flex-row sm:gap-5">
                <span className="flex items-center gap-2"><CalendarDays className="size-4 text-slate-400" />{event?.date}</span>
                <span className="flex items-center gap-2"><MapPin className="size-4 text-slate-400" />{event?.venue}</span>
              </div>
            </div>
            
            {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Full Name
                <input name="fullName" autoComplete="name" required placeholder="Your name" className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Email
                <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Mobile Number
                <input name="mobile" type="tel" autoComplete="tel" required placeholder="09171234567" className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <button type="submit" disabled={loading} className="mt-2 flex h-[54px] w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-[0_7px_16px_-8px_rgba(37,99,235,0.9)] transition hover:bg-blue-700 disabled:opacity-50">
                {loading ? <Loader2 className="size-5 animate-spin" /> : 'Register Now'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-7 pr-8">
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Search className="size-5" /></span>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-blue-700">YOUR NEXT CONNECTION</p>
              <h2 id="event-modal-title" className="text-[28px] font-semibold tracking-[-0.055em] text-slate-900">Find My Ticket</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Enter the details you used to register and we’ll help you find your ticket.</p>
            </div>
            
            {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Ticket Code
                <input name="ticketCode" autoComplete="off" required placeholder="e.g. TKT-A1B2C3" className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal uppercase text-slate-900 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Email Address
                <span className="relative block"><Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></span>
              </label>
              <button type="submit" disabled={loading} className="mt-2 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-[0_7px_16px_-8px_rgba(37,99,235,0.9)] transition hover:bg-blue-700 disabled:opacity-50">
                {loading ? <Loader2 className="size-5 animate-spin" /> : <><Search className="size-4" />Find Ticket</>}
              </button>
            </form>
          </>
        )}
      </section>
    </dialog>
  )
}