import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import EventManager from './event-manager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
  const session = await verifyStaffSession();
  
  if (!session) redirect('/staff/login');
  // ✅ Protect the route
  if (session.role !== 'ORGANIZER') redirect('/staff/checkin');

  const events = await db.orm.public.Event.where({}).all();
  events.sort((a: any, b: any) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return <EventManager initialEvents={events} />;
}