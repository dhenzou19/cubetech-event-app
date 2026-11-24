'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle, Check, Clock3, QrCode, ShieldCheck, TicketCheck, X } from 'lucide-react'
import { processCheckIn } from '@/app/actions/checkin'

type EventType = { id: string; title: string };
type ResultType = { status: 'success' | 'already' | 'invalid'; name?: string; time?: string; message?: string } | null;

export default function StaffCheckInForm({ events }: { events: EventType[] }) {
  const [eventId, setEventId] = useState(events[0]?.id || '')
  const [ticketCode, setTicketCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultType>(null)

  async function handleCheckIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!ticketCode.trim() || !eventId) return

    setLoading(true)
    setResult(null)

    const res = await processCheckIn(eventId, ticketCode)
    setResult(res as ResultType)
    setLoading(false)
    setTicketCode('')
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-7 sm:pt-14 lg:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 size-[360px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08),transparent_70%)]" />
      <div className="relative mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm"><span className="size-1.5 rounded-full bg-blue-600" /> Door tools</div>
          <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.065em] text-slate-950 sm:text-[42px]">Check in attendees</h1>
          <p className="mt-2 text-sm text-slate-500">A quick scan, a warm welcome, and they&apos;re in.</p>
        </div>
      </div>

      <div className="mx-auto max-w-[640px]">
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_60px_-32px_rgba(15,23,42,0.22)]">
          <div className="p-6 sm:p-8">
            <div className="mb-1 flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100"><QrCode className="size-[21px]" strokeWidth={1.8} /></div>
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Door check-in</h2>
            <p className="text-[13px] text-slate-500">Select the event, then enter the code from the attendee&apos;s ticket.</p>

            <form onSubmit={handleCheckIn} className="mt-6 flex flex-col gap-5">
              <div>
                <label htmlFor="event-select" className="mb-2 block text-xs font-semibold text-slate-700">Event</label>
                <select 
                  id="event-select" 
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="ticket-code" className="text-xs font-semibold text-slate-700">Ticket Code</label>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Manual entry</span>
                </div>
                <div className="relative">
                  <TicketCheck aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-blue-600" />
                  <input 
                    id="ticket-code" 
                    value={ticketCode} 
                    onChange={(e) => setTicketCode(e.target.value.toUpperCase())} 
                    placeholder="TKT-A1B2C3" 
                    className="h-[62px] w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-12 font-mono text-[19px] font-semibold uppercase tracking-[0.09em] text-slate-900 outline-none transition placeholder:text-[15px] placeholder:font-medium placeholder:tracking-[0.06em] placeholder:text-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" 
                    required 
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.75)] transition hover:bg-blue-700 disabled:opacity-50">
                <Check className="size-4" /> {loading ? 'Processing...' : 'Check In'}
              </button>
            </form>

            <div className="mt-5">
              {result ? <ResultCard result={result} /> : (
                <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-slate-500">
                  <ShieldCheck className="mt-0.5 size-[18px] shrink-0 text-slate-400" />
                  <p className="text-xs leading-5">Check-in results will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResultCard({ result }: { result: ResultType }) {
  if (!result) return null;
  if (result.status === 'success') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-[18px]" strokeWidth={2.5} /></span>
        <div><p className="text-sm font-semibold">Checked In</p><p className="mt-0.5 text-xs text-emerald-800/80">Welcome, {result.name}.</p></div>
      </div>
    )
  }
  if (result.status === 'already') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Clock3 className="size-[18px]" /></span>
        <div><p className="text-sm font-semibold">Already Checked In</p><p className="mt-0.5 text-xs text-amber-800/80">This ticket was checked in at {result.time}.</p></div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700"><X className="size-[18px]" strokeWidth={2.5} /></span>
      <div><p className="text-sm font-semibold">Invalid Ticket</p><p className="mt-0.5 flex items-center gap-1 text-xs text-rose-800/80"><AlertCircle className="size-3.5" /> {result.message || 'Check the code and try again.'}</p></div>
    </div>
  )
}