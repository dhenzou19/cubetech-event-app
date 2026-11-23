import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import path from 'path';

// 1. Read the compiled contract.json
const contractJson = JSON.parse(
  readFileSync(path.join(process.cwd(), 'prisma/contract.json'), 'utf-8')
);

// 2. Initialize the Prisma 8 client
const db = postgres({
  contract: contractFromJson(contractJson),
  url: process.env.DATABASE_URL!,
});

async function main() {
  console.log('🌱 Seeding database...');

  // 0. CLEAN SLATE: Delete existing data to prevent duplicate key errors
  // Prisma 8 syntax: .where({}).deleteAll() for bulk deletion
  console.log('🧹 Cleaning up old data...');
  await db.orm.public.Registration.where({}).deleteAll();
  await db.orm.public.Event.where({}).deleteAll();
  await db.orm.public.StaffUser.where({}).deleteAll();

  // 1. Create Staff Account
  // Prisma 8 syntax: .create() with fields directly, no 'data' wrapper
  const passwordHash = await bcrypt.hash('password123', 10);
  await db.orm.public.StaffUser.create({
    name: 'Demo Staff',
    username: 'staff1',
    passwordHash: passwordHash,
    role: 'ORGANIZER',
  });
  console.log('✅ Staff account created: staff1 / password123');

  // 2. Create Events
  // Prisma 8 syntax: .createAll() for bulk inserts
  await db.orm.public.Event.createAll([
    {
      id: 'event-1',
      title: 'Cebu Dev Meetup 2026',
      description: 'Join us for a night of networking, tech talks, and pizza with fellow developers in Cebu.',
      venue: 'Ayala Center Cebu, Function Room 2',
      startsAt: new Date('2026-12-15T18:00:00+08:00'), 
      endsAt: new Date('2026-12-15T21:00:00+08:00'),   
      capacity: 30,
      status: 'PUBLISHED',
    },
    {
      id: 'event-2',
      title: 'Full Stack Workshop',
      description: 'A hands-on workshop. (This event is already full to test the UI).',
      venue: 'Cebu Tech Hub',
      startsAt: new Date('2026-11-20T09:00:00+08:00'),
      endsAt: new Date('2026-11-20T17:00:00+08:00'),
      capacity: 2, 
      status: 'PUBLISHED',
    }
  ]);
  console.log('✅ Events created!');

  // 3. Seed fake registrations for Event 2
  await db.orm.public.Registration.createAll([
    { eventId: 'event-2', fullName: 'Juan Dela Cruz', email: 'juan@test.com', mobile: '09171234567', ticketCode: 'FULL-1', status: 'CONFIRMED' },
    { eventId: 'event-2', fullName: 'Maria Clara', email: 'maria@test.com', mobile: '09187654321', ticketCode: 'FULL-2', status: 'CONFIRMED' },
  ]);
  console.log('✅ Test registrations created!');
  
  console.log('🎉 Seeding complete!');
}

// Execute the function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });