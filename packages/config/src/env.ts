import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

function findDotenvPath(startDir = process.cwd()): string | undefined {
  let currentDir = startDir;

  while (true) {
    const candidate = join(currentDir, '.env');
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return undefined;
    }

    currentDir = parentDir;
  }
}

loadDotenv({ path: findDotenvPath() });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4100),
  GATEWAY_PORT: z.coerce.number().int().positive().default(4200),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  POLICY_MODE: z.enum(['enforcing', 'permissive']).default('enforcing'),
  WORKBENCH_VERSION: z.string().default('0.1.0'),
});

export type WorkbenchEnv = z.infer<typeof envSchema>;

export function loadWorkbenchEnv(input: NodeJS.ProcessEnv = process.env): WorkbenchEnv {
  const parsed = envSchema.safeParse(input);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid workbench environment: ${details}`);
  }

  return parsed.data;
}
