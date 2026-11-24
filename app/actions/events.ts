'use server';

import { db } from '@/app/lib/db';
import { verifyStaffSession } from '@/app/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createEvent(data: any) {
  // ✅ Security Check
  const session = await verifyStaffSession();
  if (!session) return { error: 'Unauthorized. Please log in.' };

  if (new Date(data.endsAt) <= new Date(data.startsAt)) {
    return { error: 'End time must be after start time.' };
  }

  try {
    await db.orm.public.Event.create({
      title: data.title,
      description: data.description,
      venue: data.venue,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      capacity: parseInt(data.capacity),
      status: data.status,
    });
    revalidatePath('/');
    revalidatePath('/staff/events');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create event.' };
  }
}

export async function updateEvent(eventId: string, data: any) {
  // ✅ Security Check
  const session = await verifyStaffSession();
  if (!session) return { error: 'Unauthorized. Please log in.' };

  if (new Date(data.endsAt) <= new Date(data.startsAt)) {
    return { error: 'End time must be after start time.' };
  }

  // Check capacity constraint
  const confirmed = await db.orm.public.Registration.where({ eventId, status: 'CONFIRMED' }).all();
  if (parseInt(data.capacity) < confirmed.length) {
    return { error: `Cannot lower capacity below ${confirmed.length} (current registrations).` };
  }

  try {
    await db.orm.public.Event.where({ id: eventId }).update({
      title: data.title,
      description: data.description,
      venue: data.venue,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      capacity: parseInt(data.capacity),
      status: data.status,
    });
    revalidatePath('/');
    revalidatePath('/staff/events');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update event.' };
  }
}