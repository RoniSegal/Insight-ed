# Claude Multi-Agent R&D OS – growth-engine

This repo represents an R&D department for the project:

- Name: growth-engine
- Domain: education
- Summary: We have a chagpt prompt that helps teachers to find out the strength and weakmesses points of wach student. the prompt receives a student name than ask questions, the responses are free style. thhen the chatpgt analyze the response and return a output with full anlysis and recommenstaion for the student. we need a system that will hold all student and will give option to analyze each one. the analysis will use the above mmetioned prompt
- Primary users: teachers, principles
- Core flows: teacher: logs in->choose student name->start analysis->recive the output, principle: logs in -> see dashboard of all students per class, teacher and principle: dashboard of all data eligible to see with trends
- FE stack: next.js
- BE stack: nest with typescript
- Integrations: DB
- Constraints: none
- Repo structure: packages

---

## 🧠 Operating Model

Work is **role-based** and **ticket-driven**.

**Core Agents:**
- Product
- Architect
- Designer
- Backend
- Frontend
- E2E Test Engineer

**Quality Gate Agents:**
- Code Reviewer (`.claude/agents/code-reviewer.md`)
- Team Lead (`.claude/agents/team-lead.md`)

**Optional Specialist Agents:**
- DevOps, Data Engineer, ML Engineer, Security Engineer, QA Engineer, etc.

Claude must:
- **Run agents in parallel when tasks are independent** (use multiple Task tool calls in a single message)
- Run agents sequentially only when there are dependencies between tasks
- Respect ticket ownership and dependencies
- Avoid mixing roles in a single run (one ticket = one owner role)

**Parallel vs Sequential Execution:**

✅ **Run in PARALLEL** (single message with multiple Task calls):
- Designer + Backend + Frontend all working on different tickets in same epic
- Code reviewer reviewing multiple independent files
- Multiple E2E test agents running different test suites
- Exploring multiple parts of codebase simultaneously

❌ **Run SEQUENTIALLY** (wait for one to finish before starting next):
- Backend must finish API before Frontend can integrate
- Architect must design before Backend/Frontend can implement
- Code must be written before Code Reviewer can review
- Code Reviewer must approve before Team Lead can verify

**Example - Parallel:**
```
User: "Implement the login feature"
Claude: [Sends ONE message with THREE Task calls]:
  1. Task(subagent_type='designer', prompt='Design login UI')
  2. Task(subagent_type='backend', prompt='Implement login API')
  3. Task(subagent_type='e2e', prompt='Plan login E2E tests')
```

**Example - Sequential:**
```
User: "Add authentication endpoint"
Claude: [Task(subagent_type='backend')] → waits for completion
Claude: [Task(subagent_type='code-reviewer')] → waits for approval
Claude: [Task(subagent_type='team-lead')] → waits for final approval
```

Tickets live in `/tickets` and are the **source of truth** for work.

**Epic-based workflow:**
- Related tickets across multiple roles (designer, backend, frontend, e2e) are grouped by **Epic** field.
- Each ticket has an `Epic:` field (e.g., "apple-pay", "user-auth", "project-setup").
- Users can say "implement apple-pay" to work on all tickets in that epic across all agents.
- `/tickets/EPICS.md` tracks all epics and their status.
- Standalone tickets use `Epic: (none)`.

---

## 📂 Core Project Folders

- `/context` → client background, requirements, discovery notes, decisions
- `/docs` → PRD, architecture, design and other long-form docs
- `/tickets` → backlog, epics, feature and tech tickets
- `/.claude/agents` → agent definitions for this project

Agents should always read from these before making changes.

---

## 🎨 Universal Code Standards

**These rules apply to ALL agents (Designer, Backend, Frontend, E2E, Specialists):**

### 1. Minimal Code Changes Only
- **Only modify code that is directly necessary** to meet the ticket requirements
- Do NOT make "improvements" or "optimizations" outside the scope of the task
- Do NOT refactor existing code unless:
  - The user explicitly requests it, OR
  - Refactoring is required to complete the ticket, OR
  - Code reviewer identifies a blocking issue that requires refactoring
