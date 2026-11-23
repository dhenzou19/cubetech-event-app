import { db } from '@/app/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from './register-form';

export const dynamic = 'force-dynamic';

// ✅ FIX: params is a Promise in Next.js 16
export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  const event = await db.orm.public.Event.where({ id: eventId }).first();

  if (!event) {
    notFound();
  }

  const registrations = await db.orm.public.Registration.where({ 
    eventId: event.id,
    status: 'CONFIRMED'
  }).all();
  
  const registeredCount = registrations.length;
  const spotsLeft = event.capacity - registeredCount;
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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Events
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
            
            <div className="space-y-3 text-gray-600 mb-8 bg-gray-50 p-4 rounded-lg">
              <p><strong>📍 Venue:</strong> {event.venue}</p>
              <p><strong>📅 Date:</strong> {formatDate(event.startsAt)}</p>
              <p><strong>⏰ Time:</strong> {formatTime(event.startsAt)} - {formatTime(event.endsAt)} (Cebu Time)</p>
              <p><strong>👥 Spots Left:</strong> {spotsLeft} of {event.capacity}</p>
            </div>

            <div className="prose max-w-none mb-8">
              <p>{event.description}</p>
            </div>

            {isFull ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center font-semibold">
                This event is Full.
              </div>
            ) : (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Register for this Event</h2>
                <RegisterForm eventId={event.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}