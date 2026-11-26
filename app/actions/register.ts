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

    const existingReg = await db.orm.public.Registration.where({ 
      eventId: event.id,
      email: data.email
    }).all();

    const activeReg = existingReg.find((r: any) => r.status === 'CONFIRMED' || r.status === 'WAITLISTED');

    if (activeReg) {
      return { error: 'This email is already registered or on the waitlist for this event.' };
    }

    // ✅ SECURE TICKET GENERATION (32 characters long)
    const randomStr = randomBytes(16).toString('hex').toUpperCase();
    const ticketCode = `TKT-${randomStr}`;

    await db.orm.public.Registration.create({
      eventId: event.id,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      ticketCode: ticketCode,
      status: isFull ? 'WAITLISTED' : 'CONFIRMED',
    });

    return { success: true, ticketCode };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}