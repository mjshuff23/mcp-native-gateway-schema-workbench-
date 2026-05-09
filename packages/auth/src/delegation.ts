import { randomUUID } from 'node:crypto';
import type { WorkProvider } from './types';

export interface DelegationRequest {
  userId: string;
  clientId: string;
  provider: WorkProvider;
  resource: string;
  scopes: string[];
  reason: string;
  workflowId?: string;
  ttlSeconds: number;
}

export interface DelegationGrant extends DelegationRequest {
  id: string;
  expiresAt: Date;
  approvedAt?: Date;
}

export function createDelegationGrant(input: DelegationRequest, now = new Date()): DelegationGrant {
  if (input.ttlSeconds <= 0) {
    throw new Error('Delegation ttlSeconds must be positive');
  }

  return {
    ...input,
    id: randomUUID(),
    expiresAt: new Date(now.getTime() + input.ttlSeconds * 1000),
  };
}
