# Phase 1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 1 foundation for MCP Native Gateway Schema Workbench: a TypeScript monorepo, app/package boundaries, local Postgres/Redis, foundation database schema, identity/delegation primitives, policy/audit, MCP gateway status shell, and verification docs.

**Architecture:** Start as a TypeScript modular monolith on one branch, with app shells under `apps/*` and focused libraries under `packages/*`. The implementation should produce a runnable local foundation only: no real OAuth, no provider sync, no React Flow editor, no tldraw workspace, and no 3D view.

**Tech Stack:** Node 22, pnpm 10, Nx, TypeScript, Vitest, ESLint, Prettier, Docker Compose, PostgreSQL, Redis, Drizzle ORM, Zod, Express, and MCP TypeScript SDK v1 package `@modelcontextprotocol/sdk`.

---

## Tracker Context

- Branch: `tsh-64-phase-1-foundation-contracts`
- Parent Linear ticket: `TSH-64`
- Child tickets: `TSH-69` through `TSH-76`
- GitHub issue: `#1`
- Notion handoff: https://www.notion.so/35bc2ea5f18f816ebf11cf05d7cbf2c1
- FigJam board: https://www.figma.com/board/2riHSM7ahz9OoHRTrq7zUE

## External Docs To Check Before Coding

- MCP server docs: https://ts.sdk.modelcontextprotocol.io/documents/server.html
- MCP TypeScript SDK repo: https://github.com/modelcontextprotocol/typescript-sdk
- Nx create workspace reference: https://nx.dev/docs/reference/create-nx-workspace
- Nx TypeScript monorepo notes: https://nx.dev/docs/features/maintain-typescript-monorepos

Important SDK note: as of this plan, the MCP TypeScript SDK repo says the split v2 packages are pre-alpha and v1.x remains the recommended production version. Use `@modelcontextprotocol/sdk` for Phase 1 unless the implementation agent verifies that v2 has become stable before coding.

## Scope Guardrails

Implement only Phase 1.

Do not implement:

- Real OAuth provider flows.
- GitHub/Notion/Linear native connectors.
- Provider webhook handlers beyond narrow type-only contracts.
- React Flow visual editor.
- tldraw workspace.
- 3D or Sigma graph exploration.
- LLM chat runtime.
- File mutation adapters.

## File Structure To Create

```text
apps/
  api/
  gateway/
  web/
  worker/
packages/
  agent-runtime/
  auth/
  config/
  connector-sdk/
  domain-graph/
  persistence/
  ui-schema/
docs/
  development/
  superpowers/plans/
```

Why `config` and `persistence` are added: the design listed the core product packages, but shared env parsing and database adapters need clean, testable homes. Keeping them separate prevents `api`, `gateway`, and `worker` from inventing separate config/database conventions.

When one workspace package imports another, add the dependency explicitly with the `workspace:*` protocol in that package's `package.json`. Do not rely on path aliases alone; path aliases help TypeScript, but package dependencies help Nx, pnpm, and future CI understand the graph.

---

### Task 1: TSH-69 - Scaffold pnpm/Nx Workspace And Root Tooling

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `nx.json`
- Create: `tsconfig.base.json`
- Create: `eslint.config.mjs`
- Create: `prettier.config.cjs`
- Create: `vitest.workspace.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Create root package manifest**

Create `package.json` with this shape:

```json
{
  "name": "mcp-native-gateway-schema-workbench",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.9.7",
  "scripts": {
    "build": "nx run-many -t build",
    "dev": "nx run-many -t dev --parallel=4",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "nx run-many -t lint",
    "test": "nx run-many -t test",
    "typecheck": "nx run-many -t typecheck",
    "verify": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm test"
  },
  "devDependencies": {
    "@eslint/js": "latest",
    "@types/node": "latest",
    "@vitejs/plugin-react": "latest",
    "eslint": "latest",
    "nx": "latest",
    "prettier": "latest",
    "tsx": "latest",
    "typescript": "latest",
    "typescript-eslint": "latest",
    "vite": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Create pnpm workspace config**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Create Nx config**

Create `nx.json`:

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": ["default", "!{projectRoot}/**/*.test.ts", "!{projectRoot}/**/*.spec.ts"],
    "sharedGlobals": ["{workspaceRoot}/tsconfig.base.json", "{workspaceRoot}/package.json"]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "lint": {
      "inputs": ["default", "^default"],
      "cache": true
    },
    "test": {
      "inputs": ["default", "^production"],
      "cache": true
    },
    "typecheck": {
      "inputs": ["default", "^production"],
      "cache": true
    }
  }
}
```

- [ ] **Step 4: Create root TypeScript config**

Create `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@workbench/agent-runtime": ["packages/agent-runtime/src/index.ts"],
      "@workbench/auth": ["packages/auth/src/index.ts"],
      "@workbench/config": ["packages/config/src/index.ts"],
      "@workbench/connector-sdk": ["packages/connector-sdk/src/index.ts"],
      "@workbench/domain-graph": ["packages/domain-graph/src/index.ts"],
      "@workbench/persistence": ["packages/persistence/src/index.ts"],
      "@workbench/ui-schema": ["packages/ui-schema/src/index.ts"]
    }
  }
}
```

- [ ] **Step 5: Create lint and format config**

Create `eslint.config.mjs`:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.nx/**', 'coverage/**']
  }
);
```

Create `prettier.config.cjs`:

```js
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  semi: true
};
```

Create `vitest.workspace.ts`:

```ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace(['apps/*/vitest.config.ts', 'packages/*/vitest.config.ts']);
```

- [ ] **Step 6: Update `.gitignore`**

Use this `.gitignore` content:

```gitignore
node_modules/
dist/
coverage/
.nx/
.env
.env.*
!.env.example
.DS_Store
*.log
```

- [ ] **Step 7: Install and verify root tooling**

Run:

```bash
pnpm install
pnpm format:check
```

Expected: `pnpm install` writes `pnpm-lock.yaml`; `format:check` may fail until generated files are formatted. Run `pnpm format` once, then rerun `pnpm format:check`.

- [ ] **Step 8: Commit Task 1**

```bash
git add package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json eslint.config.mjs prettier.config.cjs vitest.workspace.ts .gitignore
git commit -m "chore: scaffold workspace tooling"
```

---

### Task 2: TSH-70 - Create App And Package Skeletons

**Files:**
- Create: `apps/api/*`
- Create: `apps/gateway/*`
- Create: `apps/worker/*`
- Create: `apps/web/*`
- Create: `packages/agent-runtime/*`
- Create: `packages/auth/*`
- Create: `packages/config/*`
- Create: `packages/connector-sdk/*`
- Create: `packages/domain-graph/*`
- Create: `packages/persistence/*`
- Create: `packages/ui-schema/*`

- [ ] **Step 1: Add app/package manifests and project targets**

Each `apps/*/package.json` should use this pattern, changing the name and entry script:

