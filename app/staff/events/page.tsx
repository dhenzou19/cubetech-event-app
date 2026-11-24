import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import EventManager from './event-manager';

// ✅ THIS IS THE CRITICAL FIX (Page Caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export default async function EventsPage() {
  const session = await verifyStaffSession();
  if (!session) redirect('/staff/login');

  const events = await db.orm.public.Event.where({}).all();
  events.sort((a: any, b: any) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return <EventManager initialEvents={events} />;
}