# Design Phase Status

## Verdict

The design phase is far enough to move into implementation planning. The best target state is a three-plane architecture:

- **Ingestion plane:** direct provider APIs, webhooks, repo parsers, live DB introspection, and async workers mirror source systems into the app graph.
- **Interaction plane:** an MCP gateway exposes a curated downstream surface and lazily activates upstream MCP sessions.
- **Visualization plane:** React Flow handles structured schema editing, tldraw handles freeform design/dashboard composition, and 3D stays a later exploration lens.

## What Was Already Solid

- The Identity Hub idea is valid if it means primary Hub sign-in plus linked provider grants, not one OAuth token reused everywhere.
- The MCP Gateway should broker identity, policy, delegation, and audit instead of forwarding provider tokens to models or extensions.
- GitHub, Notion, and Linear should be synced through their native APIs/webhooks for deterministic background state.
- MCP should expose the mirrored graph and approved actions, not replace the app's own sync engine.

## Important Correction

The primary login provider is only the way the user signs into the Hub. It does not become a universal provider token.

Correct model:

```text
GitHub login proves who the user is.
Google connection grants calendar or drive access.
Notion connection grants selected workspace/page access.
Linear connection grants project and issue access.
The Hub binds those grants to one user profile and brokers scoped delegation.
```

## External Handoff Links

- FigJam board: https://www.figma.com/board/2riHSM7ahz9OoHRTrq7zUE
- Notion handoff: https://www.notion.so/35bc2ea5f18f816ebf11cf05d7cbf2c1
- Linear project: https://linear.app/michaelshuff/project/mcp-native-gateway-schema-workbench-0a48ecf069a8
- GitHub phase issues: https://github.com/mjshuff23/mcp-native-gateway-schema-workbench-/issues

## Finished Design Package

- Architecture plan: `docs/design/architecture.md`
- Identity/auth design: `docs/design/identity-and-auth.md`
- Implementation phases: `docs/design/implementation-phases.md`
- Linear-ready ticket payloads: `docs/tracker/linear-phase-tickets.md`
- FigJam diagram source: `docs/figma/diagrams.md`

## Implementation Gate

Phase 1 can start once the tracker tickets exist and the implementation branch is created. The first implementation PR should scaffold the monorepo and contracts only; it should not include the visual workbench yet.
