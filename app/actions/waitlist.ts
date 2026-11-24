'use server';

import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';

export async function promoteWaitlist(registrationId: string, eventId: string) {
  // Direct check to avoid unused variable ESLint errors
  if (!(await verifyStaffSession())) {
    return { error: 'Unauthorized' };
  }

  // 1. Check event capacity
  const event = await db.orm.public.Event.where({ id: eventId }).first();
  if (!event) return { error: 'Event not found' };

  const confirmed = await db.orm.public.Registration.where({ eventId, status: 'CONFIRMED' }).all();
  
  if (confirmed.length >= event.capacity) {
    return { error: 'Cannot promote: Event is already at full capacity.' };
  }

  // 2. Promote the user
  await db.orm.public.Registration.where({ id: registrationId }).update({
    status: 'CONFIRMED'
  });

  return { success: true };
}