import { db } from './lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const events = await db.orm.public.Event.where({ status: 'PUBLISHED' }).all();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Upcoming Events
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Join us for our upcoming tech meetups and workshops.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/lookup" className="text-blue-600 hover:underline font-medium">
              Find My Ticket
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/staff/login" className="text-gray-600 hover:underline font-medium">
              Staff Login
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {events.map((event: any) => {
            const isPast = new Date(event.endsAt) < new Date();
            
            return (
              <div 
                key={event.id} 
                className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 ${isPast ? 'opacity-75' : 'hover:shadow-lg transition-shadow duration-300'}`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {event.title}
                    </h2>
                    {isPast && (
                      <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase">
                        Ended
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-500">
                    <p>📍 {event.venue}</p>
                    <p>📅 {new Date(event.startsAt).toLocaleDateString('en-US', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}</p>
                    <p>👥 Capacity: {event.capacity} seats</p>
                  </div>

                  {isPast ? (
                    <button disabled className="block w-full text-center bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                      Event Ended
                    </button>
                  ) : (
                    <Link 
                      href={`/events/${event.id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      View Details & Register
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}