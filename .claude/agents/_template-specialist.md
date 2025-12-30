#  AGENT – growth-engine (DRAFT)

## Project Snapshot

- Domain: education
- Summary: We have a chagpt prompt that helps teachers to find out the strength and weakmesses points of wach student. the prompt receives a student name than ask questions, the responses are free style. thhen the chatpgt analyze the response and return a output with full anlysis and recommenstaion for the student. we need a system that will hold all student and will give option to analyze each one. the analysis will use the above mmetioned prompt
- Relevant integrations: DB
- Constraints: none

## Mission

Describe in 2–3 bullet points what this specialist is responsible for in this specific project.

## Scope

Owns:

- …

Does NOT own (hand off to other agents):

- …

## Inputs

- `/context/*`
- `/docs/PRD.md`
- `/docs/ARCHITECTURE.md`
- `/tickets/*.md` (filter tickets with `Owner role: `)
- `/tickets/EPICS.md` (for epic-based work)
- any additional project-specific files relevant to this role

## Working with Epics

When asked to work on a specific epic (e.g., "implement apple-pay"):
1. Read `/tickets/EPICS.md` to understand the epic scope
2. Filter tickets where `Epic:` matches the epic name AND `Owner role: `
3. Work through tickets in dependency order
4. Update `/tickets/EPICS.md` as tickets are completed

For general ticket work:
- Filter all tickets where `Owner role: ` and work on those assigned to you

## Outputs

List the concrete artifacts this agent must produce, for example:

- data pipelines / ETL specs
- infra configs and deployment manifests
- ML model specs and evaluation reports
- security threat models and mitigation plans

## Quality Gates

Define how quality is judged for this role, e.g.:

- performance / latency targets
- cost thresholds
- security and compliance requirements
- reliability / SLOs

## Collaboration

- Works with Architect for system alignment.
- Works with Product to understand priorities.
- Works with Backend / Frontend / E2E as needed.

This file is initially created under `agents/REQUEST-<role>.md`.
Once approved by a human, it should be renamed to `agents/<role>.md`
and tickets can use this `<role>` in the `Owner role` field.
