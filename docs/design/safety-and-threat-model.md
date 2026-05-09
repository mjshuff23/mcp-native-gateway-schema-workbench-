# Safety and Threat Model

## Product Rule

The Hub is not a bag of tokens. It is a policy-enforced delegation system.

## Assets Worth Protecting

- Provider refresh tokens
- Provider access tokens
- Hub sessions
- Client credentials
- Schema graph snapshots
- Source repository contents
- Notion documents
- Linear projects/issues
- Audit history
- User approval state

## Threats

### Token Leakage

Risk: raw provider tokens enter browser storage, extension runtimes, logs, or model context.

Controls:

- Store refresh tokens encrypted server-side or in OS keychain for local mode.
- Give clients short-lived internal delegation tokens only.
- Redact tokens in logs.
- Never send provider tokens to the LLM.

### Tool Poisoning

Risk: upstream MCP tool descriptions or tool returns contain prompt injection or malicious instructions.

Controls:

- Treat tool metadata and tool returns as untrusted.
- Keep read and write tool families separate.
- Sanitize tool returns before reintroducing them into model context.
- Show high-risk tool calls to users before execution.

### Pass-Through Token Confusion

Risk: gateway forwards a token with the wrong audience or treats a session ID as authentication.

Controls:

- Audience-bound tokens only.
- Hub sessions bind to user and client identity.
- Upstream provider calls happen server-side through the broker.
- Do not forward opaque upstream credentials downstream.

### SSRF and OAuth Discovery Abuse

Risk: malicious metadata or provider configuration causes the system to fetch internal resources.

Controls:

- Allowlist provider domains for managed connectors.
- Block private IP ranges and link-local addresses.
- Validate redirect URIs.
- Store discovered metadata with source and review status.

### Destructive Mutation

Risk: model or user accidentally deletes tables, relationships, files, or external tickets.

Controls:

- Command DSL validates intent.
- Diff preview required before mutation.
- Explicit approval for destructive operations.
- Undo/redo for graph state.
- File writes go through adapters with backup/snapshot references.

### Webhook Forgery

Risk: attacker posts fake GitHub/Notion/Linear webhook payloads.

Controls:

- Verify signatures where supported.
- Use secret headers for webhook-action systems that do not authenticate the send action.
- Store raw envelope hashes.
- Reject replayed delivery IDs when possible.

## Risk Labels

Every action should be labeled before policy evaluation.

```text
read_only
write_graph
write_file
write_external
network_reaching
destructive
credential_touching
approval_required
```

## Approval Levels

- **Silent allow:** low-risk read from local mirror.
- **Inline allow:** low-risk local graph change with undo.
- **Explicit approval:** file write, external write, destructive graph mutation, broad provider read.
- **Blocked:** credential exfiltration, token access, untrusted network target, policy violation.

## Audit Event Shape

```text
actor_type
actor_id
user_id
client_id
workflow_id
action
risk_label
provider
resource
policy_result
approval_id
result
created_at
```
