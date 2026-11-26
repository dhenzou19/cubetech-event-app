'use server';

import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';

export async function promoteWaitlist(registrationId: string, eventId: string) {
  // ✅ Assign session to a variable so we can use the staff name
  const session = await verifyStaffSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  const event = await db.orm.public.Event.where({ id: eventId }).first();
  if (!event) return { error: 'Event not found' };

  const confirmed = await db.orm.public.Registration.where({ eventId, status: 'CONFIRMED' }).all();
  
  if (confirmed.length >= event.capacity) {
    return { error: 'Cannot promote: Event is already at full capacity.' };
  }

  const registration = await db.orm.public.Registration.where({ id: registrationId }).first();

  await db.orm.public.Registration.where({ id: registrationId }).update({
    status: 'CONFIRMED'
  });

  // ✅ Correctly placed Audit Log
  await db.orm.public.AuditLog.create({
    action: 'PROMOTE_WAITLIST',
    details: `Promoted ${registration?.fullName} (${registration?.ticketCode}) from waitlist to confirmed.`,
    staffName: session.name as string || 'Staff',
  });
  
  return { success: true };
}