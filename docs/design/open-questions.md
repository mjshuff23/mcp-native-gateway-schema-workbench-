# Open Questions for Michael or the Next Agent

These do not block the design phase. They are the questions to answer before turning this into the actual implementation plan.

## Product Wedge

1. Should the first serious build optimize for a portfolio/demo story or for a daily-driver local tool?

Recommended default: portfolio/demo first, but with real local architecture. This keeps scope tight while still showing mature system design.

## First Provider

2. Which provider should be implemented first after the local graph works?

Recommended default: GitHub first. Repos and schema files are closest to the core product loop. Notion and Linear become projections once the graph can produce useful decisions and findings.

## First Schema Source

3. Which schema source should the MVP parse first?

Recommended default: Prisma plus SQL migrations. Prisma gives a clear modern app target; SQL migrations keep the graph honest and not ORM-only.

## Auth Mode

4. Should Phase 1 include real OAuth or only the domain model and local dev stubs?

Recommended default: domain model and local dev stubs first, then GitHub App/OAuth in the provider phase. Real auth too early can consume the whole milestone.

## Desktop Timing

5. Should Tauri be included in the first implementation plan?

Recommended default: no. Keep Tauri as Phase 5 packaging unless local desktop distribution becomes the immediate demo requirement.

## Agent Writes

6. Should the first assistant be read-only explanation or guarded mutation?

Recommended default: guarded mutation design in Phase 3, but first implementation of the assistant can ship read-only explanation before command application.

## 3D Scope

7. Should 3D be a named feature in public positioning now?

Recommended default: mention as exploration lens, not as core MVP. The core value is graph truth, diffs, and safe mutation.

## Tracker Structure

8. Should Linear use one project with five phase tickets, or five milestones/projects?

Recommended default: one Linear project with five phase tickets. Milestones can be added later if implementation becomes multi-month.
