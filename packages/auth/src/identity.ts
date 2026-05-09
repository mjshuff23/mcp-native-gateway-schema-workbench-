import type { ExternalIdentity, HubUser, IdentityProvider } from './types';

export function setPrimaryIdentityProvider(
  user: HubUser,
  identities: ExternalIdentity[],
  provider: IdentityProvider,
): HubUser {
  const linked = identities.some(
    (identity) => identity.provider === provider && identity.userId === user.id,
  );

  if (!linked && provider !== 'local') {
    throw new Error(`Cannot set unlinked provider ${provider} as primary login`);
  }

  return { ...user, primaryIdentityProvider: provider };
}
