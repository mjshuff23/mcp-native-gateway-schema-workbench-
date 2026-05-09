export interface TokenSecretRef {
  connectionId: string;
  secretName: 'refresh_token' | 'access_token_cache';
}

export interface TokenVault {
  putSecret(ref: TokenSecretRef, plaintext: string): Promise<void>;
  getSecret(ref: TokenSecretRef): Promise<string | null>;
  deleteSecret(ref: TokenSecretRef): Promise<void>;
}

export class InMemoryTokenVault implements TokenVault {
  private readonly secrets = new Map<string, string>();

  putSecret(ref: TokenSecretRef, plaintext: string): Promise<void> {
    this.secrets.set(this.key(ref), plaintext);
    return Promise.resolve();
  }

  getSecret(ref: TokenSecretRef): Promise<string | null> {
    return Promise.resolve(this.secrets.get(this.key(ref)) ?? null);
  }

  deleteSecret(ref: TokenSecretRef): Promise<void> {
    this.secrets.delete(this.key(ref));
    return Promise.resolve();
  }

  private key(ref: TokenSecretRef): string {
    return `${ref.connectionId}:${ref.secretName}`;
  }
}