- Three similar lines of code is better than a premature abstraction
- If existing code works, leave it alone

### 2. No Refactoring Without Approval
- **Never refactor code "while you're there"** - this introduces unnecessary risk
- Do NOT:
  - Rename variables or functions in unrelated code
  - Extract helpers or utilities for one-time operations
  - Simplify or reorganize code that isn't part of the ticket
  - Add type annotations or comments to code you didn't change
  - "Clean up" or "modernize" surrounding code
- **Exception:** Code reviewer or user explicitly approves the refactoring

### 3. No Dead Code
- **Remove all unused code** - do NOT leave commented-out code or unused imports
- If removing a feature, delete the code completely:
  - Remove unused functions, classes, components
  - Remove unused imports
  - Remove unused variables and constants
  - Remove unused CSS/styles
  - Remove unused test files
- Do NOT use backwards-compatibility hacks like:
  - Renaming unused vars to `_unusedVar`
  - Adding `// removed` comments for deleted code
  - Re-exporting types that are no longer used
  - Keeping old code "just in case"
- **Exception:** If uncertain whether code is unused, ask the user before deleting

### 4. Surgical Changes
- Make targeted, surgical changes to accomplish the task
- Minimize the diff - fewer lines changed = lower risk
- If you must touch a file, touch as few lines as possible
- Preserve existing code formatting, style, and patterns
- Match the existing codebase conventions exactly

**Example - GOOD:**
```diff
  function calculatePrice(item: Item): number {
-   return item.price;
+   return item.price * (1 - item.discount);
  }
```

**Example - BAD (unnecessary refactoring):**
```diff
- function calculatePrice(item: Item): number {
-   return item.price;
- }
+ // Calculate the final price after applying discount
+ const calculateDiscountedPrice = (item: Item): number => {
+   const basePrice = item.price;
+   const discountAmount = basePrice * item.discount;
+   return basePrice - discountAmount;
+ };
```

**Why These Rules Matter:**
- Reduces merge conflicts and review overhead
- Minimizes bugs introduced by unnecessary changes
- Keeps git history clean and focused
- Makes code reviews faster and more effective
- Reduces risk of breaking existing functionality

---

## 🔁 Phases

### 1. 🟥 Product Phase

Triggered by user commands like:
- "Run Product Phase" (initial setup)
- "Run Product Intake" (initial setup)
- "Product: work on requirements" (initial setup)
- "Add new feature: [feature name]" (post-launch incremental)
- "Product: process feature requests" (post-launch incremental)

Active agent: **Product** (`.claude/agents/product.md`).

**Two modes:**

**A. Initial Mode** - Setting up the project for the first time:
- Read all context files
- Create comprehensive PRD
- Generate initial backlog with all core epics

**B. Incremental Mode** - Adding features to a live system (two-phase process):

**Phase 1: Review & Approve**
- Read feature requests from `/context/feature-requests.md`
- Evaluate each request: alignment, impact, effort, fit with roadmap
- Approve, Reject, or Defer each request with reasoning
- Do NOT create tickets yet

**Phase 2: Create Tickets for Approved Features**
- Only work on features with Status: "Approved"
- Read existing PRD and tickets (preserve everything)
- Update PRD with new feature section
- Create NEW epic and tickets for approved feature only
- Do NOT modify existing epics/tickets

Responsibilities:
1. Read `/context/client.md`, `/context/requirements.md`, `/context/discovery.md`.
2. Produce or update `/docs/PRD.md`.
3. Generate tickets in `/tickets` grouped by **epics/features**:
   - Each ticket must have:
     - **Epic** - feature/epic name (e.g., "apple-pay") or "(none)" for standalone tickets
     - **Title** - clear description
     - **Owner role** - product, architect, designer, backend, frontend, e2e, or specialist
     - **Dependencies** - ticket IDs this depends on
     - **Context** - links to PRD sections and context files
     - **Acceptance Criteria** - testable statements
     - **Deliverables** - what should exist when done
   - For each epic, create tickets for ALL relevant roles (architect, designer, backend, frontend, e2e)
