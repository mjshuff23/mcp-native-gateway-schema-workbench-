# Canonical Graph IR

## Purpose

The canonical graph IR is the stable internal model that every parser, connector, editor, dashboard, and agent command uses.

It should represent what the workbench knows, not simply copy one provider's schema format.

## Principles

- Relational-first for MVP.
- Source-aware: every graph object can point back to files, provider records, docs, tickets, and migrations.
- Snapshot-friendly: every import or mutation can produce a versioned graph snapshot.
- Diffable: graph changes are first-class review artifacts.
- Auditable: every mutation records actor, client, workflow, policy result, and source.
- Extensible: document, graph, vector, and key-value database facets can be added without replacing the core.

## MVP Entity Groups

### Workspace and Identity

```text
Workspace
User
ExternalIdentity
ProviderConnection
Client
Delegation
AuditEvent
```

### Source Mirror

```text
Source
SourceFile
ProviderRecord
WebhookEvent
SyncJob
```

### Schema Graph

```text
SchemaSnapshot
SchemaObject
Table
Column
Index
Constraint
Relationship
Migration
ValidationFinding
SchemaDiff
```

### Product Projection

```text
DocumentReference
TicketReference
Dashboard
Widget
View
SavedLayout
```

## Minimum Schema Object Shape

```ts
export type SchemaObjectKind =
  | 'table'
  | 'view'
  | 'column'
  | 'index'
  | 'constraint'
  | 'relationship'
  | 'migration';

export interface SchemaObjectRef {
  workspaceId: string;
  snapshotId: string;
  objectId: string;
  kind: SchemaObjectKind;
  name: string;
  sourceRefs: SourceRef[];
}

export interface SourceRef {
  provider: 'github' | 'local' | 'notion' | 'linear' | 'database';
  sourceId: string;
  path?: string;
  startLine?: number;
  endLine?: number;
  externalUrl?: string;
}
```

## Snapshot Model

Each scan or accepted mutation creates a snapshot.

```text
Snapshot A: imported from repo main at commit abc
Snapshot B: user accepted add_table command
Snapshot C: provider sync detected migration file change
```

Diff types:

- Added object
- Removed object
- Renamed object
- Changed column type
- Added relationship
- Removed relationship
- Changed index
- Changed constraint
- Drift between desired and observed schema

## Validation Findings

Validation should run after parsing and before applying mutations.

Initial finding types:

- Missing referenced table
- Missing referenced column
- Duplicate table name
- Duplicate column name
- Invalid foreign key cardinality
- Migration order ambiguity
- Parser confidence warning
- Source drift warning

## Adapter Boundaries

Import adapters:

- Prisma schema
- SQL migrations
- DBML
- TypeORM entities
- Live Postgres metadata
- Live MySQL metadata
- Live SQLite pragmas

Export adapters:

- DBML
- SQL DDL draft
- Prisma schema projection
- Atlas plan later
- MCP resources
- React Flow nodes/edges
- tldraw widget data

## Rule

```text
The diagram is a projection. The graph is the truth.
```
