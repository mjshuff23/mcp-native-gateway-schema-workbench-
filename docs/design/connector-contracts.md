# Connector Contracts

## Connector Responsibilities

Each native connector mirrors provider state into the canonical graph and exposes provider-specific actions through governed app services.

Connectors do not own product truth. They contribute source records, references, snapshots, jobs, and events.

## Common Connector Interface

```ts
export interface Connector {
  provider: ProviderName;
  getConnectionStatus(connectionId: string): Promise<ConnectionStatus>;
  refreshConnection(connectionId: string): Promise<ConnectionStatus>;
  sync(input: SyncInput): Promise<SyncResult>;
  handleWebhook(event: VerifiedWebhookEvent): Promise<EnqueueResult>;
  revoke(connectionId: string): Promise<RevocationResult>;
}
```

## Webhook Ingress Contract

Webhook receivers must stay thin.

```text
receive request
  ↓
verify signature or shared secret
  ↓
normalize minimal envelope
  ↓
write webhook_events row
  ↓
enqueue sync job
  ↓
return 2xx quickly
```

No inline graph mutation unless the provider requires immediate challenge-response verification.

## GitHub Connector

Recommended auth:

- GitHub App for durable repository and organization access.
- OAuth user token only for user-on-behalf actions that require it.

Mirrored objects:

- Repository
- Branch
- Commit
- Pull request
- Issue
- Label
- File metadata
- Schema/migration file contents
- Webhook delivery

Graph links:

- Source repository to schema snapshot.
- Source file to schema object source references.
- Issue/PR to schema diff or validation finding.

## Notion Connector

Recommended auth:

- Public OAuth connection if this leaves a personal workspace.
- Internal integration acceptable for personal/local-only mode.

Mirrored objects:

- Workspace/page references
- Databases
- Data sources
- Docs and decision pages
- Comments where useful
- Webhook/action events

Important API shape:

- Treat data sources as first-class. Do not assume a database ID alone identifies the schema for multi-source databases.

Graph links:

- Document references to schema objects, decisions, snapshots, and implementation phases.
- Optional outbound projection pages generated from canonical graph state.

## Linear Connector

Recommended auth:

- OAuth 2.0 for user-scoped access.
- GraphQL API for sync.
- Webhooks for issue/project/document/cycle updates.

Mirrored objects:

- Projects
- Issues
- Comments
- Documents
- Cycles
- Labels
- Status updates

Graph links:

- Schema findings can create Linear issues.
- Phase tickets link to implementation docs and FigJam diagrams.
- Project/cycle widgets show implementation state from graph-linked Linear data.

## Failure Handling

Connector jobs should record:

- `last_success_at`
- `last_failure_at`
- `failure_reason`
- `retry_count`
- `next_retry_at`
- `rate_limit_reset_at` if known

Dashboard status:

- Healthy
- Degraded
- Reauth required
- Rate limited
- Webhook failing
- Permission drift detected
