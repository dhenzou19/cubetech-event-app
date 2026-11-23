import { db } from '@/app/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from './register-form';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  const event = await db.orm.public.Event.where({ id: eventId }).first();
  if (!event) notFound();

  const registrations = await db.orm.public.Registration.where({ 
    eventId: event.id,
    status: 'CONFIRMED'
  }).all();
  
  const spotsLeft = event.capacity - registrations.length;
  const isFull = spotsLeft <= 0;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila'
    });
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8FAFC] text-slate-900 py-12 px-4 sm:px-6">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2" aria-hidden="true" />
      
      <div className="relative max-w-3xl mx-auto z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition mb-6">
          <ArrowLeft className="size-4" /> Back to Events
        </Link>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_-16px_rgba(15,23,42,0.2)] border border-slate-200/80 overflow-hidden">
          <div className="p-8 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">{event.title}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Venue</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="size-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{formatDate(event.startsAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="size-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{formatTime(event.startsAt)} - {formatTime(event.endsAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="size-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Spots Left</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{spotsLeft} of {event.capacity}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-10">
              <p className="text-slate-600 leading-relaxed text-[15px]">{event.description}</p>
            </div>

            {isFull ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-center font-semibold shadow-sm">
                This event is Full. Registration is closed.
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-5">Secure your spot</h2>
                <RegisterForm eventId={event.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}