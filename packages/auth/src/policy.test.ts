import { describe, expect, it } from 'vitest';
import { evaluatePolicy } from './policy';

describe('evaluatePolicy', () => {
  it('allows read-only actions with granted scopes', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'read_gateway_status',
        riskLabels: ['read_only'],
        requestedScopes: ['gateway:read'],
        grantedScopes: ['gateway:read'],
      }).result,
    ).toBe('allow');
  });

  it('denies missing scopes', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'read_gateway_status',
        riskLabels: ['read_only'],
        requestedScopes: ['gateway:read'],
        grantedScopes: [],
      }),
    ).toEqual({ result: 'deny', reason: 'Missing granted scope gateway:read' });
  });

  it('requires approval for destructive actions', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'delete_table',
        riskLabels: ['destructive'],
        requestedScopes: ['graph:write'],
        grantedScopes: ['graph:write'],
      }).result,
    ).toBe('approval_required');
  });

  it('blocks credential-touching actions', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'read_refresh_token',
        riskLabels: ['credential_touching'],
        requestedScopes: ['credential:read'],
        grantedScopes: ['credential:read'],
      }).result,
    ).toBe('deny');
  });
});
