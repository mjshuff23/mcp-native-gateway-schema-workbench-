# Identity and Auth Model

## Product Principle

Build an Identity + Connection Hub, not a magic universal OAuth token.

The user should sign into the Hub once, choose a primary login provider, link provider accounts, and let apps/agents/extensions ask the Hub for scoped delegated access.

## User Experience

First-run onboarding:

1. Choose primary Hub sign-in provider: GitHub, Google, Microsoft, or passkey later.
2. Confirm whether that provider should be the default sign-in method.
3. Link useful work providers: GitHub repos, Google Calendar/Drive, Notion workspace, Linear workspace.
4. Review scopes before consent.
5. Land in a connection dashboard showing identities, provider grants, clients, and revocation controls.

## Technical Correction

Primary provider means:

> Use this provider to authenticate the user into the Hub.

It does not mean:

> Use this provider's token to access every other provider.

GitHub tokens cannot become Google tokens. Google tokens cannot become Notion tokens. The Hub unifies identity and stores consented provider grants separately.

## Core Domain Model

```text
users
  id
  display_name
  primary_identity_provider
  created_at

external_identities
  id
  user_id
  provider
  provider_subject_id
  email
  is_primary_login
  linked_at

provider_connections
  id
  user_id
  provider
  connection_type
  scopes
  status
  encrypted_refresh_token
  encrypted_access_token_cache
  expires_at
  revoked_at

clients
  id
  user_id
  kind
  name
  public_key
  last_seen_at

delegations
  id
  user_id
  client_id
  provider
  resource
  scopes
  reason
  workflow_id
  expires_at
  approved_at

audit_events
  id
  user_id
  actor_type
  actor_id
  action
  provider
  resource
  result
  created_at
```

## Delegation Flow

```text
Client or agent asks for action
        ↓
Hub verifies user session and client identity
        ↓
Policy engine checks provider, resource, scope, risk, and workflow
        ↓
User approves if risk requires it
        ↓
Hub issues short-lived internal delegation token
        ↓
Gateway uses stored provider grant server-side
        ↓
Provider result is sanitized and audited
```

## Revocation Model

- Revoke user session: kills Hub sessions.
- Revoke provider connection: disables the linked provider grant.
- Revoke client: blocks VS Code, desktop, browser extension, or agent client access.
- Revoke workflow: stops a single agent chain or job.
- Revoke project/workspace: prevents cross-project permission drift.

## Phase 1 Auth Scope

Phase 1 should implement the shape and safe boundaries, not every provider.

Minimum viable slice:

- One local user model.
- Primary provider preference field.
- One linked provider connection stub.
- Encrypted token vault abstraction.
- Client registry model.
- Delegation request model.
- Audit event model.
- Policy checks for allow, deny, and approval-required.

## Explicit Non-Goals

- Do not bypass provider consent.
- Do not share raw refresh tokens with extensions or agents.
- Do not let a primary provider imply all-provider access.
- Do not store provider secrets in browser local storage.
- Do not expose broad write scopes by default.
