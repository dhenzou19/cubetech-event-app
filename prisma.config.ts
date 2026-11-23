import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: 'prisma/contract.prisma', // <-- This tells Prisma to use contract.prisma!
    db: {
      connection: process.env.DATABASE_URL!,
    },
  }),
});