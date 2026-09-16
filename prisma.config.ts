import { defineConfig } from '@prisma/config';
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

export default defineConfig({
  schema: 'prisma/schema.prisma'
});