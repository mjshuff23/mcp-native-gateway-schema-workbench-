# Alternatives and Decisions

This document records the close calls so future implementation agents understand why the design points where it does.

## Decision 1: Modular Monolith First

Recommendation: TypeScript modular monolith in a pnpm/Nx monorepo.

Why:

- Shared types matter more than network boundaries in the first build.
- The gateway, API, graph, and worker need to evolve together while contracts are still being discovered.
- A monorepo makes local-first development and agent handoff simpler.
- True hot paths can be split later based on traces.

Alternatives:

- **Microservices now:** clearer runtime boundaries, but slower iteration and more deployment overhead before the product shape is proven.
- **Desktop-first Tauri app:** good future packaging story, but forces local service orchestration decisions too early.
- **Python-heavy backend:** attractive for parsers/AI experiments, but the MCP TypeScript SDK and frontend/editor ecosystem make TypeScript the better center of gravity.

Decision trigger to revisit:

- Repo parsing or graph layout becomes CPU-bound enough to require isolated workers or a non-Node runtime.
- The desktop packaging experience becomes the core product differentiator rather than a delivery channel.

## Decision 2: Native API Sync Before Third-Party MCP Sync

Recommendation: native provider APIs and webhooks are the ingestion source of truth; MCP servers remain optional live/ad hoc action surfaces.

Why:

- Background sync needs retries, snapshots, idempotency, diffs, and predictable provider semantics.
- Provider webhooks should update the mirror without an LLM in the loop.
- The canonical graph should be queryable even when a provider MCP server is offline.

Alternatives:

- **Use provider MCP servers as ingestion:** less connector code initially, but weak control over freshness, retries, schema normalization, and auth audience boundaries.
- **Manual import only:** simpler MVP, but misses the core always-current workbench promise.

Decision trigger to revisit:

- An official provider MCP server exposes stronger sync semantics than the native API and webhook path.
- The product intentionally narrows to a single-user local toy where background freshness is not valuable.

## Decision 3: React Flow for Structured Editing, tldraw for Freeform Design

Recommendation: React Flow owns the canonical schema editor; tldraw owns the freeform design/workspace tab.

Why:

- Schema editing is graph-structured and benefits from custom nodes, edges, ports, layout, collapse, and inspectors.
- Freeform architecture boards and dashboards need a more expressive infinite canvas.
- Splitting the canvases prevents the schema editor from becoming a whiteboard with fragile hidden rules.

Alternatives:

- **All tldraw:** great creative surface, weaker fit for typed schema graph editing and deterministic relationship constraints.
- **All React Flow:** strong schema editor, but awkward for freeform visual briefs and dashboard composition.
- **Custom canvas:** maximum control, maximum time sink.

Decision trigger to revisit:

- The first product wedge becomes design whiteboarding rather than schema editing.
- React Flow performance fails under real expected graph sizes even after documented optimizations.

## Decision 4: Relational-First Canonical Graph

Recommendation: start with relational schemas, while designing the IR to grow into document, graph, vector, and key-value facets.

Why:

- Relational schemas provide the clearest visual MVP: tables, columns, indexes, constraints, relationships, migrations, diffs.
- Repo parsers and exports are easier to prove with Prisma, SQL migrations, DBML, and Postgres metadata.
- A universal database IR is dangerous if it tries to solve every database model before the product loop is real.

Alternatives:

- **All database types from day one:** impressive positioning, but too much ambiguity for a first implementation plan.
- **DBML as internal truth:** useful relational format, but too narrow for docs, tickets, dashboards, non-relational sources, and policy metadata.

Decision trigger to revisit:

- A target customer or portfolio demo specifically needs document or graph database support in the first build.

## Decision 5: BullMQ First, Temporal Later

Recommendation: start with BullMQ behind a `TaskEngine` interface, keep Temporal as the durable workflow upgrade path.

Why:

- Early jobs are likely repo scans, webhook processing, provider sync, graph extraction, and layout generation.
- Redis/BullMQ is simpler to run in local Compose.
- Temporal becomes valuable when workflows are long-running, human-in-the-loop, and require durable orchestration semantics.

Alternatives:

- **Temporal immediately:** powerful and correct for durable workflows, but heavier operationally for a seed repo.
- **Inline jobs only:** fast to scaffold, but violates webhook and sync reliability constraints.

Decision trigger to revisit:

- Provider sync flows become multi-hour, multi-step, or require durable human approval checkpoints.

## Decision 6: Command DSL for Agent Mutations

Recommendation: LLMs propose deterministic command DSL operations; the app validates and previews graph diffs before applying.

Why:

- Direct model mutation of React Flow/tldraw state would be brittle and unauditable.
- Commands create a stable unit for validation, undo/redo, conflict resolution, and tests.
- Commands make the same mutation path usable from chat, UI controls, and future automations.

Alternatives:

- **LLM writes raw files:** quick demo, high risk of stale context and destructive edits.
- **LLM writes frontend state:** fragile, hard to validate, and hard to reconcile with source files.
- **No LLM mutation:** safer, but misses the agentic product promise.

Decision trigger to revisit:

- The first implementation intentionally removes agentic writes and ships read-only explanation first.
