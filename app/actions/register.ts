'use server';

import { db } from '@/app/lib/db';
import { randomBytes } from 'crypto';

export async function registerAttendee(data: {
  eventId: string;
  fullName: string;
  email: string;
  mobile: string;
}) {
  try {
    const event = await db.orm.public.Event.where({ id: data.eventId }).first();
    if (!event) return { error: 'Event not found' };

    const registrations = await db.orm.public.Registration.where({ 
      eventId: event.id,
      status: 'CONFIRMED'
    }).all();

    const isFull = registrations.length >= event.capacity;

    // Check for existing active registration (Confirmed or Waitlisted)
    const existingReg = await db.orm.public.Registration.where({ 
      eventId: event.id,
      email: data.email
    }).all();

    const activeReg = existingReg.find((r: any) => r.status === 'CONFIRMED' || r.status === 'WAITLISTED');

    if (activeReg) {
      return { error: 'This email is already registered or on the waitlist for this event.' };
    }

    // Generate a unique ticket code
    const randomStr = randomBytes(3).toString('hex').toUpperCase();
    const ticketCode = `TKT-${randomStr}`;

    // Save to database (status depends on capacity)
    await db.orm.public.Registration.create({
      eventId: event.id,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      ticketCode: ticketCode,
      status: isFull ? 'WAITLISTED' : 'CONFIRMED', // <-- NEW LOGIC
    });

    return { success: true, ticketCode };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}