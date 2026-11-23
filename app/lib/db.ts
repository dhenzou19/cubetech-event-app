import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import { readFileSync } from 'fs';
import path from 'path';

// Read the compiled contract.json
const contractJson = JSON.parse(
  readFileSync(path.join(process.cwd(), 'prisma/contract.json'), 'utf-8')
);

// Prevent multiple instances during Next.js hot-reloads in development
const globalForPrisma = globalThis as unknown as { db: any };

export const db =
  globalForPrisma.db ||
  postgres({
    contract: contractFromJson(contractJson),
    url: process.env.DATABASE_URL!,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;