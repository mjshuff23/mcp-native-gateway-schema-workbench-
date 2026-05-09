# Local Development

## Prerequisites

- Node 22
- pnpm 10
- Docker with Compose support

## First Setup

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres redis
pnpm verify
```

## Runtime Commands

```bash
pnpm --filter @workbench/api dev
pnpm --filter @workbench/gateway dev
pnpm --filter @workbench/worker dev
```

## Reset Local Data

```bash
docker compose down -v
docker compose up -d postgres redis
```