```json
{
  "name": "@workbench/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "tsx src/index.ts",
    "lint": "eslint .",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

Each `packages/*/package.json` should use this pattern:

```json
{
  "name": "@workbench/domain-graph",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint .",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

- [ ] **Step 2: Add per-project TypeScript and Vitest config**

Each project gets `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["dist", "node_modules"]
}
```

For packages, keep `../../tsconfig.base.json`. For nested paths, confirm the relative path is correct.

Each project gets `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
```

For `apps/web`, use `environment: 'jsdom'` after adding frontend tests; Phase 1 can keep web tests minimal or node-based.

- [ ] **Step 3: Add focused package entrypoints**

Create `src/index.ts` for each package with a named exported constant first, then replace with real exports in later tasks.

Example `packages/domain-graph/src/index.ts`:

```ts
export const domainGraphPackage = 'domain-graph';
```

Example `packages/auth/src/index.ts`:

```ts
export const authPackage = 'auth';
```

- [ ] **Step 4: Add app smoke entrypoints**

Create `apps/api/src/index.ts`:

```ts
const port = process.env.API_PORT ?? '4100';
console.log(`api shell ready on port ${port}`);
```

Create `apps/gateway/src/index.ts`:

```ts
const port = process.env.GATEWAY_PORT ?? '4200';
console.log(`gateway shell ready on port ${port}`);
```

Create `apps/worker/src/index.ts`:

```ts
console.log('worker shell ready');
```

Create `apps/web/src/index.tsx`:

```tsx
export function App() {
  return <main>MCP Native Gateway Schema Workbench</main>;
}
```

- [ ] **Step 5: Add smoke tests**

Each package gets `src/index.test.ts` asserting the package constant. Example:

```ts
import { describe, expect, it } from 'vitest';
import { domainGraphPackage } from './index';

describe('domain graph package', () => {
  it('exports a package marker', () => {
    expect(domainGraphPackage).toBe('domain-graph');
  });
});
```

Each app gets a small smoke test. Example `apps/worker/src/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('worker shell', () => {
  it('has a test harness', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 6: Verify app/package discovery**

Run:

```bash
pnpm nx show projects
pnpm typecheck
pnpm test
```

Expected: Nx lists all app and package projects; typecheck and tests pass.

- [ ] **Step 7: Commit Task 2**

```bash
git add apps packages package.json pnpm-lock.yaml tsconfig.base.json vitest.workspace.ts
git commit -m "chore: add app and package skeletons"
```

---

### Task 3: TSH-71 - Add Local Postgres, Redis, And Environment Contract

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `packages/config/src/env.ts`
- Modify: `packages/config/src/index.ts`
- Modify: `apps/api/src/index.ts`
- Modify: `apps/gateway/src/index.ts`
- Modify: `apps/worker/src/index.ts`
- Create: `docs/development/local-dev.md`

- [ ] **Step 1: Add runtime dependencies**

Run:

```bash
pnpm add zod dotenv -w
```

- [ ] **Step 2: Create Docker Compose services**

Create `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: mcp_schema_workbench_postgres
    environment:
      POSTGRES_USER: workbench
      POSTGRES_PASSWORD: workbench
      POSTGRES_DB: workbench_dev
    ports:
      - "54329:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U workbench -d workbench_dev"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    container_name: mcp_schema_workbench_redis
    ports:
      - "63799:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

- [ ] **Step 3: Create env example**

Create `.env.example`:

```dotenv
NODE_ENV=development
API_PORT=4100
GATEWAY_PORT=4200
DATABASE_URL=postgres://workbench:workbench@localhost:54329/workbench_dev
REDIS_URL=redis://localhost:63799
POLICY_MODE=enforcing
WORKBENCH_VERSION=0.1.0
```

- [ ] **Step 4: Implement typed env parser**

Create `packages/config/src/env.ts`:

```ts
import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

loadDotenv();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4100),
  GATEWAY_PORT: z.coerce.number().int().positive().default(4200),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  POLICY_MODE: z.enum(['enforcing', 'permissive']).default('enforcing'),
  WORKBENCH_VERSION: z.string().default('0.1.0')
});

export type WorkbenchEnv = z.infer<typeof envSchema>;

export function loadWorkbenchEnv(input: NodeJS.ProcessEnv = process.env): WorkbenchEnv {
  const parsed = envSchema.safeParse(input);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid workbench environment: ${details}`);
  }

  return parsed.data;
}
```

Modify `packages/config/src/index.ts`:

```ts
export type { WorkbenchEnv } from './env';
export { loadWorkbenchEnv } from './env';
```

- [ ] **Step 5: Wire app shells to env parser**

Update `apps/api/src/index.ts`:

```ts
import { loadWorkbenchEnv } from '@workbench/config';

const env = loadWorkbenchEnv();
console.log(`api shell ready on port ${env.API_PORT}`);
```

Update `apps/gateway/src/index.ts`:

```ts
import { loadWorkbenchEnv } from '@workbench/config';

const env = loadWorkbenchEnv();
console.log(`gateway shell ready on port ${env.GATEWAY_PORT}`);
```

Update `apps/worker/src/index.ts`:

```ts
import { loadWorkbenchEnv } from '@workbench/config';

const env = loadWorkbenchEnv();
console.log(`worker shell ready with Redis at ${env.REDIS_URL}`);
```

- [ ] **Step 6: Add local dev docs**

Create `docs/development/local-dev.md`:

```md
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
```

- [ ] **Step 7: Verify local dependencies**

Run:

```bash
cp .env.example .env
docker compose up -d postgres redis
pnpm typecheck
pnpm test
```

Expected: containers start and TypeScript/tests pass.

- [ ] **Step 8: Commit Task 3**

```bash
git add docker-compose.yml .env.example packages/config apps/api apps/gateway apps/worker docs/development/local-dev.md package.json pnpm-lock.yaml
git commit -m "chore: add local runtime environment"
```

---

### Task 4: TSH-72 - Create Foundation Database Schema And Migrations

**Files:**
- Create: `drizzle.config.ts`
- Create: `packages/persistence/src/schema.ts`
- Create: `packages/persistence/src/client.ts`
- Modify: `packages/persistence/src/index.ts`
- Create: `packages/persistence/src/schema.test.ts`
- Create: `packages/persistence/migrations/*`
- Modify: `package.json`

- [ ] **Step 1: Add database dependencies**

Run:

```bash
pnpm add drizzle-orm pg -w
pnpm add -D drizzle-kit @types/pg -w
```

- [ ] **Step 2: Add Drizzle config**

Create `drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './packages/persistence/src/schema.ts',
  out: './packages/persistence/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://workbench:workbench@localhost:54329/workbench_dev'
  }
});
```

Add scripts to root `package.json`:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

Merge these into the existing `scripts` object; do not replace existing scripts.

- [ ] **Step 3: Implement foundation schema**

Create `packages/persistence/src/schema.ts`:

```ts
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider', [
  'github',
  'google',
  'microsoft',
  'notion',
  'linear',
  'local',
  'database'
]);

export const connectionStatusEnum = pgEnum('connection_status', [
  'active',
  'revoked',
  'expired',
  'reauth_required'
]);

export const policyResultEnum = pgEnum('policy_result', ['allow', 'deny', 'approval_required']);

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  displayName: text('display_name').notNull(),
  primaryIdentityProvider: providerEnum('primary_identity_provider').notNull().default('local'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  workspaceIdx: index('users_workspace_idx').on(table.workspaceId)
}));

export const externalIdentities = pgTable('external_identities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  provider: providerEnum('provider').notNull(),
  providerSubjectId: text('provider_subject_id').notNull(),
  email: text('email'),
  isPrimaryLogin: boolean('is_primary_login').notNull().default(false),
  linkedAt: timestamp('linked_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  providerSubjectUnique: uniqueIndex('external_identities_provider_subject_unique').on(table.provider, table.providerSubjectId),
  userProviderIdx: index('external_identities_user_provider_idx').on(table.userId, table.provider)
}));

export const providerConnections = pgTable('provider_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  provider: providerEnum('provider').notNull(),
  connectionType: text('connection_type').notNull(),
  scopes: jsonb('scopes').$type<string[]>().notNull().default([]),
  status: connectionStatusEnum('status').notNull().default('active'),
  encryptedRefreshToken: text('encrypted_refresh_token'),
  encryptedAccessTokenCache: text('encrypted_access_token_cache'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userProviderIdx: index('provider_connections_user_provider_idx').on(table.userId, table.provider)
}));

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  kind: text('kind').notNull(),
  name: text('name').notNull(),
  publicKey: text('public_key'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userIdx: index('clients_user_idx').on(table.userId)
}));

export const delegations = pgTable('delegations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  provider: providerEnum('provider').notNull(),
  resource: text('resource').notNull(),
  scopes: jsonb('scopes').$type<string[]>().notNull().default([]),
  reason: text('reason').notNull(),
  workflowId: text('workflow_id'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userClientIdx: index('delegations_user_client_idx').on(table.userId, table.clientId),
  expiresIdx: index('delegations_expires_idx').on(table.expiresAt)
}));

export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  provider: providerEnum('provider').notNull(),
  externalId: text('external_id').notNull(),
  name: text('name').notNull(),
  url: text('url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  workspaceProviderIdx: index('sources_workspace_provider_idx').on(table.workspaceId, table.provider),
  sourceUnique: uniqueIndex('sources_provider_external_unique').on(table.provider, table.externalId)
}));

export const schemaSnapshots = pgTable('schema_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  sourceId: uuid('source_id').references(() => sources.id),
  name: text('name').notNull(),
  graph: jsonb('graph').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  workspaceCreatedIdx: index('schema_snapshots_workspace_created_idx').on(table.workspaceId, table.createdAt)
}));

export const capabilitySnapshots = pgTable('capability_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  sourceId: uuid('source_id').references(() => sources.id),
  capabilities: jsonb('capabilities').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  workspaceCreatedIdx: index('capability_snapshots_workspace_created_idx').on(table.workspaceId, table.createdAt)
}));

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  userId: uuid('user_id').references(() => users.id),
  clientId: uuid('client_id').references(() => clients.id),
  workflowId: text('workflow_id'),
  actorType: text('actor_type').notNull(),
  actorId: text('actor_id').notNull(),
  action: text('action').notNull(),
  provider: providerEnum('provider'),
  resource: text('resource'),
  riskLabel: text('risk_label').notNull(),
  policyResult: policyResultEnum('policy_result').notNull(),
  result: text('result').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  workspaceCreatedIdx: index('audit_events_workspace_created_idx').on(table.workspaceId, table.createdAt),
  actorIdx: index('audit_events_actor_idx').on(table.actorType, table.actorId)
}));
```

- [ ] **Step 4: Add database client**

Create `packages/persistence/src/client.ts`:

```ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { loadWorkbenchEnv } from '@workbench/config';

export function createPgPool(connectionString = loadWorkbenchEnv().DATABASE_URL) {
  return new pg.Pool({ connectionString });
}

export function createDatabase(pool = createPgPool()) {
  return drizzle(pool);
}
```

Modify `packages/persistence/src/index.ts`:

```ts
export { createDatabase, createPgPool } from './client';
export * from './schema';
```

- [ ] **Step 5: Generate migration**

Run:

```bash
cp .env.example .env
docker compose up -d postgres redis
pnpm db:generate
pnpm db:migrate
```

Expected: Drizzle creates migration files under `packages/persistence/migrations` and applies them to local Postgres.

- [ ] **Step 6: Add schema test**

Create `packages/persistence/src/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { auditEvents, providerConnections, schemaSnapshots, users, workspaces } from './schema';

describe('foundation schema', () => {
  it('declares core foundation tables', () => {
    expect(workspaces).toBeDefined();
    expect(users).toBeDefined();
    expect(providerConnections).toBeDefined();
    expect(schemaSnapshots).toBeDefined();
    expect(auditEvents).toBeDefined();
  });
});
```

- [ ] **Step 7: Verify schema work**

Run:

```bash
pnpm typecheck
pnpm test
pnpm db:migrate
```

Expected: all commands pass.

- [ ] **Step 8: Commit Task 4**

```bash
git add drizzle.config.ts packages/persistence package.json pnpm-lock.yaml
git commit -m "feat: add foundation database schema"
```

---

### Task 5: TSH-73 - Implement Auth, Connection Vault, And Delegation Domain Primitives

**Files:**
- Create: `packages/auth/src/types.ts`
- Create: `packages/auth/src/vault.ts`
- Create: `packages/auth/src/delegation.ts`
- Create: `packages/auth/src/identity.ts`
- Modify: `packages/auth/src/index.ts`
- Create: `packages/auth/src/*.test.ts`

- [ ] **Step 1: Add auth domain types**

Create `packages/auth/src/types.ts`:

```ts
export type IdentityProvider = 'github' | 'google' | 'microsoft' | 'local';
export type WorkProvider = 'github' | 'google' | 'microsoft' | 'notion' | 'linear' | 'database';
export type ConnectionStatus = 'active' | 'revoked' | 'expired' | 'reauth_required';

export interface HubUser {
  id: string;
  workspaceId: string;
  displayName: string;
  primaryIdentityProvider: IdentityProvider;
}

export interface ExternalIdentity {
  id: string;
  userId: string;
  provider: IdentityProvider;
  providerSubjectId: string;
  email?: string;
  isPrimaryLogin: boolean;
}

export interface ProviderConnection {
  id: string;
  userId: string;
  provider: WorkProvider;
  scopes: string[];
  status: ConnectionStatus;
  expiresAt?: Date;
  revokedAt?: Date;
}

export interface ClientRegistration {
  id: string;
  userId: string;
  kind: 'web' | 'desktop' | 'vscode' | 'browser_extension' | 'agent' | 'local_mcp_client';
  name: string;
  publicKey?: string;
}
```

- [ ] **Step 2: Add vault interface**

Create `packages/auth/src/vault.ts`:

```ts
export interface TokenSecretRef {
  connectionId: string;
  secretName: 'refresh_token' | 'access_token_cache';
}

export interface TokenVault {
  putSecret(ref: TokenSecretRef, plaintext: string): Promise<void>;
  getSecret(ref: TokenSecretRef): Promise<string | null>;
  deleteSecret(ref: TokenSecretRef): Promise<void>;
}

export class InMemoryTokenVault implements TokenVault {
  private readonly secrets = new Map<string, string>();

  async putSecret(ref: TokenSecretRef, plaintext: string): Promise<void> {
    this.secrets.set(this.key(ref), plaintext);
  }

  async getSecret(ref: TokenSecretRef): Promise<string | null> {
    return this.secrets.get(this.key(ref)) ?? null;
  }

  async deleteSecret(ref: TokenSecretRef): Promise<void> {
    this.secrets.delete(this.key(ref));
  }

  private key(ref: TokenSecretRef): string {
    return `${ref.connectionId}:${ref.secretName}`;
  }
}
```

- [ ] **Step 3: Add delegation types and builder**

Create `packages/auth/src/delegation.ts`:

```ts
import type { WorkProvider } from './types';

export interface DelegationRequest {
  userId: string;
  clientId: string;
  provider: WorkProvider;
  resource: string;
  scopes: string[];
  reason: string;
  workflowId?: string;
  ttlSeconds: number;
}

export interface DelegationGrant extends DelegationRequest {
  id: string;
  expiresAt: Date;
  approvedAt?: Date;
}

export function createDelegationGrant(input: DelegationRequest, now = new Date()): DelegationGrant {
  if (input.ttlSeconds <= 0) {
    throw new Error('Delegation ttlSeconds must be positive');
  }

  return {
    ...input,
    id: crypto.randomUUID(),
    expiresAt: new Date(now.getTime() + input.ttlSeconds * 1000)
  };
}
```

- [ ] **Step 4: Add identity helper**

Create `packages/auth/src/identity.ts`:

```ts
import type { ExternalIdentity, HubUser, IdentityProvider } from './types';

export function setPrimaryIdentityProvider(
  user: HubUser,
  identities: ExternalIdentity[],
  provider: IdentityProvider,
): HubUser {
  const linked = identities.some(
    (identity) => identity.provider === provider && identity.userId === user.id,
  );

  if (!linked && provider !== 'local') {
    throw new Error(`Cannot set unlinked provider ${provider} as primary login`);
  }

  return { ...user, primaryIdentityProvider: provider };
}
```

- [ ] **Step 5: Export auth primitives**

Modify `packages/auth/src/index.ts`:

```ts
export { createDelegationGrant } from './delegation';
export { setPrimaryIdentityProvider } from './identity';
export { InMemoryTokenVault } from './vault';
export type { DelegationGrant, DelegationRequest } from './delegation';
export type { ExternalIdentity, HubUser, ProviderConnection, ClientRegistration } from './types';
export type { TokenSecretRef, TokenVault } from './vault';
```

- [ ] **Step 6: Add tests**

Create `packages/auth/src/identity.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { setPrimaryIdentityProvider } from './identity';
import type { ExternalIdentity, HubUser } from './types';

const user: HubUser = {
  id: 'user_1',
  workspaceId: 'workspace_1',
  displayName: 'Michael',
  primaryIdentityProvider: 'local'
};

const githubIdentity: ExternalIdentity = {
  id: 'identity_1',
  userId: 'user_1',
  provider: 'github',
  providerSubjectId: '123',
  email: 'michael@example.com',
  isPrimaryLogin: true
};

describe('setPrimaryIdentityProvider', () => {
  it('sets a linked provider as primary login', () => {
    expect(setPrimaryIdentityProvider(user, [githubIdentity], 'github').primaryIdentityProvider).toBe('github');
  });

  it('rejects an unlinked provider', () => {
    expect(() => setPrimaryIdentityProvider(user, [], 'github')).toThrow('Cannot set unlinked provider github as primary login');
  });
});
```

Create `packages/auth/src/vault.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { InMemoryTokenVault } from './vault';

describe('InMemoryTokenVault', () => {
  it('stores and deletes secrets behind refs', async () => {
    const vault = new InMemoryTokenVault();
    const ref = { connectionId: 'connection_1', secretName: 'refresh_token' as const };

    await vault.putSecret(ref, 'secret-value');
    expect(await vault.getSecret(ref)).toBe('secret-value');

    await vault.deleteSecret(ref);
    expect(await vault.getSecret(ref)).toBeNull();
  });
});
```

Create `packages/auth/src/delegation.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createDelegationGrant } from './delegation';

describe('createDelegationGrant', () => {
  it('creates a short lived delegation grant', () => {
    const now = new Date('2026-05-09T00:00:00.000Z');
    const grant = createDelegationGrant(
      {
        userId: 'user_1',
        clientId: 'client_1',
        provider: 'github',
        resource: 'repo:mjshuff23/example',
        scopes: ['repo:read'],
        reason: 'Read schema files',
        ttlSeconds: 60
      },
      now,
    );

    expect(grant.expiresAt.toISOString()).toBe('2026-05-09T00:01:00.000Z');
  });

  it('rejects non-positive ttl values', () => {
    expect(() =>
      createDelegationGrant({
        userId: 'user_1',
        clientId: 'client_1',
        provider: 'github',
        resource: 'repo:mjshuff23/example',
        scopes: ['repo:read'],
        reason: 'Read schema files',
        ttlSeconds: 0
      }),
    ).toThrow('Delegation ttlSeconds must be positive');
  });
});
```

- [ ] **Step 7: Verify auth primitives**

Run:

```bash
pnpm --filter @workbench/auth test
pnpm typecheck
```

Expected: auth tests and global typecheck pass.

- [ ] **Step 8: Commit Task 5**

```bash
git add packages/auth
git commit -m "feat: add identity and delegation primitives"
```

---

### Task 6: TSH-74 - Implement Policy Engine MVP And Audit Write Path

**Files:**
- Create: `packages/auth/src/policy.ts`
- Create: `packages/auth/src/policy.test.ts`
- Create: `packages/persistence/src/audit-repository.ts`
- Create: `packages/persistence/src/audit-repository.test.ts`
- Modify: `packages/auth/src/index.ts`
- Modify: `packages/persistence/src/index.ts`

- [ ] **Step 1: Add policy engine**

Create `packages/auth/src/policy.ts`:

```ts
export type RiskLabel =
  | 'read_only'
  | 'write_graph'
  | 'write_file'
  | 'write_external'
  | 'network_reaching'
  | 'destructive'
  | 'credential_touching'
  | 'approval_required';

export type PolicyDecision =
  | { result: 'allow'; reason: string }
  | { result: 'deny'; reason: string }
  | { result: 'approval_required'; reason: string };

export interface PolicyInput {
  actorType: 'user' | 'agent' | 'extension' | 'system';
  action: string;
  riskLabels: RiskLabel[];
  requestedScopes: string[];
  grantedScopes: string[];
}

export function evaluatePolicy(input: PolicyInput): PolicyDecision {
  if (input.riskLabels.includes('credential_touching')) {
    return { result: 'deny', reason: 'Credential-touching actions are blocked in Phase 1' };
  }

  const missingScope = input.requestedScopes.find((scope) => !input.grantedScopes.includes(scope));
  if (missingScope) {
    return { result: 'deny', reason: `Missing granted scope ${missingScope}` };
  }

  if (
    input.riskLabels.includes('destructive') ||
    input.riskLabels.includes('write_file') ||
    input.riskLabels.includes('write_external') ||
    input.riskLabels.includes('approval_required')
  ) {
    return { result: 'approval_required', reason: 'Action requires explicit user approval' };
  }

  return { result: 'allow', reason: 'Action is permitted by Phase 1 policy' };
}
```

Update `packages/auth/src/index.ts`:

```ts
export { evaluatePolicy } from './policy';
export type { PolicyDecision, PolicyInput, RiskLabel } from './policy';
```

Merge with existing exports.

- [ ] **Step 2: Add policy tests**

Create `packages/auth/src/policy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { evaluatePolicy } from './policy';

describe('evaluatePolicy', () => {
  it('allows read-only actions with granted scopes', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'read_gateway_status',
        riskLabels: ['read_only'],
        requestedScopes: ['gateway:read'],
        grantedScopes: ['gateway:read']
      }).result,
    ).toBe('allow');
  });

  it('denies missing scopes', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'read_gateway_status',
        riskLabels: ['read_only'],
        requestedScopes: ['gateway:read'],
        grantedScopes: []
      }),
    ).toEqual({ result: 'deny', reason: 'Missing granted scope gateway:read' });
  });

  it('requires approval for destructive actions', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'delete_table',
        riskLabels: ['destructive'],
        requestedScopes: ['graph:write'],
        grantedScopes: ['graph:write']
      }).result,
    ).toBe('approval_required');
  });

  it('blocks credential-touching actions', () => {
    expect(
      evaluatePolicy({
        actorType: 'agent',
        action: 'read_refresh_token',
        riskLabels: ['credential_touching'],
        requestedScopes: ['credential:read'],
        grantedScopes: ['credential:read']
      }).result,
    ).toBe('deny');
  });
});
```

- [ ] **Step 3: Add audit repository interface**

Create `packages/persistence/src/audit-repository.ts`:

```ts
import type { RiskLabel } from '@workbench/auth';

export interface AuditEventInput {
  workspaceId: string;
  userId?: string;
  clientId?: string;
  workflowId?: string;
  actorType: 'user' | 'agent' | 'extension' | 'system';
  actorId: string;
  action: string;
  provider?: 'github' | 'google' | 'microsoft' | 'notion' | 'linear' | 'local' | 'database';
  resource?: string;
  riskLabel: RiskLabel;
  policyResult: 'allow' | 'deny' | 'approval_required';
  result: 'success' | 'failure' | 'blocked';
  metadata?: Record<string, unknown>;
}

export interface AuditRepository {
  record(event: AuditEventInput): Promise<void>;
}

export class InMemoryAuditRepository implements AuditRepository {
  readonly events: AuditEventInput[] = [];

  async record(event: AuditEventInput): Promise<void> {
    this.events.push(event);
  }
}
```

Update `packages/persistence/src/index.ts`:

```ts
export { InMemoryAuditRepository } from './audit-repository';
export type { AuditEventInput, AuditRepository } from './audit-repository';
```

Merge with existing exports.

- [ ] **Step 4: Add audit tests**

Create `packages/persistence/src/audit-repository.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { InMemoryAuditRepository } from './audit-repository';

describe('InMemoryAuditRepository', () => {
  it('records audit events', async () => {
    const repo = new InMemoryAuditRepository();

    await repo.record({
      workspaceId: 'workspace_1',
      actorType: 'agent',
      actorId: 'agent_1',
      action: 'read_gateway_status',
      riskLabel: 'read_only',
      policyResult: 'allow',
      result: 'success'
    });

    expect(repo.events).toHaveLength(1);
    expect(repo.events[0]?.action).toBe('read_gateway_status');
  });
});
```

- [ ] **Step 5: Verify policy and audit**

Run:

```bash
pnpm --filter @workbench/auth test
pnpm --filter @workbench/persistence test
pnpm typecheck
```

Expected: all tests and typecheck pass.

- [ ] **Step 6: Commit Task 6**

```bash
git add packages/auth packages/persistence
git commit -m "feat: add policy and audit primitives"
```

---

### Task 7: TSH-75 - Implement MCP Gateway Health And Capability Registry Shell

**Files:**
- Create: `packages/connector-sdk/src/capability-registry.ts`
- Modify: `packages/connector-sdk/src/index.ts`
- Create: `apps/gateway/src/status.ts`
- Modify: `apps/gateway/src/index.ts`
- Create: `apps/gateway/src/status.test.ts`

- [ ] **Step 1: Add gateway dependencies**

Run:

```bash
pnpm add @modelcontextprotocol/sdk express zod -w
pnpm add -D @types/express -w
```

- [ ] **Step 2: Add capability registry types**

Create `packages/connector-sdk/src/capability-registry.ts`:

```ts
export type CapabilityKind = 'tool' | 'resource' | 'prompt' | 'completion' | 'task' | 'policy';

export interface CapabilitySnapshotItem {
  id: string;
  kind: CapabilityKind;
  namespace: string;
  name: string;
  title: string;
  description: string;
  riskLabels: string[];
  discoveredAt: string;
}

export interface CapabilityRegistry {
  list(kind?: CapabilityKind): CapabilitySnapshotItem[];
  upsert(item: CapabilitySnapshotItem): void;
}

export class InMemoryCapabilityRegistry implements CapabilityRegistry {
  private readonly items = new Map<string, CapabilitySnapshotItem>();

  list(kind?: CapabilityKind): CapabilitySnapshotItem[] {
    const values = [...this.items.values()];
    return kind ? values.filter((item) => item.kind === kind) : values;
  }

  upsert(item: CapabilitySnapshotItem): void {
    this.items.set(item.id, item);
  }
}
```

Update `packages/connector-sdk/src/index.ts`:

```ts
export { InMemoryCapabilityRegistry } from './capability-registry';
export type { CapabilityKind, CapabilityRegistry, CapabilitySnapshotItem } from './capability-registry';
```

- [ ] **Step 3: Add gateway status model**

Create `apps/gateway/src/status.ts`:

```ts
import { evaluatePolicy } from '@workbench/auth';
import type { CapabilityRegistry } from '@workbench/connector-sdk';
import { loadWorkbenchEnv } from '@workbench/config';

export interface GatewayStatus {
  name: 'mcp-native-gateway-schema-workbench';
  version: string;
  policyMode: 'enforcing' | 'permissive';
  capabilities: {
    tools: number;
    resources: number;
    prompts: number;
    completions: number;
    tasks: number;
    policies: number;
  };
}

export function getGatewayStatus(registry: CapabilityRegistry): GatewayStatus {
  const env = loadWorkbenchEnv();
  const decision = evaluatePolicy({
    actorType: 'system',
    action: 'read_gateway_status',
    riskLabels: ['read_only'],
    requestedScopes: ['gateway:read'],
    grantedScopes: ['gateway:read']
  });

  if (decision.result !== 'allow') {
    throw new Error(`Gateway status blocked by policy: ${decision.reason}`);
  }

  return {
    name: 'mcp-native-gateway-schema-workbench',
    version: env.WORKBENCH_VERSION,
    policyMode: env.POLICY_MODE,
    capabilities: {
      tools: registry.list('tool').length,
      resources: registry.list('resource').length,
      prompts: registry.list('prompt').length,
      completions: registry.list('completion').length,
      tasks: registry.list('task').length,
      policies: registry.list('policy').length
    }
  };
}
```

- [ ] **Step 4: Wire gateway entrypoint**

Modify `apps/gateway/src/index.ts`:

```ts
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { InMemoryCapabilityRegistry } from '@workbench/connector-sdk';
import { loadWorkbenchEnv } from '@workbench/config';
import { getGatewayStatus } from './status';

const env = loadWorkbenchEnv();
const registry = new InMemoryCapabilityRegistry();

registry.upsert({
  id: 'gateway.status.resource',
  kind: 'resource',
  namespace: 'gateway',
  name: 'status',
  title: 'Gateway Status',
  description: 'Current gateway health and capability counts',
  riskLabels: ['read_only'],
  discoveredAt: new Date().toISOString()
});

const mcpServer = new McpServer({
  name: 'mcp-native-gateway-schema-workbench',
  version: env.WORKBENCH_VERSION
});

mcpServer.registerResource(
  'gateway-status',
  'gateway://status',
  {
    title: 'Gateway Status',
    description: 'Current gateway health and capability counts',
    mimeType: 'application/json'
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(getGatewayStatus(registry), null, 2)
      }
    ]
  }),
);

const app = express();
app.get('/healthz', (_req, res) => {
  res.json(getGatewayStatus(registry));
});

app.listen(env.GATEWAY_PORT, () => {
  console.log(`gateway shell ready on port ${env.GATEWAY_PORT}`);
});
```

This creates the MCP server object and status resource now, while leaving full Streamable HTTP transport wiring for a focused follow-up if the exact SDK transport surface needs deeper integration work.

- [ ] **Step 5: Add gateway status test**

Create `apps/gateway/src/status.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { InMemoryCapabilityRegistry } from '@workbench/connector-sdk';
import { getGatewayStatus } from './status';

describe('getGatewayStatus', () => {
  it('reports separated capability counts', () => {
    process.env.DATABASE_URL = 'postgres://workbench:workbench@localhost:54329/workbench_dev';
    process.env.REDIS_URL = 'redis://localhost:63799';
    process.env.WORKBENCH_VERSION = '0.1.0';
    process.env.POLICY_MODE = 'enforcing';

    const registry = new InMemoryCapabilityRegistry();
    registry.upsert({
      id: 'gateway.status.resource',
      kind: 'resource',
      namespace: 'gateway',
      name: 'status',
      title: 'Gateway Status',
      description: 'Current gateway health and capability counts',
      riskLabels: ['read_only'],
      discoveredAt: '2026-05-09T00:00:00.000Z'
    });

    expect(getGatewayStatus(registry)).toMatchObject({
      name: 'mcp-native-gateway-schema-workbench',
      capabilities: {
        resources: 1,
        tools: 0,
        prompts: 0
      }
    });
  });
});
```

- [ ] **Step 6: Verify gateway shell**

Run:

```bash
pnpm --filter @workbench/gateway test
pnpm --filter @workbench/gateway typecheck
pnpm --filter @workbench/gateway dev
```

In another terminal:

```bash
curl http://localhost:4200/healthz
```

Expected: JSON includes `name`, `version`, `policyMode`, and separated capability counts.

- [ ] **Step 7: Commit Task 7**

```bash
git add apps/gateway packages/connector-sdk package.json pnpm-lock.yaml
git commit -m "feat: add gateway status shell"
```

---

### Task 8: TSH-76 - Wire Verification, CI Skeleton, And Handoff Docs

**Files:**
- Create: `.github/workflows/verify.yml`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Create: `docs/development/phase-1-handoff.md`
- Modify: `docs/development/local-dev.md`

- [ ] **Step 1: Add GitHub Actions verification**

Create `.github/workflows/verify.yml`:

```yaml
name: Verify

on:
  pull_request:
  push:
    branches:
      - main
      - tsh-64-phase-1-foundation-contracts

jobs:
  verify:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: workbench
          POSTGRES_PASSWORD: workbench
          POSTGRES_DB: workbench_dev
        ports:
          - 54329:5432
        options: >-
          --health-cmd "pg_isready -U workbench -d workbench_dev"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
      redis:
        image: redis:7-alpine
        ports:
          - 63799:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
    env:
      NODE_ENV: test
      API_PORT: 4100
      GATEWAY_PORT: 4200
      DATABASE_URL: postgres://workbench:workbench@localhost:54329/workbench_dev
      REDIS_URL: redis://localhost:63799
      POLICY_MODE: enforcing
      WORKBENCH_VERSION: 0.1.0
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.9.7
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:migrate
      - run: pnpm verify
```

- [ ] **Step 2: Update README commands**

Add this section to `README.md`:

```md
## Phase 1 Local Commands

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres redis
pnpm db:migrate
pnpm verify
pnpm --filter @workbench/gateway dev
```

Gateway health check:

```bash
curl http://localhost:4200/healthz
```
```

- [ ] **Step 3: Update AGENTS handoff**

Add this section to `AGENTS.md`:

```md
## Phase 1 Implementation Rules

- Work on branch `tsh-64-phase-1-foundation-contracts`.
- Keep commits aligned to Linear child tickets `TSH-69` through `TSH-76`.
- Use `pnpm verify` before claiming completion.
- Do not add real provider OAuth, React Flow, tldraw, 3D, or live provider sync in Phase 1.
- Move `TSH-64` to `In Review` only after all child tickets are complete or explicitly deferred in `docs/development/phase-1-handoff.md`.
```

- [ ] **Step 4: Add Phase 1 handoff doc**

Create `docs/development/phase-1-handoff.md`:

```md
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
```

- [ ] **Step 5: Run final verification**

Run:

```bash
pnpm format
pnpm verify
git status --short
```

Expected: `pnpm verify` passes and `git status --short` only shows intentional files before commit.

- [ ] **Step 6: Commit Task 8**

```bash
git add .github README.md AGENTS.md docs/development package.json pnpm-lock.yaml
git commit -m "docs: add phase 1 verification handoff"
```

---

## Final Phase 1 Completion Checklist

After all tasks are complete:

- [ ] Run `pnpm verify`.
- [ ] Run `docker compose ps` and confirm Postgres/Redis are healthy.
- [ ] Run `curl http://localhost:4200/healthz` and capture the JSON in the PR body.
- [ ] Push branch `tsh-64-phase-1-foundation-contracts`.
- [ ] Open a draft PR against `main`.
- [ ] Put the PR link on Linear `TSH-64` and child tickets.
- [ ] Move completed child tickets to `In Review` or `Done` according to your review flow.
- [ ] Move `TSH-64` to `In Review` only when the branch is ready for review.

## Suggested Draft PR Title

```text
Phase 1: scaffold foundation contracts and gateway shell
```

## Suggested Draft PR Body

```md
## Summary

- Scaffolds the pnpm/Nx TypeScript workspace.
- Adds app/package boundaries for API, gateway, worker, web, and core packages.
- Adds local Postgres/Redis runtime and typed env parsing.
- Adds foundation database schema and migrations.
- Adds identity, vault, delegation, policy, audit, and gateway status primitives.
- Adds verification docs and CI skeleton.

## Reviewer Focus

- Package boundaries are clean and do not leak implementation details.
- Auth model keeps primary sign-in separate from provider grants.
- Policy engine handles allow, deny, and approval-required paths deterministically.
- Gateway exposes health/status without requiring upstream MCP servers.
- Phase 1 does not sneak in provider OAuth, visual editor, or connector sync.

## Testing

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres redis
pnpm db:migrate
pnpm verify
curl http://localhost:4200/healthz
```

## Deferred Scope

- Real OAuth provider flows.
- Native GitHub/Notion/Linear connector sync.
- React Flow workbench.
- tldraw workspace.
- 3D exploration.
```
