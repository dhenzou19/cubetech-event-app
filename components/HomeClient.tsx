'use client';

import { useState } from 'react';
import { ArrowUpRight, CalendarDays, Check, MapPin, Ticket, Users, Wifi } from 'lucide-react';
import { EventModal } from '@/components/event-modals';

export default function HomeClient({ initialEvents }: { initialEvents: any[] }) {
  const [registrationEvent, setRegistrationEvent] = useState<any>(null);
  const [ticketLookupOpen, setTicketLookupOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
      <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
          <a href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" aria-label="Gather home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_5px_12px_-5px_rgba(37,99,235,0.75)]"><Wifi className="size-[19px]" strokeWidth={2.1} /></span>
            <span className="text-[19px] font-bold tracking-[-0.07em]">gather<span className="text-blue-600">.</span></span>
          </a>
          <div className="flex items-center gap-3 sm:gap-7">
            <button onClick={() => setTicketLookupOpen(true)} className="hidden text-[13px] font-medium text-slate-600 transition hover:text-blue-600 sm:inline">Find My Ticket</button>
            <a href="/staff/login" className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">Staff Login</a>
          </div>
        </nav>
      </header>

      <div className="hero-glow pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2" aria-hidden="true" />
      
      <section id="home" className="relative mx-auto max-w-6xl px-5 pb-10 pt-[76px] sm:px-8 sm:pb-12 sm:pt-[100px]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-blue-700 shadow-sm"><span className="size-1.5 rounded-full bg-blue-600" /> GOOD PEOPLE. GOOD IDEAS.</div>
        <h1 className="max-w-3xl text-[48px] font-semibold leading-[1.03] tracking-[-0.065em] text-slate-950 sm:text-[68px]">Upcoming <span className="text-blue-600">Events</span></h1>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-[16px] leading-7 text-slate-500">Join us for upcoming tech meetups and workshops. Make a connection, find a spark, and build what&apos;s next.</p>
          <div className="flex items-center gap-2 pb-1 text-xs font-medium text-slate-400"><CalendarDays className="size-4" /> Curated for curious minds</div>
        </div>
      </section>
      
      <section id="events" className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-200/80 pb-4">
          <h2 className="text-xs font-semibold tracking-[0.12em] text-slate-500">ALL EVENTS <span className="ml-1 text-slate-400">/ {initialEvents.length.toString().padStart(2, '0')}</span></h2>
          <span className="text-xs text-slate-400">Cebu City, Philippines</span>
        </div>
        
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {initialEvents.map((event) => (
            <article key={event.id} className="event-card group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-16px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-22px_rgba(15,23,42,0.26)]">
              <div className={`event-art ${event.id === 'event-1' ? 'meetup' : 'workshop'} relative flex h-[218px] items-start justify-between overflow-hidden p-6`}>
                <div className="art-orb" aria-hidden="true" />
                <span className="relative z-10 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white backdrop-blur-sm">
                  {event.isPast ? 'PAST EVENT' : 'COMMUNITY MEETUP'}
                </span>
                <div className="relative z-10 flex size-[62px] flex-col items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg">
                  <span className="text-[9px] font-bold tracking-[0.17em] text-blue-600">{event.month}</span>
                  <span className="-mt-0.5 text-[25px] font-semibold leading-none tracking-[-0.06em]">{event.day}</span>
                </div>
                <div className="art-lines" aria-hidden="true" />
                <div className="art-caption absolute bottom-6 left-6 z-10 text-white">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] text-white/65"><span className="size-1.5 rounded-full bg-blue-300" /> CEBU, PHILIPPINES</div>
                  <p className="text-sm font-medium tracking-wide text-white/90">{event.timeStr}</p>
                </div>
                <span className="absolute -bottom-10 -right-2 select-none text-[122px] font-semibold leading-none tracking-[-0.1em] text-white/[0.07]" aria-hidden="true">{event.id === 'event-1' ? '01' : '02'}</span>
              </div>
              
              <div className="p-6 sm:p-7">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-blue-700">
                  <span className="size-1.5 rounded-full bg-blue-600" /> {event.isPast ? 'PAST EVENT' : event.isFull ? 'FULL / WAITLIST OPEN' : 'UPCOMING'}
                </div>
                <h2 className="text-[22px] font-semibold tracking-[-0.045em] text-slate-900">{event.title}</h2>
                <p className="mt-2 min-h-[48px] max-w-[48ch] text-[14px] leading-[1.7] text-slate-500 line-clamp-2">{event.description}</p>
                <div className="my-6 h-px bg-slate-100" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                  <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} /><div><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">VENUE</p><p className="mt-1 text-xs font-medium text-slate-700 line-clamp-1">{event.venue}</p></div></div>
                  <div className="flex items-start gap-2.5"><CalendarDays className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} /><div><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">DATE</p><p className="mt-1 text-xs font-medium text-slate-700">{event.dateStr}</p></div></div>
                  <div className="flex items-start gap-2.5"><Users className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} /><div><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">CAPACITY</p><p className="mt-1 text-xs font-medium text-slate-700">{event.spotsLeft} / {event.capacity} left</p></div></div>
                  <div className="flex items-start gap-2.5"><Ticket className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} /><div><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">ADMISSION</p><p className="mt-1 text-xs font-medium text-slate-700">Free entry</p></div></div>
                </div>
                
                {/* UPDATED BUTTON LOGIC */}
                {event.isPast ? (
                  <button type="button" disabled className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold cursor-not-allowed bg-slate-100 text-slate-400">
                    <Check className="size-4" /> Event Ended
                  </button>
                ) : (
                  <button onClick={() => setRegistrationEvent(event)} className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 text-white shadow-[0_6px_14px_-7px_rgba(37,99,235,0.9)] active:scale-[0.99] ${event.isFull ? 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-200' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {event.isFull ? 'Join Waitlist' : 'View Details & Register'} <ArrowUpRight className="size-4" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© 2026 gather. Made for the people who make things.</span><a href="mailto:hello@gather.events" className="font-medium text-slate-500 hover:text-blue-600">Say hello <span aria-hidden="true">↗</span></a></div>
      </footer>

      {registrationEvent && (
        <EventModal 
          mode="registration" 
          event={{ 
            id: registrationEvent.id,
            title: registrationEvent.title, 
            date: registrationEvent.dateStr, 
            venue: registrationEvent.venue 
          }} 
          onClose={() => setRegistrationEvent(null)} 
        />
      )}
      {ticketLookupOpen && <EventModal mode="ticket" onClose={() => setTicketLookupOpen(false)} />}
    </main>
  );
}