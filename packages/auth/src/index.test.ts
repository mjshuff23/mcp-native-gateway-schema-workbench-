import { describe, expect, it } from 'vitest';
import { createDelegationGrant, InMemoryTokenVault, setPrimaryIdentityProvider } from './index';

describe('auth package', () => {
  it('exports auth primitives', () => {
    expect(typeof createDelegationGrant).toBe('function');
    expect(typeof setPrimaryIdentityProvider).toBe('function');
    expect(new InMemoryTokenVault()).toBeInstanceOf(InMemoryTokenVault);
  });
});
