export type IdentityProvider = 'github' | 'google' | 'microsoft' | 'local';
export type WorkProvider = 'github' | 'google' | 'microsoft' | 'notion' | 'linear' | 'database';
export type ConnectionStatus = 'active' | 'revoked' | 'expired' | 'reauth_required';

export interface HubUser {
  id: string;
  workspaceId: string;
  displayName: string;
  primaryIdentityProvider: IdentityProvider;
}

export interface ExternalIdentity {
  id: string;
  userId: string;
  provider: IdentityProvider;
  providerSubjectId: string;
  email?: string;
  isPrimaryLogin: boolean;
}

export interface ProviderConnection {
  id: string;
  userId: string;
  provider: WorkProvider;
  scopes: string[];
  status: ConnectionStatus;
  expiresAt?: Date;
  revokedAt?: Date;
}

export interface ClientRegistration {
  id: string;
  userId: string;
  kind: 'web' | 'desktop' | 'vscode' | 'browser_extension' | 'agent' | 'local_mcp_client';
  name: string;
  publicKey?: string;
}
