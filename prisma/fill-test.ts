import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import { readFileSync } from 'fs';
import path from 'path';

const contractJson = JSON.parse(
  readFileSync(path.join(process.cwd(), 'prisma/contract.json'), 'utf-8')
);

const db = postgres({
  contract: contractFromJson(contractJson),
  url: process.env.DATABASE_URL!,
});

async function main() {
  console.log('🧹 Cleaning up old dummy data...');
  // Delete previous dummy data to avoid conflicts
  const oldDummies = await db.orm.public.Registration.where({ email: 'dummy@test.com' }).all();
  for (const reg of oldDummies) {
    await db.orm.public.Registration.where({ id: reg.id }).delete();
  }

  console.log('Fetching event...');
  const event = await db.orm.public.Event.where({ id: 'event-1' }).first();
  if (!event) return console.log('Event not found');

  console.log('Generating dummy registrations...');
  const dummyRegs = [];
  
  // We need to fill the event to capacity (30) + add 3 waitlisted
  // Assuming you already have ~18, we will generate 15 more to be safe.
  for (let i = 1; i <= 15; i++) {
    dummyRegs.push({
      eventId: event.id,
      fullName: `Dummy User ${i}`,
      email: `dummy@test.com`,
      mobile: `091700000${i.toString().padStart(2, '0')}`,
      ticketCode: `TKT-DUMMY${i}`,
      status: i <= 12 ? 'CONFIRMED' : 'WAITLISTED', // First 12 confirmed, last 3 waitlisted
    });
  }

  await db.orm.public.Registration.createAll(dummyRegs);
  
  console.log('✅ Successfully injected dummy data!');
  console.log('Waitlist ticket codes to test:');
  console.log(' - TKT-DUMMY13 (Position #1)');
  console.log(' - TKT-DUMMY14 (Position #2)');
  console.log(' - TKT-DUMMY15 (Position #3)');
}

main().catch(console.error);