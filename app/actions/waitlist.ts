'use server';

import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';

export async function promoteWaitlist(registrationId: string, eventId: string) {
  const session = await verifyStaffSession();
  if (!session) return { error: 'Unauthorized' };

  // 1. Check event capacity
  const event = await db.orm.public.Event.where({ id: eventId }).first();
  const confirmed = await db.orm.public.Registration.where({ eventId, status: 'CONFIRMED' }).all();
  
  if (confirmed.length >= event.capacity) {
    return { error: 'Event is already at full capacity.' };
  }

  // 2. Promote the user
  await db.orm.public.Registration.where({ id: registrationId }).update({
    status: 'CONFIRMED'
  });

  return { success: true };
}