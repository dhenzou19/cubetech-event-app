'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Download, Search, Users, UserCheck, UserRoundPlus, Undo2, ArrowUpRight } from 'lucide-react'
import { promoteWaitlist } from '@/app/actions/waitlist'
import { undoCheckIn } from '@/app/actions/checkin'

type EventType = { id: string; title: string; capacity: number };
type RegistrationType = { 
  id: string; eventId: string; fullName: string; email: string; mobile: string; 
  ticketCode: string; status: string; createdAt: string; checkedInAt: string | null;
};

const statusStyles: Record<string, string> = {
  'CHECKED_IN': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'CONFIRMED': 'border-yellow-200 bg-yellow-50 text-yellow-800',
  'WAITLISTED': 'border-orange-200 bg-orange-50 text-orange-700',
  'CANCELLED': 'border-rose-200 bg-rose-50 text-rose-700',
}

export default function StaffAttendees({ events, allRegistrations }: { events: EventType[], allRegistrations: RegistrationType[] }) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '')
  const [query, setQuery] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const eventRegistrations = useMemo(() => allRegistrations.filter(r => r.eventId === selectedEventId), [allRegistrations, selectedEventId]);
  const selectedEvent = events.find(e => e.id === selectedEventId);
  
  const confirmed = eventRegistrations.filter(r => r.status === 'CONFIRMED' || r.status === 'CHECKED_IN').length;
  const checkedIn = eventRegistrations.filter(r => r.status === 'CHECKED_IN').length;
  const waitlisted = eventRegistrations.filter(r => r.status === 'WAITLISTED').length;

  const filteredAttendees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return eventRegistrations
    return eventRegistrations.filter((a) => [a.fullName, a.email, a.ticketCode].some((val) => val.toLowerCase().includes(normalizedQuery)))
  }, [eventRegistrations, query])

  async function handleUndo(id: string) {
    if (!confirm("Are you sure you want to undo this check-in?")) return;
    setLoadingId(id); setError('');
    const res = await undoCheckIn(id);
    if (res.error) setError(res.error);
    else window.location.reload();
    setLoadingId(null);
  }

  async function handlePromote(id: string) {
    setLoadingId(id); setError('');
    const res = await promoteWaitlist(id, selectedEventId);
    if (res.error) setError(res.error);
    else window.location.reload();
    setLoadingId(null);
  }

  function exportAttendees() {
    const headers = ['Name', 'Email', 'Mobile', 'Ticket Code', 'Status']
    const rows = filteredAttendees.map(({ fullName, email, mobile, ticketCode, status }) => [fullName, email, mobile, ticketCode, status])
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedEvent?.title.replace(/\s+/g, '_')}_Attendees.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-7 sm:pt-14 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm"><span className="size-1.5 rounded-full bg-blue-600" /> Guest list</div>
          <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.065em] text-slate-950 sm:text-[42px]">Attendees</h1>
          <p className="mt-2 text-sm text-slate-500">Keep your guest list moving and your door team in sync.</p>
        </div>
        <select 
          value={selectedEventId} 
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {error && <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Confirmed" value={`${confirmed}/${selectedEvent?.capacity || 0}`} detail="of total capacity" icon={<Users className="size-[18px]" />} tone="blue" />
        <StatCard label="Checked In" value={`${checkedIn}/${confirmed}`} detail="confirmed attendees" icon={<UserCheck className="size-[18px]" />} tone="green" />
        <StatCard label="Waitlisted" value={String(waitlisted)} detail="awaiting a spot" icon={<UserRoundPlus className="size-[18px]" />} tone="orange" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_42px_-28px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <div className="relative w-full sm:max-w-[330px]">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input 
              value={query} onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search name, email, or ticket..." 
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
            />
          </div>
          <button onClick={exportAttendees} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto">
            <Download className="size-4" /> Export to CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm text-slate-500">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              <tr>
                <th className="h-11 pl-5 font-bold">Name</th>
                <th className="font-bold">Contact</th>
                <th className="font-bold">Ticket Code</th>
                <th className="font-bold">Status</th>
                <th className="pr-5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendees.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60">
                  <td className="py-4 pl-5 text-[13px] font-semibold text-slate-800">{a.fullName}</td>
                  <td>
                    <div className="flex flex-col gap-1 whitespace-nowrap"><span className="text-xs font-medium text-slate-700">{a.email}</span><span className="text-[11px] text-slate-400">{a.mobile}</span></div>
                  </td>
                  <td><span className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[11px] font-medium tracking-wide text-slate-600">{a.ticketCode}</span></td>
                  <td>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[a.status]}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="pr-5 text-right">
                    {a.status === 'CHECKED_IN' && (
                      <button onClick={() => handleUndo(a.id)} disabled={loadingId === a.id} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50">
                        <Undo2 className="size-3.5" /> Undo
                      </button>
                    )}
                    {a.status === 'WAITLISTED' && (
                      <button onClick={() => handlePromote(a.id)} disabled={loadingId === a.id} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50">
                        <ArrowUpRight className="size-3.5" /> Promote
                      </button>
                    )}
                    {(a.status !== 'CHECKED_IN' && a.status !== 'WAITLISTED') && <span className="pr-2 text-[11px] text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
              {filteredAttendees.length === 0 && (
                <tr><td colSpan={5} className="h-28 text-center text-sm text-slate-500">No attendees match &ldquo;{query}&rdquo;.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: ReactNode; tone: 'blue' | 'green' | 'orange' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
  }
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_28px_-22px_rgba(15,23,42,0.2)] p-4 sm:p-5 flex items-start justify-between">
      <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-[27px] font-semibold leading-none tracking-[-0.055em] text-slate-950">{value}</p><p className="mt-2 text-[10px] text-slate-400">{detail}</p></div>
      <span className={`flex size-10 items-center justify-center rounded-xl ring-1 ${colors[tone]}`}>{icon}</span>
    </div>
  )
}