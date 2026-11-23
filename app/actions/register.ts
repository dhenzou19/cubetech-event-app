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
    // 1. Verify event exists and check capacity (Prisma 8 workaround)
    const event = await db.orm.public.Event.where({ id: data.eventId }).first();
    if (!event) return { error: 'Event not found' };

    const registrations = await db.orm.public.Registration.where({ 
      eventId: event.id,
      status: 'CONFIRMED'
    }).all();

    if (registrations.length >= event.capacity) {
      return { error: 'Sorry, this event is already full.' };
    }

    // 2. Check for duplicate email for this event
    const existingReg = await db.orm.public.Registration.where({ 
      eventId: event.id,
      email: data.email,
      status: 'CONFIRMED'
    }).first();

    if (existingReg) {
      return { error: 'This email is already registered for this event.' };
    }

    // 3. Generate a unique ticket code (e.g., TKT-X8F9A2)
    const randomStr = randomBytes(3).toString('hex').toUpperCase();
    const ticketCode = `TKT-${randomStr}`;

    // 4. Save to database
    await db.orm.public.Registration.create({
      eventId: event.id,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      ticketCode: ticketCode,
      status: 'CONFIRMED'
    });

    return { success: true, ticketCode };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}