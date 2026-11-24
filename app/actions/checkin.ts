'use server';

import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';

export async function processCheckIn(eventId: string, ticketCode: string) {
  // 1. Verify the staff session
  const session = await verifyStaffSession();
  if (!session) return { status: 'invalid' as const };

  // 2. Find the registration matching the code AND the event
  const registration = await db.orm.public.Registration.where({ 
    ticketCode: ticketCode,
    eventId: eventId
  }).first();

  // 3. Invalid code or wrong event
  if (!registration) {
    return { status: 'invalid' as const, message: 'Ticket not found for this event.' };
  }

  // 4. Handle Cancelled tickets (Level 2 Requirement)
  if (registration.status === 'CANCELLED') {
    return { status: 'invalid' as const, message: 'This ticket has been cancelled.' };
  }

  // 5. Handle Waitlisted tickets (Future Level 2 Requirement)
  if (registration.status === 'WAITLISTED') {
    return { status: 'invalid' as const, message: 'This ticket is on the waitlist — not confirmed.' };
  }

  // 6. Check if already checked in
  if (registration.status === 'CHECKED_IN') {
    const timeString = new Date(registration.checkedInAt!).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'
    });
    return { 
      status: 'already' as const, 
      time: timeString 
    };
  }

  // 7. Success! Update the database
  await db.orm.public.Registration.where({ id: registration.id }).update({
    status: 'CHECKED_IN',
    checkedInAt: new Date()
  });

  return { 
    status: 'success' as const, 
    name: registration.fullName 
  };
}

// ... existing processCheckIn function ...

export async function undoCheckIn(registrationId: string) {
  const session = await verifyStaffSession();
  if (!session) return { error: 'Unauthorized' };

  await db.orm.public.Registration.where({ id: registrationId }).update({
    status: 'CONFIRMED',
    checkedInAt: null
  });

  return { success: true };
}