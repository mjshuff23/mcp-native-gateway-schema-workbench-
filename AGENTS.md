# Agent Handoff

This repo is in design-complete / implementation-ready state.

Before writing implementation code, read:

1. `docs/design/design-phase-status.md`
2. `docs/design/architecture.md`
3. `docs/design/implementation-phases.md`
4. `docs/design/identity-and-auth.md`

Implementation should stay scoped to the documented phases. Do not jump straight to 3D visualization or broad external integrations before the canonical graph, gateway core, and guarded mutation model exist.

Key rule: the LLM suggests, the graph validates, policy checks, the user approves, and audit records.

## Phase 1 Implementation Rules

- Work on branch `tsh-64-phase-1-foundation-contracts`.
- Keep commits aligned to Linear child tickets `TSH-69` through `TSH-76`.
- Use `pnpm verify` before claiming completion.
- Do not add real provider OAuth, React Flow, tldraw, 3D, or live provider sync in Phase 1.
- Move `TSH-64` to `In Review` only after all child tickets are complete or explicitly deferred in `docs/development/phase-1-handoff.md`.