4. Update `/tickets/EPICS.md` with all epics and their tickets.
5. Maintain `/tickets/OPEN_QUESTIONS.md` for unknowns or blocked items.

The Product agent **must not** design architecture or implementation details.
It describes the *what* and *why*, not the *how*.

---

### 2. 🟦 Architect Phase

Triggered by commands like:
- "Run Architect Phase"
- "Architect: plan system"
- "Design architecture"

Active agent: **Architect** (`.claude/agents/architect.md`).

Responsibilities:
1. Read `/docs/PRD.md`, `/context/*`, and existing `/tickets`.
2. Produce or update `/docs/ARCHITECTURE.md`:
   - components and boundaries
   - data model
   - integration patterns for DB
   - non-functional requirements from none
3. Add or refine tickets for:
   - services, APIs, DB changes
   - cross-cutting concerns (auth, logging, observability, etc.)
   - infra concerns (scaling, deployment, resiliency)
4. Identify critical flows that **must have E2E tests** and coordinate with the E2E Test Engineer.

The Architect agent should **not** directly implement features, but it can propose structure, contracts, and patterns.

---

### 3. 🟨 Delivery Phases (Designer, Backend, Frontend)

Triggered by commands like:
- "Run Designer Tickets"
- "Run Backend Tickets"
- "Run Frontend Tickets"

Active agent: one of **Designer**, **Backend**, or **Frontend**.

General rules:
1. Read:
   - `/docs/PRD.md`
   - `/docs/ARCHITECTURE.md`
   - `/tickets/*.md`
   - relevant project code
2. Filter tickets where `Owner role` matches the current agent.
3. Respect `Dependencies` – do not work on a ticket whose dependencies are not satisfied.
4. For each ticket:
   - move it forward towards completion
   - update the ticket file with `Status`, notes, and links to code/docs
   - ensure acceptance criteria are met

The agent must not modify tickets owned by another role except to add clarifications or comments.

---

### 4. 🟩 E2E Test Phase

Triggered by commands like:
- "Run E2E Tests Phase"
- "Run E2E QA"
- "E2E: review features"

Active agent: **E2E Test Engineer** (`.claude/agents/e2e.md`).

Responsibilities:
1. Read:
   - `/docs/PRD.md`
   - `/docs/ARCHITECTURE.md`
   - `/context/*`
   - `/tickets/*.md`
   - test directories (e.g., `/e2e`, `/tests/e2e`, `/apps/*/e2e`)
2. For each feature/epic nearing completion:
   - Assess whether existing E2E tests are **sufficient**:
     - main success paths
     - key error / edge cases
     - important integrations
   - Decide whether new E2E tests are required.
3. Produce or update:
   - E2E test plans and coverage maps
   - tickets with `Owner role: e2e`
   - E2E test files or skeletons when appropriate
4. Act as **release gate**:
   - For each feature, explicitly mark:
     - "E2E status: ready for production" *with reasoning*  
       or  
     - "E2E status: NOT ready – missing tests: …"

The E2E agent must never mark a feature as **ready for production** if critical flows are untested or tests are failing/unreliable.

---

## 🧨 Missing Expertise Rule (Hiring New Agents)

The system starts with core agents: **Product, Architect, Designer, Backend, Frontend, E2E**.

Specialist agents can be added in TWO ways:
1. **During initial setup** (`rda brief` command) - Detected from project requirements
2. **During development** (Product/Architect identifies missing expertise)

### Adding Specialists During Setup (Recommended)

During `rda brief`, the CLI detects specialist needs based on your inputs:

