import { describe, expect, it } from 'vitest';
import { InMemoryAuditRepository } from './audit-repository';

describe('InMemoryAuditRepository', () => {
  it('records audit events', async () => {
    const repo = new InMemoryAuditRepository();

    await repo.record({
      workspaceId: 'workspace_1',
      actorType: 'agent',
      actorId: 'agent_1',
      action: 'read_gateway_status',
      riskLabel: 'read_only',
      policyResult: 'allow',
      result: 'success',
    });

    expect(repo.events).toHaveLength(1);
    expect(repo.events[0]?.action).toBe('read_gateway_status');
  });
});
