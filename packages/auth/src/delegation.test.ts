import { describe, expect, it } from 'vitest';
import { createDelegationGrant } from './delegation';

describe('createDelegationGrant', () => {
  it('creates a short lived delegation grant', () => {
    const now = new Date('2026-05-09T00:00:00.000Z');
    const grant = createDelegationGrant(
      {
        userId: 'user_1',
        clientId: 'client_1',
        provider: 'github',
        resource: 'repo:mjshuff23/example',
        scopes: ['repo:read'],
        reason: 'Read schema files',
        ttlSeconds: 60,
      },
      now,
    );

    expect(grant.expiresAt.toISOString()).toBe('2026-05-09T00:01:00.000Z');
  });

  it('rejects non-positive ttl values', () => {
    expect(() =>
      createDelegationGrant({
        userId: 'user_1',
        clientId: 'client_1',
        provider: 'github',
        resource: 'repo:mjshuff23/example',
        scopes: ['repo:read'],
        reason: 'Read schema files',
        ttlSeconds: 0,
      }),
    ).toThrow('Delegation ttlSeconds must be positive');
  });
});
