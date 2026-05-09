# UX Flows

## First-Run Onboarding

Goal: establish identity, connect useful providers, and make the trust model visible.

Flow:

1. Welcome: "Build your schema workbench from repos, docs, tickets, and databases."
2. Choose primary sign-in: GitHub, Google, Microsoft, or passkey later.
3. Confirm default sign-in: "Use GitHub as your default Hub login?"
4. Link work providers:
   - GitHub repositories
   - Notion workspace/docs
   - Linear projects/issues
   - Google Drive/Calendar later
5. Scope review: show read/write scopes and explain why they are needed.
6. Connection dashboard: show linked identities, provider grants, clients, and revocation controls.
7. First project import: pick repo or local folder.
8. Scan preview: show discovered schema sources before parsing.
9. Initial graph: land in structured schema editor.

Design principle:

```text
Convenience is real, but consent stays visible.
```

## Repository Import Flow

1. User selects GitHub repo or local directory.
2. Workbench detects schema artifacts:
   - Prisma schemas
   - SQL migrations
   - DBML files
   - TypeORM entities
   - package/framework hints
3. User reviews detected sources and disables noisy paths.
4. Worker scans files and creates graph snapshot.
5. UI shows parse confidence, warnings, and validation findings.
6. User opens schema editor.

Key UX detail:

- Never run a destructive introspection command against a tracked user file. Prisma `db pull`-style workflows must operate in a temp or shadow path.

## Schema Editing Flow

1. User selects table or relationship.
2. Inspector shows columns, indexes, constraints, references, source files, docs, and tickets.
3. User edits directly or asks assistant for a change.
4. Assistant proposes command DSL.
5. Graph validates and produces a diff preview.
6. User approves, edits, or rejects.
7. Worker applies mutation to graph and optional file adapter.
8. Audit log records user, client, command, resources, and result.

## Assistant Explain Flow

1. User asks: "Why does this table exist?"
2. Agent retrieves from local mirror first:
   - schema graph
   - migrations
   - repo references
   - Notion docs
   - Linear tickets
3. Agent calls live tools only if freshness is required.
4. UI shows answer with linked evidence and graph highlights.

Default answer shape:

- Plain explanation
- Source evidence
- Related graph nodes
- Confidence and missing context
- Suggested next action

## Dashboard Flow

1. User opens workspace dashboard.
2. Widgets render from graph projections:
   - GitHub repo health
   - Migration drift
   - Linear implementation status
   - Notion architecture docs
   - MCP server connection health
   - Recent audit events
3. User clicks widget to inspect source records or open graph context.
4. External systems remain projections, not hidden internal state.

## Freeform Design Flow

1. User opens design workspace tab.
2. tldraw canvas loads graph-backed widgets and freeform shapes.
3. User or assistant creates architecture sketch, onboarding map, or dashboard brief.
4. Widgets stay linked to canonical graph IDs.
5. Freeform shapes can annotate the graph but do not become schema truth.

## Revocation Flow

1. User opens Connections and Access.
2. User chooses revoke target:
   - provider connection
   - client
   - workflow
   - session
3. UI previews impact.
4. User confirms.
5. Hub revokes grants/delegations, kills relevant sessions, and records audit event.
6. Dashboard shows degraded widgets and repair actions.
