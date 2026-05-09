# MCP Native Gateway Schema Workbench

A local-first, MCP-native schema workbench for turning repositories, databases, docs, tickets, and agent actions into one governed architecture graph.

The design target is not a single giant AI app. It is a three-plane system:

- **Ingestion plane:** mirrors GitHub, Notion, Linear, databases, and repo schema files into a canonical graph.
- **Interaction plane:** exposes that graph and selected actions through a curated MCP gateway with policy, delegation, and audit.
- **Visualization plane:** lets users inspect, edit, explain, and design schema systems through structured and freeform canvases.

## Current Phase

Design phase is complete enough to hand to implementation.

External handoff links:

- Notion handoff: https://www.notion.so/35bc2ea5f18f816ebf11cf05d7cbf2c1
- FigJam board: https://www.figma.com/board/2riHSM7ahz9OoHRTrq7zUE
- Linear project: https://linear.app/michaelshuff/project/mcp-native-gateway-schema-workbench-0a48ecf069a8
- GitHub phase issues: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues

Start here:

- [Design Status](docs/design/design-phase-status.md)
- [Architecture Plan](docs/design/architecture.md)
- [Implementation Phases](docs/design/implementation-phases.md)
- [Identity and Auth Model](docs/design/identity-and-auth.md)
- [Linear Phase Ticket Payloads](docs/tracker/linear-phase-tickets.md)
- [Figma Diagrams](docs/figma/diagrams.md)

## First Build Recommendation

Build a TypeScript modular monolith in a pnpm/Nx monorepo with these boundaries:

- `apps/web`
- `apps/api`
- `apps/gateway`
- `apps/worker`
- `apps/desktop` later
- `packages/domain-graph`
- `packages/connector-sdk`
- `packages/auth`
- `packages/agent-runtime`
- `packages/ui-schema`

Use PostgreSQL as the canonical store, add `pgvector` only inside the same Postgres system, and start with relational schemas before expanding to document, graph, and vector database facets.

## Non-Negotiables

- The canonical graph is the source of truth, not a diagram format.
- Native provider APIs and webhooks handle sync; third-party MCP servers are not the ingestion system of record.
- The gateway opens upstream MCP sessions lazily from a capability snapshot registry.
- The LLM proposes command DSL mutations; users approve diffs before files or external systems change.
- Provider refresh tokens never enter model context or extension runtimes.
