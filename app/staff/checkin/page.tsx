import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import CheckInForm from './checkin-form';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CheckInPage() {
  const session = await verifyStaffSession();
  
  if (!session) {
    redirect('/staff/login');
  }

  const events = await db.orm.public.Event.where({ status: 'PUBLISHED' }).all();

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Door Check-In</h1>
          <div className="flex gap-4">
            <Link href="/staff/attendees" className="text-sm font-medium text-blue-600 hover:underline">
              View Attendees
            </Link>
            <Link href="/staff/login" className="text-sm font-medium text-red-600 hover:underline">
              Sign Out
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <CheckInForm events={events} />
        </div>
      </div>
    </main>
  );
}