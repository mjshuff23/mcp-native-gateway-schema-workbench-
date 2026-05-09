# Implementation Readiness

## Ready to Plan

The design is ready to become an implementation plan once Michael confirms the product wedge and first provider/source choices in `open-questions.md`.

## Recommended First Implementation PR

Title: `Scaffold monorepo contracts and foundation models`

Scope:

- Initialize pnpm/Nx TypeScript monorepo.
- Create app/package boundaries.
- Add local Compose for Postgres and Redis.
- Add initial database migration for identity, connection, client, delegation, audit, source, and schema snapshot tables.
- Add MCP gateway health/status endpoint.
- Add policy engine allow/deny/approval-required unit tests.

Non-goals:

- No React Flow workbench yet.
- No real provider OAuth yet.
- No 3D view.
- No tldraw workspace.
- No live GitHub/Notion/Linear sync.

## Suggested PR Sequence

1. Foundation monorepo and contracts.
2. Domain graph schema and snapshot/diff model.
3. Gateway capability registry and policy shell.
4. Repo scanner plus Prisma/SQL parser MVP.
5. React Flow read-only graph viewer.
6. Guarded command DSL and diff preview.
7. GitHub App connector.
8. Notion and Linear projections.
9. tldraw dashboard workspace.
10. Scale and threat-model hardening.

## What To Avoid

- Do not start with microservices.
- Do not start with 3D.
- Do not make DBML the internal source of truth.
- Do not use provider MCP servers as background sync engines.
- Do not expose raw provider tokens to agents or clients.
- Do not let the LLM write arbitrary frontend canvas state.
