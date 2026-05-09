# Figma / FigJam Diagrams

FigJam board created in this session: https://www.figma.com/board/2riHSM7ahz9OoHRTrq7zUE

Diagrams added:

- Three-plane core architecture
- Identity delegation flow
- Implementation phases
- Guarded mutation flow
- Schema graph IR
- Close-call alternatives

The Mermaid source below is preserved so future agents can recreate or revise the diagrams if the connector loses access.

## Diagram 1: Three-Plane Core Architecture

```mermaid
flowchart LR
  subgraph Ingestion["Ingestion Plane"]
    GitHub["GitHub App\nGraphQL REST Webhooks"]
    Notion["Notion OAuth\nData Sources Webhooks"]
    Linear["Linear OAuth\nGraphQL Webhooks"]
    DBs["Live DB Introspection\nPostgres MySQL SQLite"]
    Parsers["Repo Parsers\nPrisma SQL DBML TypeORM"]
    Worker["Async Worker\nVerify Enqueue Process"]
  end

  subgraph Graph["Canonical Graph"]
    IR["Schema Graph IR"]
    Snapshots["Snapshots and Diffs"]
    Audit["Policy Metadata and Audit"]
  end

  subgraph Interaction["Interaction Plane"]
    Gateway["MCP Gateway\nHost and Server"]
    Registry["Capability Registry\nTools Resources Prompts Tasks"]
    Broker["Identity Delegation Broker"]
    Agent["Agent Runtime\nCommand DSL"]
  end

  subgraph Viz["Visualization Plane"]
    Editor["React Flow Schema Editor"]
    Design["tldraw Design Workspace"]
    Explore["3D or Sigma Exploration"]
  end

  GitHub --> Worker
  Notion --> Worker
  Linear --> Worker
  DBs --> Worker
  Parsers --> Worker
  Worker --> IR
  IR --> Snapshots
  IR --> Audit
  IR --> Gateway
  Gateway --> Registry
  Broker --> Gateway
  Agent --> Gateway
  Gateway --> Editor
  IR --> Design
  IR --> Explore
```

## Diagram 2: Implementation Phases

```mermaid
flowchart LR
  P1["Phase 1\nFoundation Identity Gateway"] --> P2["Phase 2\nSchema Graph Repo Sync"]
  P2 --> P3["Phase 3\nVisual Workbench Agent Edits"]
  P3 --> P4["Phase 4\nProvider Integrations Dashboards"]
  P4 --> P5["Phase 5\nFreeform Design 3D Hardening"]

  P1 --> G1["Trust boundaries exist"]
  P2 --> G2["Graph is source of truth"]
  P3 --> G3["User approves graph diffs"]
  P4 --> G4["External systems are projections"]
  P5 --> G5["Scale and abuse controls"]
```

## Diagram 3: Guarded Mutation Flow

```mermaid
sequenceDiagram
  participant User
  participant App as Workbench UI
  participant Agent as Agent Runtime
  participant Gateway as MCP Gateway
  participant Graph as Canonical Graph
  participant Policy as Policy Engine
  participant Worker as Worker
  participant Audit as Audit Log

  User->>App: Ask for schema change
  App->>Agent: Provide local graph context
  Agent->>Gateway: Propose command DSL
  Gateway->>Graph: Validate command
  Gateway->>Policy: Check scope and risk
  Policy-->>App: Approval required
  User->>App: Approve diff
  App->>Worker: Apply approved command
  Worker->>Graph: Persist graph mutation
  Worker->>Audit: Record action and result
  App-->>User: Show updated graph
```
