# Phase 1 Handoff

## Implemented Boundaries

- Workspace tooling and Nx project graph.
- App shells: API, gateway, worker, web.
- Packages: domain graph, auth, config, connector SDK, persistence, agent runtime, UI schema.
- Local Postgres and Redis runtime.
- Foundation database schema and migrations.
- Identity, connection vault, delegation, policy, audit, and gateway status primitives.

## Verification Commands

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres redis
pnpm db:migrate
pnpm verify
pnpm --filter @workbench/gateway dev
curl http://localhost:4200/healthz
```

## Intentionally Deferred

- Real OAuth provider flows.
- GitHub/Notion/Linear native connectors.
- Provider webhooks.
- React Flow schema editor.
- tldraw design workspace.
- 3D or Sigma exploration.
- LLM chat runtime.
- File mutation adapters.

## Tracker Links

- Parent Linear ticket: TSH-64
- Child Linear tickets: TSH-69 through TSH-76
- GitHub issue: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues/1
