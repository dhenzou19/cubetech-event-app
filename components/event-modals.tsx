'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CalendarDays, Mail, MapPin, Search, X, Loader2, AlertCircle } from 'lucide-react'
import { registerAttendee } from '@/app/actions/register'
import { findTicket } from '@/app/actions/lookup'
import { fetchTicketData } from '@/app/actions/ticket'
import { cancelRegistration } from '@/app/actions/cancel'

type EventInfo = {
  id: string
  title: string
  date: string
  venue: string
   isFull?: boolean
}

type EventModalProps = {
  mode: 'registration' | 'ticket'
  event?: EventInfo
  onClose: () => void
}

export function EventModal({ mode, event, onClose }: EventModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ticketData, setTicketData] = useState<any>(null)
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false)
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
    let result;

    if (isRegistration && event) {
      result = await registerAttendee({
        eventId: event.id,
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
      })
    } else {
      result = await findTicket(
        formData.get('ticketCode') as string,
        formData.get('email') as string
      )
    }

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.ticketCode) {
      const ticketRes = await fetchTicketData(result.ticketCode)
      if (ticketRes.success) {
        setTicketData(ticketRes.ticket)
      } else {
        setError(ticketRes.error || 'Failed to load ticket')
      }
      setLoading(false)
    }
  }

  async function handleCancel() {
    setLoading(true)
    setError('')
    const result = await cancelRegistration(ticketData.id)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setTicketData({ ...ticketData, status: 'CANCELLED' })
      setIsConfirmingCancel(false)
      setLoading(false)
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
      <section className={`relative overflow-y-auto rounded-3xl bg-white shadow-2xl ${ticketData ? 'max-h-[calc(100dvh-32px)] p-0' : 'max-h-[min(90dvh,760px)] p-6 sm:p-9'}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className={`absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 ${ticketData ? 'bg-white/15 text-white hover:bg-white/25 focus-visible:ring-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-blue-600'}`}
        >
          <X className="size-[18px]" />
        </button>

        {ticketData ? (
          <div className="relative overflow-hidden bg-white">
            <header className={`px-7 pb-6 pt-7 text-white sm:px-9 sm:pt-8 ${ticketData.status === 'WAITLISTED' ? 'bg-amber-500' : 'bg-blue-600'}`}>
              <p className="text-[10px] font-semibold tracking-[0.17em] text-white/80">GATHER • CEBU</p>
              <h2 id="event-modal-title" className="mt-2 text-[30px] font-semibold tracking-[-0.06em]">
                {ticketData.status === 'CANCELLED' ? 'Ticket Cancelled' : 
                 ticketData.status === 'WAITLISTED' ? 'You are on the Waitlist' : 
                 'Your Ticket'}
              </h2>
              <p className="mt-1 text-sm text-white/90">
                {ticketData.status === 'CANCELLED' ? 'This ticket is no longer valid' : 
                 ticketData.status === 'WAITLISTED' ? `You are #${ticketData.waitlistPosition} in line.` : 
                 'Show this QR code at the door'}
              </p>
            </header>
            <div className="px-7 pb-7 pt-6 sm:px-9 sm:pb-8">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400">EVENT</p>
                <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.04em] text-slate-900">{ticketData.eventTitle}</h3>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">DATE</p><p className="mt-1 font-medium text-slate-700">{ticketData.dateStr}</p></div>
                  <div><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">TIME</p><p className="mt-1 font-medium text-slate-700">{ticketData.timeStr}</p></div>
                  <div className="col-span-2"><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">VENUE</p><p className="mt-1 font-medium text-slate-700">{ticketData.venue}</p></div>
                </div>
              </div>
              
              <div className="ticket-perforation relative my-6" aria-hidden="true" />
              
              <div className="text-center">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400">ATTENDEE</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900">{ticketData.fullName}</p>
                
                {/* ✅ NEW: Only show QR if CONFIRMED. Hide if WAITLISTED or CANCELLED */}
                {ticketData.status === 'CONFIRMED' && (
                  <div className="mx-auto my-5 flex size-[152px] items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <img src={ticketData.qrCodeDataUrl} alt="Ticket QR" className="size-full" />
                  </div>
                )}

                {ticketData.status === 'WAITLISTED' && (
                  <div className="my-6 rounded-xl bg-amber-50 p-4 border border-amber-100 text-amber-800 text-sm">
                    <p className="font-semibold mb-1">No QR Code yet</p>
                    <p>Your QR code will be generated if a spot opens up and staff promotes you.</p>
                  </div>
                )}
                
                <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400">TICKET CODE</p>
                <p className={`mx-auto mt-2 inline-flex rounded-full px-4 py-2 font-mono text-sm font-bold tracking-[0.08em] ${
                  ticketData.status === 'CANCELLED' ? 'bg-red-50 text-red-700' : 
                  ticketData.status === 'WAITLISTED' ? 'bg-amber-100 text-amber-800' : 
                  'bg-blue-50 text-blue-700'
                }`}>
                  {ticketData.ticketCode}
                </p>
              </div>
            </div>
            
            {(ticketData.status === 'CONFIRMED' || ticketData.status === 'WAITLISTED') && (
              <footer className="border-t border-slate-100 bg-slate-50 px-7 py-4 text-center sm:px-9">
                {error && <div className="mb-3 text-sm text-red-600 font-medium">{error}</div>}
                
                {isConfirmingCancel ? (
                  <div className="flex gap-3">
                    <button onClick={() => setIsConfirmingCancel(false)} className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">No, keep it</button>
                    <button onClick={handleCancel} disabled={loading} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition flex justify-center items-center">
                      {loading ? <Loader2 className="size-4 animate-spin" /> : 'Yes, cancel'}
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setIsConfirmingCancel(true)} className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                    {ticketData.status === 'WAITLISTED' ? 'Leave Waitlist' : 'Cancel Registration'}
                  </button>
                )}
              </footer>
            )}
          </div>
        ) : isRegistration ? (
          <>
            <div className="mb-7 pr-8">
              <span className={`mb-4 flex size-11 items-center justify-center rounded-xl ${event?.isFull ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                <CalendarDays className="size-5" />
              </span>
              <p className={`mb-2 text-[10px] font-semibold tracking-[0.16em] ${event?.isFull ? 'text-amber-600' : 'text-blue-700'}`}>
                {event?.isFull ? 'EVENT FULL - JOIN WAITLIST' : 'SAVE YOUR SEAT'}
              </p>
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
                <input name="mobile" type="tel" autoComplete="tel" required placeholder="Your Number" className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <button type="submit" disabled={loading} className={`mt-2 flex h-[54px] w-full items-center justify-center rounded-xl text-sm font-semibold text-white shadow-[0_7px_16px_-8px_rgba(37,99,235,0.9)] transition disabled:opacity-50 ${event?.isFull ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {loading ? <Loader2 className="size-5 animate-spin" /> : event?.isFull ? 'Join Waitlist' : 'Register Now'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* ... Lookup Form ... */}
            <div className="mb-7 pr-8">
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Search className="size-5" /></span>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-blue-700">YOUR NEXT CONNECTION</p>
              <h2 id="event-modal-title" className="text-[28px] font-semibold tracking-[-0.055em] text-slate-900">Find My Ticket</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Enter the details you used to register and we’ll help you find your ticket.</p>
            </div>
            
            {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Ticket Code
                <input name="ticketCode" autoComplete="off" required placeholder="TKT" className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal uppercase text-slate-900 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Email Address
                <span className="relative block"><Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input name="email" type="email" autoComplete="email" required placeholder="" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></span>
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