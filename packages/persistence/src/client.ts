import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { loadWorkbenchEnv } from '@workbench/config';

export function createPgPool(connectionString = loadWorkbenchEnv().DATABASE_URL) {
  return new pg.Pool({ connectionString });
}

export function createDatabase(pool = createPgPool()) {
  return drizzle(pool);
}
