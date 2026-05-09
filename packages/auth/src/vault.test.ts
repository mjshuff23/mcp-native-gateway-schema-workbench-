import { describe, expect, it } from 'vitest';
import { InMemoryTokenVault } from './vault';

describe('InMemoryTokenVault', () => {
  it('stores and deletes secrets behind refs', async () => {
    const vault = new InMemoryTokenVault();
    const ref = { connectionId: 'connection_1', secretName: 'refresh_token' as const };

    await vault.putSecret(ref, 'secret-value');
    expect(await vault.getSecret(ref)).toBe('secret-value');

    await vault.deleteSecret(ref);
    expect(await vault.getSecret(ref)).toBeNull();
  });
});
