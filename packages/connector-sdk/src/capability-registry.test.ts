import { describe, expect, it } from 'vitest';
import { InMemoryCapabilityRegistry } from './capability-registry';

describe('InMemoryCapabilityRegistry', () => {
  it('lists capabilities by kind', () => {
    const registry = new InMemoryCapabilityRegistry();

    registry.upsert({
      id: 'gateway.status.resource',
      kind: 'resource',
      namespace: 'gateway',
      name: 'status',
      title: 'Gateway Status',
      description: 'Current gateway health and capability counts',
      riskLabels: ['read_only'],
      discoveredAt: '2026-05-09T00:00:00.000Z',
    });

    expect(registry.list('resource')).toHaveLength(1);
    expect(registry.list('tool')).toHaveLength(0);
  });
});
