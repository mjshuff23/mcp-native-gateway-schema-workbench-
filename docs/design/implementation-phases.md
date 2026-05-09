# Implementation Phases

## Phase 1: Foundation, Contracts, Identity, and Gateway

Goal: create the implementation skeleton and core trust boundaries.

Scope:

- pnpm/Nx TypeScript monorepo.
- `apps/api`, `apps/gateway`, `apps/worker`, `apps/web` skeletons.
- `packages/domain-graph`, `packages/auth`, `packages/connector-sdk`, `packages/agent-runtime`, `packages/ui-schema` skeletons.
- PostgreSQL and Redis in local Compose.
- Identity Hub domain model.
- Connection Vault abstraction.
- Client registry.
- Delegation broker model.
- MCP gateway shell as host and downstream server.
- Capability registry schema for tools, resources, prompts, completions, tasks, and policies.
- Policy engine MVP.
- Audit event write path.

Definition of done:

- Local dev stack boots.
- Typechecking and linting run from the repo root.
- Database migrations create foundation tables.
- Gateway exposes a health/status resource.
- Policy engine can allow, deny, and require approval.
- Audit log records gateway decisions.

## Phase 2: Canonical Schema Graph and Repository Sync

Goal: make the graph the product source of truth.

Scope:

- Canonical schema graph IR.
- Snapshot and diff model.
- Validation findings model.
- GitHub App connector design and first implementation stub.
- Repo file scanner.
- Prisma parser adapter.
- SQL migration parser adapter.
- DBML import/export adapter.
- MCP resources for graph, tables, relationships, snapshots, and diffs.

Definition of done:

- A repository scan can produce `schema.graph.json`.
- Graph snapshots are persisted and diffable.
- Broken relationship references create validation findings.
- MCP resources expose current graph and diffs.
- No parser mutates a user's tracked schema files in place.

## Phase 3: Structured Visual Workbench and Guarded Agent Edits

Goal: ship the usable schema editing loop.

Scope:

- React Flow schema editor.
- ELK layout integration.
- Table and relationship inspector panels.
- Collapse/expand and edge filtering.
- Command DSL for graph mutations.
- LLM chat assistant wired to retrieval from the local mirror.
- Diff preview before mutation.
- User approval gates.
- Undo/redo from command history.
- Yjs collaboration spike if time allows.

Definition of done:

- User can inspect and edit a relational schema graph visually.
- User can ask for explanations of tables, relationships, and migrations.
- LLM can propose graph edits as deterministic commands.
- User can approve or reject proposed diffs.
- Approved edits update graph state and audit history.

## Phase 4: Native Provider Integrations and Dashboard Projections

Goal: turn external systems into linked projections, not hidden sources of truth.

Scope:

- GitHub App install flow and webhook ingestion.
- Notion OAuth/public connection support and data-source-aware parsing.
- Linear OAuth, GraphQL sync, and webhooks.
- Project, cycle, repo, PR, doc, and source-health widgets.
- Notion documentation projection.
- Linear ticket creation from graph findings.
- GitHub issue/PR linkage for schema changes.

Definition of done:

- Provider sync jobs write graph-linked references.
- Webhooks verify, enqueue, acknowledge, and process async.
- Dashboard widgets render from the canonical graph.
- External projections never become the internal source of truth.

## Phase 5: Freeform Design, 3D Exploration, and Scale Hardening

Goal: expand the product experience after the core loops are trustworthy.

Scope:

- tldraw design/workspace tab.
- Dashboard composition with graph-backed widgets.
- 2.5D or 3D read-only exploration lens.
- Sigma.js large-graph exploration mode.
- Lazy upstream MCP activation for many connected servers.
- Rate-limit handling.
- Token refresh storm protection.
- SSRF hardening.
- Tool metadata and return sanitization.
- Load tests for one user with many sources.

Definition of done:

- Freeform boards can embed graph-backed widgets.
- Large graph exploration has a usable read-only mode.
- Gateway handles many registered capabilities without opening every upstream session.
- Revocation and audit explain who did what, through which client, and why.
