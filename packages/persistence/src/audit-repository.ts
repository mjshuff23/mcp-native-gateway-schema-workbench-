import type { RiskLabel } from '@workbench/auth';

export interface AuditEventInput {
  workspaceId: string;
  userId?: string;
  clientId?: string;
  workflowId?: string;
  actorType: 'user' | 'agent' | 'extension' | 'system';
  actorId: string;
  action: string;
  provider?: 'github' | 'google' | 'microsoft' | 'notion' | 'linear' | 'local' | 'database';
  resource?: string;
  riskLabel: RiskLabel;
  policyResult: 'allow' | 'deny' | 'approval_required';
  result: 'success' | 'failure' | 'blocked';
  metadata?: Record<string, unknown>;
}

export interface AuditRepository {
  record(event: AuditEventInput): Promise<void>;
}

export class InMemoryAuditRepository implements AuditRepository {
  readonly events: AuditEventInput[] = [];

  async record(event: AuditEventInput): Promise<void> {
    this.events.push(event);
  }
}
