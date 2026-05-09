# Linear Phase Ticket Payloads

Use these if the Linear connector stalls. Project name: `MCP Native Gateway Schema Workbench`.

## Project

Name: `MCP Native Gateway Schema Workbench`

Summary: Local-first, MCP-native schema workbench with a canonical schema graph, governed MCP gateway, identity/connection hub, visual schema editor, agent-guided diffs, and native GitHub/Notion/Linear projections.

Description:

Build a three-plane system: ingestion mirrors external systems into a canonical graph, interaction exposes governed graph resources and actions through an MCP gateway, and visualization supports structured schema editing plus later freeform dashboard/design views.

## Phase 1: Foundation, Contracts, Identity, and Gateway

Priority: High
Estimate: 8
Labels: `phase`, `architecture`, `mcp`, `auth`, `security`

Description:

Create the implementation skeleton and core trust boundaries.

Scope:

- pnpm/Nx TypeScript monorepo.
- API, gateway, worker, and web app skeletons.
- Domain graph, auth, connector SDK, agent runtime, and UI schema packages.
- PostgreSQL and Redis local Compose.
- Identity Hub model.
- Connection Vault abstraction.
- Client registry.
- Delegation broker model.
- MCP gateway shell as host and downstream server.
- Capability registry for tools, resources, prompts, completions, tasks, and policies.
- Policy engine MVP.
- Audit event write path.

Definition of done:

- Local dev stack boots.
- Typechecking and linting run from repo root.
- Database migrations create foundation tables.
- Gateway exposes a health/status resource.
- Policy engine can allow, deny, and require approval.
- Audit log records gateway decisions.

## Phase 2: Canonical Schema Graph and Repository Sync

Priority: High
Estimate: 13
Labels: `phase`, `schema`, `repo-sync`, `graph`, `github`

Description:

Make the canonical graph the product source of truth.

Scope:

- Canonical schema graph IR.
- Snapshot and diff model.
- Validation findings model.
- GitHub App connector design and first implementation shell.
- Repo file scanner.
- Prisma parser adapter.
- SQL migration parser adapter.
- DBML import/export adapter.
- MCP resources for graph, tables, relationships, snapshots, and diffs.

Definition of done:

- Repository scan can produce `schema.graph.json`.
- Graph snapshots are persisted and diffable.
- Broken relationship references create validation findings.
- MCP resources expose current graph and diffs.
- No parser mutates user-tracked schema files in place.

## Phase 3: Structured Visual Workbench and Guarded Agent Edits

Priority: High
Estimate: 13
Labels: `phase`, `frontend`, `llm`, `visualization`, `agent-safety`

Description:

Ship the usable schema editing loop.

Scope:

- React Flow schema editor.
- ELK layout integration.
- Table and relationship inspector panels.
- Collapse/expand and edge filtering.
- Command DSL for graph mutations.
- LLM chat assistant wired to local mirror retrieval.
- Diff preview before mutation.
- User approval gates.
- Undo/redo from command history.
- Yjs collaboration spike if time allows.

Definition of done:

- User can inspect and edit relational schema visually.
- User can ask for explanations of tables, relationships, and migrations.
- LLM can propose graph edits as deterministic commands.
- User can approve or reject proposed diffs.
- Approved edits update graph state and audit history.

## Phase 4: Native Provider Integrations and Dashboard Projections

Priority: Medium
Estimate: 13
Labels: `phase`, `integrations`, `github`, `notion`, `linear`, `dashboard`

Description:

Turn external systems into linked projections, not hidden sources of truth.

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
- Dashboard widgets render from canonical graph.
- External projections never become the internal source of truth.

## Phase 5: Freeform Design, 3D Exploration, and Scale Hardening

Priority: Medium
Estimate: 13
Labels: `phase`, `design`, `3d`, `performance`, `hardening`

Description:

Expand the product experience after the core loops are trustworthy.

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

## GitHub Issue Mirrors

Created GitHub phase issues:

- Phase 1: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues/1
- Phase 2: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues/2
- Phase 3: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues/3
- Phase 4: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues/4
- Phase 5: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues/5

## Linear Project and Created Issues

Created Linear project:

- MCP Native Gateway Schema Workbench: https://linear.app/michaelshuff/project/mcp-native-gateway-schema-workbench-0a48ecf069a8

Created Linear phase issues:

- TSH-64 Phase 1: https://linear.app/michaelshuff/issue/TSH-64/phase-1-foundation-contracts-identity-and-gateway
- TSH-65 Phase 2: https://linear.app/michaelshuff/issue/TSH-65/phase-2-canonical-schema-graph-and-repository-sync
- TSH-66 Phase 3: https://linear.app/michaelshuff/issue/TSH-66/phase-3-structured-visual-workbench-and-guarded-agent-edits
- TSH-67 Phase 4: https://linear.app/michaelshuff/issue/TSH-67/phase-4-native-provider-integrations-and-dashboard-projections
- TSH-68 Phase 5: https://linear.app/michaelshuff/issue/TSH-68/phase-5-freeform-design-3d-exploration-and-scale-hardening

Note: Linear's natural-language research endpoint and document creation endpoint were unavailable in this session, but direct project and issue creation worked.

## Phase 1 Development Breakdown

Status as of 2026-05-09:

- Active branch: `tsh-64-phase-1-foundation-contracts`
- GitHub phase issue: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues/1
- Linear parent issue: `TSH-64` moved to `In Progress`
- Linear project status: `In Progress`
- Agent plan: `docs/superpowers/plans/2026-05-09-phase-1-foundation-implementation.md`

Phase 1 child tickets:

- TSH-69 Phase 1A: Scaffold pnpm/Nx workspace and root tooling - https://linear.app/michaelshuff/issue/TSH-69/phase-1a-scaffold-pnpmnx-workspace-and-root-tooling
- TSH-70 Phase 1B: Create app and package skeletons - https://linear.app/michaelshuff/issue/TSH-70/phase-1b-create-app-and-package-skeletons
- TSH-71 Phase 1C: Add local Postgres, Redis, and environment contract - https://linear.app/michaelshuff/issue/TSH-71/phase-1c-add-local-postgres-redis-and-environment-contract
- TSH-72 Phase 1D: Create foundation database schema and migrations - https://linear.app/michaelshuff/issue/TSH-72/phase-1d-create-foundation-database-schema-and-migrations
- TSH-73 Phase 1E: Implement auth, connection vault, and delegation domain primitives - https://linear.app/michaelshuff/issue/TSH-73/phase-1e-implement-auth-connection-vault-and-delegation-domain
- TSH-74 Phase 1F: Implement policy engine MVP and audit write path - https://linear.app/michaelshuff/issue/TSH-74/phase-1f-implement-policy-engine-mvp-and-audit-write-path
- TSH-75 Phase 1G: Implement MCP gateway health and capability registry shell - https://linear.app/michaelshuff/issue/TSH-75/phase-1g-implement-mcp-gateway-health-and-capability-registry-shell
- TSH-76 Phase 1H: Wire verification, CI skeleton, and handoff docs - https://linear.app/michaelshuff/issue/TSH-76/phase-1h-wire-verification-ci-skeleton-and-handoff-docs

Figma note:

- Existing FigJam board remains the design surface: https://www.figma.com/board/2riHSM7ahz9OoHRTrq7zUE
- Current Figma MCP inspection/update is blocked by the Starter-plan tool-call limit, so this breakdown was synced through GitHub, Linear, Notion, and repo docs instead.
