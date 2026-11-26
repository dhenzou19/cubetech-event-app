'use server';

import { db } from '@/app/lib/db';

export async function cancelRegistration(registrationId: string) {
  const registration = await db.orm.public.Registration.where({ id: registrationId }).first();
  
  if (!registration) return { error: 'Registration not found.' };
  if (registration.status === 'CHECKED_IN') {
    return { error: 'Cannot cancel a ticket that is already checked in.' };
  }

  await db.orm.public.Registration.where({ id: registrationId }).update({
    status: 'CANCELLED'
  });

  // ✅ Audit Log
  await db.orm.public.AuditLog.create({
    action: 'CANCEL_REGISTRATION',
    details: `Cancelled ticket ${registration.ticketCode} (${registration.fullName})`,
    staffName: 'Attendee (Self-Service)',
  });

  return { success: true };
}