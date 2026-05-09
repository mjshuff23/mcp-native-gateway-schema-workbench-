import { describe, expect, it } from 'vitest';
import { InMemoryCapabilityRegistry } from '@workbench/connector-sdk';
import { getGatewayStatus } from './status';

describe('getGatewayStatus', () => {
  it('reports separated capability counts', () => {
    process.env.DATABASE_URL = 'postgres://workbench:workbench@localhost:15432/workbench_dev';
    process.env.REDIS_URL = 'redis://localhost:63799';
    process.env.WORKBENCH_VERSION = '0.1.0';
    process.env.POLICY_MODE = 'enforcing';

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

    expect(getGatewayStatus(registry)).toMatchObject({
      name: 'mcp-native-gateway-schema-workbench',
      capabilities: {
        resources: 1,
        tools: 0,
        prompts: 0,
      },
    });
  });
});
