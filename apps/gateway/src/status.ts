import { evaluatePolicy } from '@workbench/auth';
import type { CapabilityRegistry } from '@workbench/connector-sdk';
import { loadWorkbenchEnv } from '@workbench/config';

export interface GatewayStatus {
  name: 'mcp-native-gateway-schema-workbench';
  version: string;
  policyMode: 'enforcing' | 'permissive';
  capabilities: {
    tools: number;
    resources: number;
    prompts: number;
    completions: number;
    tasks: number;
    policies: number;
  };
}

export function getGatewayStatus(registry: CapabilityRegistry): GatewayStatus {
  const env = loadWorkbenchEnv();
  const decision = evaluatePolicy({
    actorType: 'system',
    action: 'read_gateway_status',
    riskLabels: ['read_only'],
    requestedScopes: ['gateway:read'],
    grantedScopes: ['gateway:read'],
  });

  if (decision.result !== 'allow') {
    throw new Error(`Gateway status blocked by policy: ${decision.reason}`);
  }

  return {
    name: 'mcp-native-gateway-schema-workbench',
    version: env.WORKBENCH_VERSION,
    policyMode: env.POLICY_MODE,
    capabilities: {
      tools: registry.list('tool').length,
      resources: registry.list('resource').length,
      prompts: registry.list('prompt').length,
      completions: registry.list('completion').length,
      tasks: registry.list('task').length,
      policies: registry.list('policy').length,
    },
  };
}
