'use server';

import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';

export async function cancelRegistration(registrationId: string) {
  const registration = await db.orm.public.Registration.where({ id: registrationId }).first();
  
  if (!registration) return { error: 'Registration not found.' };
  if (registration.status === 'CHECKED_IN') {
    return { error: 'Cannot cancel a ticket that is already checked in.' };
  }

  await db.orm.public.Registration.where({ id: registrationId }).update({
    status: 'CANCELLED'
  });

  return { success: true };
}