- **DevOps**: Detected from keywords like Kubernetes, Docker, AWS Lambda, CI/CD, serverless
- **Data Engineer**: Detected from analytics, ETL, data warehouse, BigQuery, Airflow
- **ML Engineer**: Detected from ML, recommendations, predictions, TensorFlow, SageMaker
- **Security Engineer**: Detected from HIPAA, PCI, SOC2, compliance, security audit, healthcare, fintech
- **Mobile Engineer**: Detected from React Native, Flutter, Swift, Kotlin, iOS, Android
- **QA Engineer**: Detected from performance testing, load testing, test automation

The CLI will suggest detected agents and ask which ones to include. These are then generated when you run `rda gen-agents`.

**Benefit**: Specialist agents are available from day one, preventing work from being blocked later.

### Adding Specialists During Development

If work requires expertise beyond existing agents, the system must **hire a new specialist agent** before proceeding.

### Who Detects Missing Expertise?

**Product Agent** - During feature request review:
- Identifies if a feature needs DevOps, Data, ML, Security, Mobile, or other specialist expertise
- Marks feature request as **Status: Blocked** with reason
- Creates "Hire [ROLE] agent" ticket

**Architect Agent** - During architecture design:
- Identifies if architectural decisions require specialist expertise (e.g., ML pipelines, data warehousing, CI/CD)
- Creates "Hire [ROLE] agent" ticket
- Drafts agent specification

**Any Agent** - During ticket work:
- If blocked by missing expertise, escalate to Product or Architect
- Do NOT fake expertise or assign work to wrong agent

### Common Missing Expertise Examples

- **DevOps**: CI/CD, infrastructure as code, Kubernetes, deployment automation, monitoring
- **Data Engineer**: ETL, data warehousing, analytics, data pipelines, data quality
- **ML Engineer**: Model training, feature engineering, ML ops, model serving
- **Security Engineer**: Pentesting, compliance, threat modeling, security audits
- **Mobile Engineer**: Native iOS/Android (if web frontend insufficient)
- **QA Engineer**: Test automation frameworks, performance/load testing (beyond E2E)

### Process to Hire a New Agent

1. **Detect and Block**
   - Product or Architect identifies missing expertise
   - Feature/ticket is blocked until agent exists
   - Do NOT proceed with fake expertise

2. **Create "Hire Agent" Ticket**
   - **Title:** "Hire [Role] Agent" (e.g., "Hire DevOps Agent")
   - **Epic:** (none)
   - **Owner role:** architect
   - **Context:** Which feature(s) need this, why existing agents can't handle it
   - **Acceptance Criteria:** Draft spec → user approval → promote to active agent

3. **Draft Agent Specification**
   - Architect creates `.claude/agents/REQUEST-[role].md`
   - Uses `.claude/agents/_template-specialist.md` as template
   - Defines project-specific: mission, scope, inputs, outputs, quality gates
   - Be specific about owns vs. doesn't own

4. **User Review & Approval**
   - Architect stops and asks user to review `.claude/agents/REQUEST-[role].md`
   - User approves or requests changes
   - Once approved, promote to `.claude/agents/[role].md` (remove "REQUEST-" prefix)

5. **Unblock Work**
   - New agent is now available
   - Product unblocks feature requests that were waiting for this agent
   - Architect creates tickets with `Owner role: [new-role]`
   - Work proceeds

### Rules

- **NEVER fake expertise** - Backend should not do DevOps, Frontend should not do native mobile, E2E should not do load testing
- **ALWAYS stop and ask for approval** - Do not auto-create specialist agents
- **ONE agent type per ticket** - Each ticket has exactly one owner role
- **Specialist agents follow same rules** - Epic-based workflow, dependency chains, quality gates

---

## 🚫 Forbidden Behavior

Claude must never:

- Mix multiple roles in a single execution phase.
- Modify tickets owned by a different role (except to add comments/clarifications).
- Ignore ticket dependencies.
- Silently change PRD or architecture without updating tickets and documenting decisions.
- Mark a feature as production-ready without checking acceptance criteria and (where applicable) E2E status.
- **Violate Universal Code Standards:**
  - Make unnecessary code changes outside ticket scope
  - Refactor code without user approval
  - Leave dead code or commented-out code
  - Make non-surgical changes that create large diffs

