export type RiskLabel =
  | 'read_only'
  | 'write_graph'
  | 'write_file'
  | 'write_external'
  | 'network_reaching'
  | 'destructive'
  | 'credential_touching'
  | 'approval_required';

export type PolicyDecision =
  | { result: 'allow'; reason: string }
  | { result: 'deny'; reason: string }
  | { result: 'approval_required'; reason: string };

export interface PolicyInput {
  actorType: 'user' | 'agent' | 'extension' | 'system';
  action: string;
  riskLabels: RiskLabel[];
  requestedScopes: string[];
  grantedScopes: string[];
}

export function evaluatePolicy(input: PolicyInput): PolicyDecision {
  if (input.riskLabels.includes('credential_touching')) {
    return { result: 'deny', reason: 'Credential-touching actions are blocked in Phase 1' };
  }

  const missingScope = input.requestedScopes.find((scope) => !input.grantedScopes.includes(scope));
  if (missingScope) {
    return { result: 'deny', reason: `Missing granted scope ${missingScope}` };
  }

  if (
    input.riskLabels.includes('destructive') ||
    input.riskLabels.includes('write_file') ||
    input.riskLabels.includes('write_external') ||
    input.riskLabels.includes('approval_required')
  ) {
    return { result: 'approval_required', reason: 'Action requires explicit user approval' };
  }

  return { result: 'allow', reason: 'Action is permitted by Phase 1 policy' };
}
