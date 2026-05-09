import { describe, expect, it } from 'vitest';
import { setPrimaryIdentityProvider } from './identity';
import type { ExternalIdentity, HubUser } from './types';

const user: HubUser = {
  id: 'user_1',
  workspaceId: 'workspace_1',
  displayName: 'Michael',
  primaryIdentityProvider: 'local',
};

const githubIdentity: ExternalIdentity = {
  id: 'identity_1',
  userId: 'user_1',
  provider: 'github',
  providerSubjectId: '123',
  email: 'michael@example.com',
  isPrimaryLogin: true,
};

describe('setPrimaryIdentityProvider', () => {
  it('sets a linked provider as primary login', () => {
    expect(
      setPrimaryIdentityProvider(user, [githubIdentity], 'github').primaryIdentityProvider,
    ).toBe('github');
  });

  it('rejects an unlinked provider', () => {
    expect(() => setPrimaryIdentityProvider(user, [], 'github')).toThrow(
      'Cannot set unlinked provider github as primary login',
    );
  });
});