---

## ✅ Definition of Done

Work on a ticket is considered **Done** only when:

- Acceptance criteria in the ticket are satisfied.
- Relevant documentation (PRD, ARCHITECTURE, design docs) is updated.
- Implementation is in the expected place in the repo (as per `repoStructure`).
- For features going to production, the E2E Test Engineer has either:
  - confirmed tests exist and are sufficient, or
  - clearly documented why E2E is not applicable for this ticket.

---

## 🛠 Setup Commands (First Time)

Before using the multi-agent system, initialize the project:

```bash
# 1. Initialize structure (one time)
rda init

# 2. Create project brief (captures requirements and detects needed agents)
rda brief

# 3. Generate agents based on brief
rda gen-agents
```

**During `rda brief`:**
- Answer questions about your project (name, domain, stack, integrations, etc.)
- CLI automatically detects which specialist agents you might need
- You confirm which specialist agents to include
- Saves to `project.brief.json` with `requiredAgents` field

**During `rda gen-agents`:**
- Generates core agents (always): product, architect, designer, backend, frontend, e2e, code-reviewer, team-lead
- Generates specialist agents (only if in `requiredAgents`): devops, data-engineer, ml-engineer, etc.
- Creates `.claude/agents/` with project-specific context

---

## 🎛 Typical Commands for the User

In this project, you can guide Claude using commands like:

**Initial Setup (first time):**
- "Run Product Phase according to .claude/agents/product.md"
- "Run Architect Phase according to .claude/agents/architect.md"
- "Run Designer Tickets according to .claude/agents/designer.md"
- "Run Backend Tickets according to .claude/agents/backend.md"
- "Run Frontend Tickets according to .claude/agents/frontend.md"
- "Run E2E Tests Phase according to .claude/agents/e2e.md"

**Adding New Features (post-launch - two-phase workflow):**

Phase 1 - Review & Approve:
- "Product: review feature requests" → Product reviews and approves/rejects requests
- "Product: triage new requests" → Same as above

Phase 2 - Create Tickets:
- "Product: create tickets for approved features" → Creates PRD sections + tickets for approved features
- "Product: add [feature name] to PRD" → Creates PRD + tickets for specific approved feature

**Epic-based Implementation:**
- "Implement apple-pay feature" → Works on all tickets where Epic: apple-pay across all relevant agents
- "Continue with project-setup epic" → Resumes work on all project-setup tickets
- "Show me the status of user-auth epic" → Reports on all tickets in the user-auth epic

**Incremental Feature Workflow (Post-Launch):**

1. **Capture**: User or PM adds feature request to `/context/feature-requests.md` (Status: New)

2. **Review & Interview**: User says "Product: review feature requests"
   - Product agent reads each request
   - **If unclear or incomplete:** Uses `AskUserQuestion` to interview user and clarify:
     - Problem clarity, user segment, success criteria
     - Scope (in/out), constraints, dependencies, priority
   - Updates request with clarified details
   - Evaluates priority, impact, and fit with product vision
   - Approves, rejects, or defers with reasoning
   - Updates Status and Product Decision fields
   - Reports summary to user

3. **Create Tickets**: User says "Product: create tickets for approved features"
   - Product agent ONLY works on Status: "Approved" requests
   - Updates PRD (preserves existing content)
   - Creates new epic and tickets for approved features
   - Updates `/tickets/EPICS.md`
   - Updates request Status to "In PRD"

4. **Implement**: User runs architect/designer/backend/frontend/e2e phases for the NEW epic
   - Feature is implemented incrementally without affecting existing code

**Key Gate:** Feature requests must be approved by Product before tickets are created.

When working on an epic, Claude should:
1. Identify all tickets with matching Epic field
2. Work through them in dependency order
3. Activate the appropriate agent for each ticket's owner role
4. Update `/tickets/EPICS.md` to track progress

Claude must always respect the role separation and rules in this document.
