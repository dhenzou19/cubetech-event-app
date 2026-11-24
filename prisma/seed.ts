import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import bcrypt from 'bcryptjs';
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
  console.log('🌱 Seeding database...');

  console.log('🧹 Cleaning up old data...');
  await db.orm.public.Registration.where({}).deleteAll();
  await db.orm.public.Event.where({}).deleteAll();
  await db.orm.public.StaffUser.where({}).deleteAll();

  // 1. Create DEMO Staff Account (For the Reviewer)
  const demoHash = await bcrypt.hash('password123', 10);
  await db.orm.public.StaffUser.create({
    name: 'Demo Organizer',
    username: 'demo',
    passwordHash: demoHash,
    role: 'STAFF',
  });
  console.log('✅ Demo account created: demo / password123');

  // 2. Create PERSONAL Staff Account (For You)
  const adminHash = await bcrypt.hash('dd09090709977', 10);
  await db.orm.public.StaffUser.create({
    name: 'Dhenmarc Admin',
    username: 'admin',
    passwordHash: adminHash,
    role: 'ORGANIZER',
  });
  console.log('✅ Personal account created: admin / dd09090709977');

  // 3. Create Events
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

  // 4. Seed Fake Registrations for the Full Event
  await db.orm.public.Registration.createAll([
    { eventId: 'event-2', fullName: 'Juan Dela Cruz', email: 'juan@test.com', mobile: '09171234567', ticketCode: 'FULL-1', status: 'CONFIRMED' },
    { eventId: 'event-2', fullName: 'Maria Clara', email: 'maria@test.com', mobile: '09187654321', ticketCode: 'FULL-2', status: 'CONFIRMED' },
  ]);

  console.log('🎉 Seeding complete!');
}

main().catch((e) => { console.error(e); process.exit(1); });