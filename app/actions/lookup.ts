'use server';

import { db } from '@/app/lib/db';

export async function findTicket(ticketCode: string, email: string) {
  if (!ticketCode || !email) {
    return { error: 'Please enter both ticket code and email.' };
  }

  // Find registration matching BOTH the code and the email
  const registration = await db.orm.public.Registration.where({ 
    ticketCode: ticketCode.toUpperCase(),
    email: email.toLowerCase()
  }).first();

  // Security requirement: Do not reveal if the code exists but the email is wrong.
  if (!registration) {
    return { error: 'Ticket not found. Please check your code and email.' };
  }

  return { success: true, ticketCode: registration.ticketCode };
}