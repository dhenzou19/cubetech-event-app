'use server';

import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';

export async function processCheckIn(eventId: string, ticketCode: string) {
  const session = await verifyStaffSession();
  if (!session) return { status: 'invalid' as const };

  const registration = await db.orm.public.Registration.where({ 
    ticketCode: ticketCode,
    eventId: eventId
  }).first();

  if (!registration) {
    return { status: 'invalid' as const, message: 'Ticket not found for this event.' };
  }

  if (registration.status === 'CANCELLED') {
    return { status: 'invalid' as const, message: 'This ticket has been cancelled.' };
  }

  if (registration.status === 'WAITLISTED') {
    return { status: 'invalid' as const, message: 'This ticket is on the waitlist — not confirmed.' };
  }

  if (registration.status === 'CHECKED_IN') {
    const timeString = new Date(registration.checkedInAt!).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'
    });
    return { status: 'already' as const, time: timeString };
  }

  await db.orm.public.Registration.where({ id: registration.id }).update({
    status: 'CHECKED_IN',
    checkedInAt: new Date()
  });

  // ✅ Correctly placed Audit Log
  await db.orm.public.AuditLog.create({
    action: 'CHECK_IN',
    details: `Checked in ${registration.fullName} (${registration.ticketCode})`,
    staffName: session.name as string || 'Staff',
  });

  return { status: 'success' as const, name: registration.fullName };
}

export async function undoCheckIn(registrationId: string) {
  const session = await verifyStaffSession();
  if (!session) return { error: 'Unauthorized' };

  // Fetch registration to get the name for the log
  const registration = await db.orm.public.Registration.where({ id: registrationId }).first();

  await db.orm.public.Registration.where({ id: registrationId }).update({
    status: 'CONFIRMED',
    checkedInAt: null
  });

  // ✅ Correctly placed Audit Log for Undo
  await db.orm.public.AuditLog.create({
    action: 'UNDO_CHECK_IN',
    details: `Undid check-in for ${registration?.fullName} (${registration?.ticketCode})`,
    staffName: session.name as string || 'Staff',
  });
  
  return { success: true };
}