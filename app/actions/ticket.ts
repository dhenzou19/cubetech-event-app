'use server';

import { db } from '@/app/lib/db';
import QRCode from 'qrcode';

export async function fetchTicketData(ticketCode: string) {
  const registration = await db.orm.public.Registration.where({ ticketCode }).first();
  if (!registration) return { error: 'Ticket not found' };

  const event = await db.orm.public.Event.where({ id: registration.eventId }).first();
  if (!event) return { error: 'Event not found' };

  const qrCodeDataUrl = await QRCode.toDataURL(registration.ticketCode, {
    width: 300,
    margin: 2,
    color: { dark: '#0f172a', light: '#ffffff' },
  });

  const startDate = new Date(event.startsAt);
  const endDate = new Date(event.endsAt);

  return {
    success: true,
    ticket: {
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