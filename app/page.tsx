import { db } from './lib/db';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Check, MapPin, Ticket, Users, Wifi } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Helper to format the DB data for the UI
function EventCard({ event }: { event: any }) {
  const startDate = new Date(event.startsAt);
  const endDate = new Date(event.endsAt);
  const isPast = endDate < new Date();
  const spotsLeft = event.capacity - (event.registeredCount || 0);
  const isFull = spotsLeft <= 0;

  // Formatting for the card
  const month = startDate.toLocaleString('en-US', { month: 'short', timeZone: 'Asia/Manila' }).toUpperCase();
  const day = startDate.toLocaleString('en-US', { day: '2-digit', timeZone: 'Asia/Manila' });
  const dateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'Asia/Manila' });
  const timeStr = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' })} — ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' })}`;

  return (
    <article className="event-card group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-16px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-22px_rgba(15,23,42,0.26)]">
      <div className={`event-art ${event.id === 'event-1' ? 'meetup' : 'workshop'} relative flex h-[218px] items-start justify-between overflow-hidden p-6`}>
        <div className="art-orb" aria-hidden="true" />
        <span className="relative z-10 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white backdrop-blur-sm">
          {isPast ? 'PAST EVENT' : 'COMMUNITY MEETUP'}
        </span>
        <div className="relative z-10 flex size-[62px] flex-col items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg">
          <span className="text-[9px] font-bold tracking-[0.17em] text-blue-600">{month}</span>
          <span className="-mt-0.5 text-[25px] font-semibold leading-none tracking-[-0.06em]">{day}</span>
        </div>
        <div className="art-lines" aria-hidden="true" />
        <div className="art-caption absolute bottom-6 left-6 z-10 text-white">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] text-white/65"><span className="size-1.5 rounded-full bg-blue-300" /> CEBU, PHILIPPINES</div>
          <p className="text-sm font-medium tracking-wide text-white/90">{timeStr}</p>
        </div>
        <span className="absolute -bottom-10 -right-2 select-none text-[122px] font-semibold leading-none tracking-[-0.1em] text-white/[0.07]" aria-hidden="true">
          {event.id === 'event-1' ? '01' : '02'}
        </span>
      </div>
      <div className="p-6 sm:p-7">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-blue-700">
          <span className="size-1.5 rounded-full bg-blue-600" /> {isPast ? 'PAST EVENT' : isFull ? 'FULL' : 'UPCOMING'}
        </div>
        <h2 className="text-[22px] font-semibold tracking-[-0.045em] text-slate-900">{event.title}</h2>
        <p className="mt-2 min-h-[48px] max-w-[48ch] text-[14px] leading-[1.7] text-slate-500 line-clamp-2">{event.description}</p>
        <div className="my-6 h-px bg-slate-100" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} />
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">VENUE</p>
              <p className="mt-1 text-xs font-medium text-slate-700 line-clamp-1">{event.venue}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} />
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">DATE</p>
              <p className="mt-1 text-xs font-medium text-slate-700">{dateStr}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Users className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} />
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">CAPACITY</p>
              <p className="mt-1 text-xs font-medium text-slate-700">{spotsLeft} / {event.capacity} left</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Ticket className="mt-0.5 size-[17px] shrink-0 text-slate-400" strokeWidth={1.8} />
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">ADMISSION</p>
              <p className="mt-1 text-xs font-medium text-slate-700">Free entry</p>
            </div>
          </div>
        </div>
        
        {isPast || isFull ? (
          <button type="button" disabled className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold cursor-not-allowed bg-slate-100 text-slate-400">
            <Check className="size-4" /> {isPast ? 'Event Ended' : 'Event Full'}
          </button>
        ) : (
          <Link href={`/events/${event.id}`} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 bg-blue-600 text-white shadow-[0_6px_14px_-7px_rgba(37,99,235,0.9)] hover:bg-blue-700 active:scale-[0.99]">
            View Details & Register <ArrowUpRight className="size-4" />
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function Page() {
  // 1. Fetch events from DB
  const dbEvents = await db.orm.public.Event.where({ status: 'PUBLISHED' }).all();
  
  // 2. Fetch all registrations to calculate spots left
  const registrations = await db.orm.public.Registration.where({ status: 'CONFIRMED' }).all();

  // 3. Attach registration count to events
  const events = dbEvents.map(event => ({
    ...event,
    registeredCount: registrations.filter(r => r.eventId === event.id).length
  }));

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
      <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
          <a href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" aria-label="Gather home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_5px_12px_-5px_rgba(37,99,235,0.75)]"><Wifi className="size-[19px]" strokeWidth={2.1} /></span>
            <span className="text-[19px] font-bold tracking-[-0.07em]">gather<span className="text-blue-600">.</span></span>
          </a>
          <div className="flex items-center gap-3 sm:gap-7">
            <Link href="/lookup" className="hidden text-[13px] font-medium text-slate-600 transition hover:text-blue-600 sm:inline">Find My Ticket</Link>
            <Link href="/staff/login" className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Staff Login</Link>
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
          <h2 className="text-xs font-semibold tracking-[0.12em] text-slate-500">ALL EVENTS <span className="ml-1 text-slate-400">/ {events.length.toString().padStart(2, '0')}</span></h2>
          <span className="text-xs text-slate-400">Cebu City, Philippines</span>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {events.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      </section>
      
      <footer className="border-t border-slate-200/70 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© 2026 gather. Made for the people who make things.</span><a href="mailto:hello@gather.events" className="font-medium text-slate-500 hover:text-blue-600">Say hello <span aria-hidden="true">↗</span></a></div>
      </footer>
    </main>
  );
}