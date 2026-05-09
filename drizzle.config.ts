import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './packages/persistence/src/schema.ts',
  out: './packages/persistence/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://workbench:workbench@localhost:15432/workbench_dev',
  },
});
