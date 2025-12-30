# Feature Requests

This file tracks new feature requests that come in after initial deployment.

## Workflow

Feature requests follow this lifecycle:

1. **New** - Feature request is captured here (by user or Product agent)
2. **Under Review** - Product agent is evaluating and may interview user for clarity
3. **Approved** - Product has approved; ready to add to PRD and create tickets
4. **In PRD** - Added to PRD, tickets created, ready for implementation
5. **In Development** - Tickets are being worked on
6. **Shipped** - Feature is deployed
7. **Rejected** - Product decided not to proceed (with reason)

**IMPORTANT:** Feature requests do NOT automatically become tickets. The Product agent must:
1. Review each request
2. **Interview user if unclear** - Clarify problem, users, success criteria, constraints, scope
3. Update request with clarified details
4. Evaluate priority, impact, and fit with product vision
5. Explicitly approve or reject
6. Only AFTER approval, add to PRD and create tickets

**Product Interview:** If a request is vague or incomplete, the Product agent should use `AskUserQuestion` to gather:
- Problem clarity (specific pain points, scenarios)
- User segment (who needs this?)
- Success criteria (how do we measure success?)
- Scope (what's in vs. out of scope?)
- Constraints (technical, timeline, budget)
- Dependencies (other features, integrations)
- Priority (urgency, business impact)

## Template for New Feature Requests

When adding a new feature request, use this format:

```markdown
### [Feature Name]
**Date:** YYYY-MM-DD
**Requested by:** User/stakeholder name or user segment
**Priority:** P0 (critical) | P1 (high) | P2 (medium) | P3 (low)
**Status:** New | Under Review | Approved | In PRD | In Development | Shipped | Rejected

**Problem:**
What problem does this solve for users? (filled initially, clarified by Product during review)

**Proposed Solution:**
High-level description of what the feature should do. (filled initially, clarified by Product during review)

**User Segment:**
Who are the primary users? (filled by Product during interview)

**Success Criteria:**
How will we measure success? (filled by Product during interview)

**Scope:**
- In scope: (filled by Product during interview)
- Out of scope: (filled by Product during interview)

**Impact:**
- Expected user benefit: (filled by Product)
- Business impact: (filled by Product)
- Effort estimate (if known): Small | Medium | Large (filled by Product)

**Required Expertise:** (filled by Product agent during review)
List of agents needed to implement this feature:
- [ ] architect
- [ ] designer
- [ ] backend
- [ ] frontend
- [ ] e2e
- [ ] **NEW AGENT NEEDED:** [role name] - Reason: [why existing agents can't handle this]

**Product Decision:** (filled by Product agent during review)
- [ ] Approved - Reason:
- [ ] Rejected - Reason:
- [ ] Deferred - Until:
- [ ] Blocked - Waiting for new agent: [role name]

**Notes:**
Any additional context, constraints, or dependencies.
```

---

## New Feature Requests (Status: New)

Requests awaiting Product review:

### Example: Push Notifications
**Date:** 2024-01-15
**Requested by:** Mobile users
**Priority:** P1
**Status:** New

**Problem:**
Users miss important updates because they don't check the app frequently.

**Proposed Solution:**
Add push notifications for key events: order updates, messages, and alerts.

**Impact:**
- Improved user engagement
- Better retention
- Effort: Large (requires backend infra + mobile SDK integration)

**Product Decision:**
- [ ] Approved - Reason:
- [ ] Rejected - Reason:
- [ ] Deferred - Until:

**Notes:**
Consider notification preferences, quiet hours, and notification grouping.

---

## Blocked Requests (Status: Blocked)

Feature requests that need a new specialist agent before they can proceed:

### Example: Automated CI/CD Pipeline
**Date:** 2024-01-20
**Requested by:** Engineering team
**Priority:** P1
**Status:** Blocked

**Problem:**
Manual deployments are error-prone and time-consuming. Need automated CI/CD pipeline.

**Proposed Solution:**
Set up automated pipeline: build → test → deploy to staging → deploy to production with rollback capability.

**Impact:**
- Faster deployments (manual: 2hrs → automated: 15min)
- Fewer deployment errors
- Better developer experience
- Effort: Large (requires infrastructure setup, pipeline configuration)

**Required Expertise:**
- [x] architect - Pipeline architecture and design
- [x] backend - Integration with existing services
- [ ] frontend - Not needed
- [ ] designer - Not needed
- [x] e2e - Testing in pipeline
- [x] **NEW AGENT NEEDED: devops** - CI/CD expertise, infrastructure as code, container orchestration, deployment automation

**Product Decision:**
- [ ] Approved - Reason:
- [ ] Rejected - Reason:
- [x] Blocked - Waiting for new agent: devops
  - **Reason:** DevOps expertise required for CI/CD, Kubernetes, and infrastructure automation. Backend agent cannot adequately own this specialized work. Created ticket: TP-025-hire-devops-agent.md

**Notes:**
Once DevOps agent is approved and created, this feature can be unblocked and moved to "Approved" status.

---

## Approved Requests (Status: Approved)

Feature requests approved by Product, ready for ticket creation:

### Example: Dark Mode
**Date:** 2024-01-10
**Requested by:** Premium users
**Priority:** P2
**Status:** Approved

**Problem:**
Users want dark mode for better usability in low-light conditions.

**Proposed Solution:**
Add system-wide dark mode with automatic switching based on OS preference.

**Impact:**
- Better UX for premium users
- Competitive feature
- Effort: Medium (CSS theming system + persistence)

**Product Decision:**
- [x] Approved - Reason: Highly requested by premium tier, aligns with accessibility goals
- [ ] Rejected - Reason:
- [ ] Deferred - Until:

---

## In PRD / In Development

Feature requests that have been added to PRD and have tickets:

- **Dark Mode** - Status: In PRD - Epic: dark-mode (created YYYY-MM-DD)
- **Search Filters** - Status: In Development - Epic: search-filters (created YYYY-MM-DD)

---

## Shipped Features

Features that have been deployed:

- **User Profile** - Shipped in v1.1 on YYYY-MM-DD - Epic: user-profile
- **Export Data** - Shipped in v1.0 on YYYY-MM-DD - Epic: data-export

---

## Rejected / Deferred Requests

### Example: Cryptocurrency Payments
**Date:** 2024-01-08
**Requested by:** Individual user
**Priority:** P3
**Status:** Rejected

**Problem:**
Some users want to pay with cryptocurrency.

**Proposed Solution:**
Integrate crypto payment gateway.

**Product Decision:**
- [ ] Approved - Reason:
- [x] Rejected - Reason: Not aligned with current payment strategy, low user demand (single request), high regulatory complexity
- [ ] Deferred - Until:

### Example: AI Chat Assistant
**Date:** 2024-01-12
**Requested by:** Customer success team
**Priority:** P2
**Status:** Deferred

**Problem:**
Support team is overwhelmed with common questions.

**Proposed Solution:**
Add AI-powered chat assistant for FAQ handling.

**Product Decision:**
- [ ] Approved - Reason:
- [ ] Rejected - Reason:
- [x] Deferred - Until: Q3 2024 - Good idea but waiting for AI costs to decrease and LLM integration patterns to mature

