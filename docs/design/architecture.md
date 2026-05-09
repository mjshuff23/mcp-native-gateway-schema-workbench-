# Architecture Plan

## Target State

MCP Native Gateway Schema Workbench is a three-plane system.

```text
External systems and repositories
        ↓
Ingestion plane: connectors, webhooks, repo parsers, DB introspection, workers
        ↓
Canonical schema graph: snapshots, diffs, policy metadata, audit records
        ↓
Interaction plane: MCP gateway, API, agent runtime, delegation broker
        ↓
Visualization plane: schema editor, design workspace, dashboards, exploration views
```

The product should not depend on third-party MCP servers as its ingestion source of truth. Native APIs and webhooks mirror provider state into the canonical graph. MCP exposes that graph and selected actions through a governed interface.

## Delivery Model

Build a TypeScript modular monolith first.

Recommended repo shape:

```text
apps/
  api/
  gateway/
  web/
  worker/
  desktop/        # later Tauri shell, not phase 1
packages/
  agent-runtime/
  auth/
  connector-sdk/
  domain-graph/
  ui-schema/
```

Use pnpm workspaces and Nx task pipelines so the first version has shared types and fast local iteration without premature service boundaries.

Primary runtime choices:

- TypeScript for app, API, gateway, workers, connectors, and agent runtime.
- PostgreSQL as the canonical durable store.
- `pgvector` inside Postgres for early semantic retrieval.
- Redis/BullMQ for early jobs; preserve a `TaskEngine` interface so Temporal can replace hot workflow paths later.
- Docker Compose for local development.
- Tauri only after the local web/app service shape is stable.

## Ingestion Plane

The ingestion plane mirrors durable external state into the canonical graph.

Responsibilities:

- Verify and acknowledge webhooks quickly.
- Queue background sync jobs.
- Parse repository files and schema sources.
- Introspect live databases.
- Normalize provider data into graph entities.
- Persist snapshots and diffs.

Provider strategy:

- **GitHub:** GitHub App for durable repo/org access, GraphQL for metadata, REST for content/file reads, webhooks for events.
- **Notion:** OAuth/public connections if external users exist, data-source-aware database parsing, synced databases only as outbound projections.
- **Linear:** OAuth 2.0, GraphQL sync, webhooks for projects/issues/documents/cycles, issue/project widgets linked back to graph nodes.

Webhook rule:

```text
verify → enqueue → acknowledge → process asynchronously
```

## Canonical Graph

The canonical graph is the source of truth. DBML, Prisma, SQL, Atlas plans, diagrams, and dashboards are projections or adapters.

Initial graph entities:

- Workspace
- User
- External identity
- Provider connection
- Source repository
- Source file
- Schema object
- Table
- Column
- Index
- Constraint
- Relationship
- Migration
- Snapshot
- Diff
- Validation finding
- Document reference
- Ticket reference
- Dashboard widget
- View
- Audit event

Start relational-first and leave room for document, graph, vector, and key-value facets once the core loops are stable.

## Interaction Plane

The MCP gateway acts as both host and server.

Upstream responsibilities:

- Maintain one MCP client per active server session.
- Store capability snapshots for tools, resources, prompts, tasks, completions, and policies.
- Open upstream sessions lazily only when freshness or a live action requires it.
- Support Streamable HTTP for remote servers and stdio for trusted local sidecars.

Downstream responsibilities:

- Expose a curated MCP server surface to the app's agent runtime and optional external clients.
- Separate resources, tools, prompts, completions, and tasks rather than flattening everything into a generic capability blob.
- Enforce policy before action.
- Record audit events after every allowed or denied action.

Gateway rule:

```text
LLM suggests. Gateway checks. Policy approves. Audit records.
```

## Visualization Plane

Primary structured editor:

- React Flow for schema graph editing.
- ELK layout for layered and orthogonal layouts.
- Yjs for shared state and collaboration.
- Undo/redo from command history.
- Collapse/expand and edge filtering for large diagrams.

Freeform design workspace:

- tldraw for architecture scenes, dashboards, whiteboards, and LLM-assisted visual briefs.
- Widgets project canonical graph state into freeform dashboards.

Exploration layer:

- 2.5D/3D with Three.js or Babylon.js after the editor is stable.
- Sigma.js for very large read-only graph views.

## Agent Runtime

The model should not mutate frontend state directly. It proposes command DSL operations against the graph.

Example commands:

```text
create_table
add_field
set_fk
move_node
group_tables
import_repo_schema
open_linear_issue
publish_notion_summary
```

Mutation flow:

```text
User intent
  ↓
Retrieve from local mirror
  ↓
LLM proposes command DSL
  ↓
Graph validates command
  ↓
Policy checks risk and scope
  ↓
User reviews structured diff
  ↓
Worker applies mutation
  ↓
Audit event records outcome
```

## Safety Model

Treat tools, metadata, and tool returns as untrusted. Safety is enforced in code, not in prompt wording.

Controls:

- No provider refresh tokens in model context.
- No raw provider tokens exposed to extensions.
- Read and write capability families are separated.
- Destructive actions require explicit user approval.
- OAuth tokens remain audience-bound.
- Webhook payloads are verified before processing.
- External URL fetches and OAuth discovery are SSRF-guarded.
- Tool return text is sanitized before reuse in model context.

## Source References

- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- MCP TypeScript SDK server docs: https://ts.sdk.modelcontextprotocol.io/documents/server.html
- GitHub Apps vs OAuth apps: https://docs.github.com/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps
- Notion 2025-09-03 API upgrade guide: https://developers.notion.com/docs/upgrade-guide-2025-09-03
- Linear API docs: https://linear.app/docs/api/
- Linear webhooks: https://linear.app/developers/webhooks
