import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import AttendeeList from './attendee-list';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AttendeesPage() {
  const session = await verifyStaffSession();
  if (!session) redirect('/staff/login');

  // Fetch all events
  const events = await db.orm.public.Event.where({ status: 'PUBLISHED' }).all();
  
  // Fetch ALL registrations (Prisma 8 workaround: just get everything and filter in memory)
  const registrations = await db.orm.public.Registration.where({}).all();

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Attendee List</h1>
          <div className="flex gap-4">
            <Link href="/staff/checkin" className="text-sm font-medium text-blue-600 hover:underline">
              Back to Check-In
            </Link>
            <Link href="/staff/login" className="text-sm font-medium text-red-600 hover:underline">
              Sign Out
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden">
          <AttendeeList events={events} allRegistrations={registrations} />
        </div>
      </div>
    </main>
  );
}