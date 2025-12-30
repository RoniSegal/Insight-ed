# Tickets

All work in this project is captured as tickets in this folder.

Each ticket is a Markdown file named like:

- `TP-0001-short-title.md`

## Ticket Template

Recommended sections:

- **Title:** Short description.
- **Epic:** Feature/epic name (e.g., "apple-pay", "project-setup", "user-auth"). Use "(none)" for standalone tickets.
- **Owner role:** One of: product | architect | designer | backend | frontend | e2e | <specialist>
- **Dependencies:** Other ticket IDs this depends on.
- **Context:** Links to PRD sections, context docs, and any relevant code.
- **Acceptance Criteria:** Clear, testable statements.
- **Deliverables:** What should exist when the ticket is done.
- **Status:** e.g., TODO | IN_PROGRESS | DONE | BLOCKED.
- **Notes:** Any additional implementation or discussion notes.

## Epic Grouping

Related tickets across different roles (backend, frontend, designer, e2e) should share the same **Epic** field. This allows working on entire features at once.

Example for "Apple Pay" feature:
- `TP-001-apple-pay-backend-api.md` → Epic: apple-pay, Owner: backend
- `TP-002-apple-pay-payment-ui.md` → Epic: apple-pay, Owner: frontend
- `TP-003-apple-pay-flow.md` → Epic: apple-pay, Owner: designer
- `TP-004-apple-pay-tests.md` → Epic: apple-pay, Owner: e2e

See `/tickets/EPICS.md` for a list of all active epics and their status.

## E2E Tickets

For significant features, there should usually be at least one ticket with:

- `Owner role: e2e`
- Scenarios to be covered.
- Target environments (staging, pre-prod, etc.).
- Clear "Done" definition tied to E2E coverage.

## Open Questions

Questions that block work or need clarification should go into
`OPEN_QUESTIONS.md` and/or be referenced from tickets.
