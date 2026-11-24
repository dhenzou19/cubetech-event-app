import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import StaffCheckInForm from './checkin-form';

export const dynamic = 'force-dynamic';

export default async function CheckInPage() {
  const session = await verifyStaffSession();
  if (!session) redirect('/staff/login');

  const events = await db.orm.public.Event.where({ status: 'PUBLISHED' }).all();

  return <StaffCheckInForm events={events} />;
}