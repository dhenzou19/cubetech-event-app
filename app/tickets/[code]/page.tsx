import { db } from '@/app/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TicketPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params;
  const ticketCode = resolvedParams.code;

  const registration = await db.orm.public.Registration.where({ 
    ticketCode: ticketCode 
  }).first();

  if (!registration) notFound();

  const event = await db.orm.public.Event.where({ 
    id: registration.eventId 
  }).first();

  if (!event) notFound();

  const qrCodeDataUrl = await QRCode.toDataURL(registration.ticketCode, {
    width: 300,
    margin: 2,
    color: { dark: '#0f172a', light: '#ffffff' },
  });

  const startDate = new Date(event.startsAt);
  const dateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'Asia/Manila' });
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' });

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2" aria-hidden="true" />
      
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition mb-6 ml-2">
          <ArrowLeft className="size-4" /> Return to Events
        </Link>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_-16px_rgba(15,23,42,0.2)] border border-slate-200/80 overflow-hidden">
          
          {/* Ticket Header */}
          <div className="bg-blue-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-32 bg-white/10 rounded-full blur-2xl" />
            <h1 className="text-2xl font-bold tracking-tight relative z-10">Your Ticket</h1>
            <p className="text-blue-100 mt-1 text-sm relative z-10">Show this QR code at the door</p>
          </div>

          {/* Event Info */}
          <div className="p-6 pb-8 border-b border-dashed border-slate-200 relative">
            {/* Cutout circles for ticket effect */}
            <div className="absolute -bottom-3 -left-3 size-6 bg-[#F8FAFC] rounded-full border-r border-t border-slate-200/80" />
            <div className="absolute -bottom-3 -right-3 size-6 bg-[#F8FAFC] rounded-full border-l border-t border-slate-200/80" />
            
            <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">{event.title}</h2>
            
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-slate-400 shrink-0" />
                <p className="font-medium">{event.venue}</p>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="size-4 text-slate-400 shrink-0" />
                <p className="font-medium">{dateStr}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-slate-400 shrink-0" />
                <p className="font-medium">{timeStr} (Cebu Time)</p>
              </div>
            </div>
          </div>

          {/* QR & Attendee */}
          <div className="p-8 flex flex-col items-center bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Attendee</p>
            <p className="text-lg font-bold text-slate-900 mb-6">{registration.fullName}</p>

            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-6">
              <img src={qrCodeDataUrl} alt="Ticket QR Code" className="w-48 h-48 rounded-xl" />
            </div>

            <div className="text-center bg-blue-50 border border-blue-100 rounded-xl px-6 py-3 w-full">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.15em] mb-1">Ticket Code</p>
              <p className="text-xl font-mono font-bold text-slate-900 tracking-widest">{registration.ticketCode}</p>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}