'use server';

import { db } from '@/app/lib/db';
import QRCode from 'qrcode';

export async function fetchTicketData(ticketCode: string) {
  const registration = await db.orm.public.Registration.where({ ticketCode }).first();
  if (!registration) return { error: 'Ticket not found' };

  const event = await db.orm.public.Event.where({ id: registration.eventId }).first();
  if (!event) return { error: 'Event not found' };

  // Generate QR (we won't show it if they are waitlisted, but we generate it anyway)
  const qrCodeDataUrl = await QRCode.toDataURL(registration.ticketCode, {
    width: 300, margin: 2, color: { dark: '#0f172a', light: '#ffffff' },
  });

  // Calculate Waitlist Position
  let waitlistPosition = 0;
  if (registration.status === 'WAITLISTED') {
    const allWaitlisted = await db.orm.public.Registration.where({ 
      eventId: event.id, 
      status: 'WAITLISTED' 
    }).all();
    
    // Sort by creation date to get the queue order
    allWaitlisted.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Find this person's position (1-based index)
    waitlistPosition = allWaitlisted.findIndex((r: any) => r.id === registration.id) + 1;
  }

  const startDate = new Date(event.startsAt);
  const endDate = new Date(event.endsAt);

  return {
    success: true,
    ticket: {
      id: registration.id,
      status: registration.status,
      waitlistPosition,
      fullName: registration.fullName,
      ticketCode: registration.ticketCode,
      eventTitle: event.title,
      venue: event.venue,
      dateStr: startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'Asia/Manila' }),
      timeStr: `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' })} — ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' })}`,
      qrCodeDataUrl
    }
  };
}