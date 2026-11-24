import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import StaffAttendees from './attendee-list';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export default async function AttendeesPage() {
  const session = await verifyStaffSession();
  if (!session) redirect('/staff/login');

  const events = await db.orm.public.Event.where({ status: 'PUBLISHED' }).all();
  const registrations = await db.orm.public.Registration.where({}).all();

  return <StaffAttendees events={events} allRegistrations={registrations} />;
}