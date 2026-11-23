import { db } from '@/app/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

// ✅ FIX: params is a Promise in Next.js 16
export default async function TicketPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params;
  const ticketCode = resolvedParams.code;

  // 1. Fetch the registration using the ticket code
  const registration = await db.orm.public.Registration.where({ 
    ticketCode: ticketCode 
  }).first();

  if (!registration) {
    notFound();
  }

  // 2. Fetch the associated event
  const event = await db.orm.public.Event.where({ 
    id: registration.eventId 
  }).first();

  if (!event) {
    notFound();
  }

  // 3. Generate the QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(registration.ticketCode, {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });

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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-blue-600 p-6 text-center text-white">
          <h1 className="text-2xl font-bold">Your Ticket</h1>
          <p className="text-blue-100 mt-1">Show this at the door</p>
        </div>

        <div className="p-6 border-b border-gray-100 bg-gray-50 text-center">
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">{event.title}</h2>
          <p className="text-sm text-gray-500">📍 {event.venue}</p>
          <p className="text-sm text-gray-500">📅 {formatDate(event.startsAt)}</p>
          <p className="text-sm text-gray-500">⏰ {formatTime(event.startsAt)}</p>
        </div>

        <div className="p-8 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Attendee</p>
          <p className="text-lg font-bold text-gray-900 mb-6">{registration.fullName}</p>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <img src={qrCodeDataUrl} alt="Ticket QR Code" className="w-48 h-48" />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Ticket Code</p>
            <p className="text-2xl font-mono font-bold text-blue-600 tracking-widest bg-blue-50 px-4 py-2 rounded-lg">
              {registration.ticketCode}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
            Return to Events
          </Link>
        </div>
      </div>
    </main>
  );
}