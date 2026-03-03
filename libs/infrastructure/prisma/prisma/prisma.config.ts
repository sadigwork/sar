// libs/prisma/prisma/prisma.config.ts
import { defineConfig } from 'prisma/config';
import process from 'process';
import 'dotenv/config';

export default defineConfig({
  schema: 'libs/prisma/prisma/schema.prisma',
  migrations: {
    path: 'libs/prisma/prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || '', // ✅ تعيين URL هنا
  },
});
