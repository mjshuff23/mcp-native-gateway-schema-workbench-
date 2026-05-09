import { describe, expect, it } from 'vitest';
import { InMemoryCapabilityRegistry } from '@workbench/connector-sdk';
import { getGatewayStatus } from './status';

const testEnv = {
  NODE_ENV: 'test' as const,
  API_PORT: 4100,
  GATEWAY_PORT: 4200,
  DATABASE_URL: 'postgres://workbench:workbench@localhost:15432/workbench_dev',
  REDIS_URL: 'redis://localhost:63799',
  POLICY_MODE: 'enforcing' as const,
  WORKBENCH_VERSION: '0.1.0',
};

describe('getGatewayStatus', () => {
  it('reports separated capability counts', () => {
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

    expect(getGatewayStatus(registry, testEnv)).toMatchObject({
      name: 'mcp-native-gateway-schema-workbench',
      capabilities: {
        resources: 1,
        tools: 0,
        prompts: 0,
      },
    });
  });

  it('surfaces policyMode from env in permissive mode', () => {
    const registry = new InMemoryCapabilityRegistry();
    const status = getGatewayStatus(registry, { ...testEnv, POLICY_MODE: 'permissive' });
    expect(status.policyMode).toBe('permissive');
  });
});
