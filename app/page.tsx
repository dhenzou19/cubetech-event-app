import { db } from '@/app/lib/db';
import HomeClient from '@/components/HomeClient';
import { verifyStaffSession } from '@/app/lib/auth';

// ✅ Force no cache for the homepage
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export default async function Page() {
  const session = await verifyStaffSession();

  const dbEvents = await db.orm.public.Event.where({ status: 'PUBLISHED' }).all();
  const registrations = await db.orm.public.Registration.where({ status: 'CONFIRMED' }).all();

  const events = dbEvents.map((event: any) => {
    const startDate = new Date(event.startsAt);
    const endDate = new Date(event.endsAt);
    const isPast = endDate < new Date();
    const registeredCount = registrations.filter((r: any) => r.eventId === event.id).length;
    const spotsLeft = event.capacity - registeredCount;
    const isFull = spotsLeft <= 0;

    return {
      ...event,
      spotsLeft,
      isPast,
      isFull,
      month: startDate.toLocaleString('en-US', { month: 'short', timeZone: 'Asia/Manila' }).toUpperCase(),
      day: startDate.toLocaleString('en-US', { day: '2-digit', timeZone: 'Asia/Manila' }),
      dateStr: startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'Asia/Manila' }),
      timeStr: `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' })} — ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' })}`
    };
  });

  return <HomeClient initialEvents={events} isStaff={!!session} />;
}