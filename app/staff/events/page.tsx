import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import EventManager from './event-manager';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const session = await verifyStaffSession();
  if (!session) redirect('/staff/login');

  const events = await db.orm.public.Event.where({}).all();
  // Sort events by date
  events.sort((a: any, b: any) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return <EventManager initialEvents={events} />;
}