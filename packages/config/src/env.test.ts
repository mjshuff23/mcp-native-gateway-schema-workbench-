import { describe, expect, it } from 'vitest';
import { loadWorkbenchEnv } from './env';

describe('loadWorkbenchEnv', () => {
  it('parses the shared Phase 1 environment contract', () => {
    expect(
      loadWorkbenchEnv({
        DATABASE_URL: 'postgres://workbench:workbench@localhost:15432/workbench_dev',
        REDIS_URL: 'redis://localhost:63799',
      }),
    ).toMatchObject({
      NODE_ENV: 'development',
      API_PORT: 4100,
      GATEWAY_PORT: 4200,
      POLICY_MODE: 'enforcing',
      WORKBENCH_VERSION: '0.1.0',
    });
  });

  it('reports missing required URLs', () => {
    expect(() => loadWorkbenchEnv({})).toThrow('Invalid workbench environment');
  });
});
