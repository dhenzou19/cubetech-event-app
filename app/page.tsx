import { db } from './lib/db';
import Link from 'next/link';

// Force Next.js to always fetch fresh data from the database
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch all published events from Neon
  // Prisma 8 syntax: .where({}).all() fetches multiple records
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
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {events.map((event: any) => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h2>
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

                <Link 
                  href={`/events/${event.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View Details & Register
                </Link>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No events found. Check back later!</p>
          </div>
        )}
      </div>
    </main>
  );
}