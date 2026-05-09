import { describe, expect, it } from 'vitest';
import { auditEvents, providerConnections, schemaSnapshots, users, workspaces } from './schema';

describe('foundation schema', () => {
  it('declares core foundation tables', () => {
    expect(workspaces).toBeDefined();
    expect(users).toBeDefined();
    expect(providerConnections).toBeDefined();
    expect(schemaSnapshots).toBeDefined();
    expect(auditEvents).toBeDefined();
  });
});
