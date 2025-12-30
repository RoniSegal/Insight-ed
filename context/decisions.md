# Decisions / ADR Index

Track important architectural and product decisions here. Link to detailed ADR (Architecture Decision Record) files in `/docs` when needed.

## Quick Reference

### Tech Stack Decisions

- **Frontend Framework:** next.js
  - _Rationale:_ TBD
  - _Date:_ TBD

- **Backend Framework:** nest with typescript
  - _Rationale:_ TBD
  - _Date:_ TBD

- **Key Integrations:** DB
  - _Rationale:_ TBD
  - _Date:_ TBD

### Infrastructure Decisions

none

_Detailed rationale:_ TBD

## Decision Log

### Template for New Decisions

```markdown
## [Decision Title]
**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded
**Deciders:** Who was involved in this decision

**Context:**
What is the issue we're facing?

**Decision:**
What did we decide to do?

**Consequences:**
- Positive: What benefits does this bring?
- Negative: What trade-offs are we accepting?
- Risks: What could go wrong?

**Alternatives Considered:**
1. Option A - Why rejected
2. Option B - Why rejected

**Related Decisions:**
- Links to related ADRs or decisions
```

---

## Decisions

### Decision 1: Use PostgreSQL for Primary Database
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Architect

**Context:**
Growth Engine requires a database that can handle:
- Structured relational data (users, students, schools, classes)
- Flexible semi-structured data (AI analysis results with varying structure)
- Complex queries for analytics and trends
- Strong data integrity for education compliance (FERPA)
- Scalability to 100k+ students and 500k+ analyses

**Decision:**
Use PostgreSQL 15+ as the primary database.

**Consequences:**
- **Positive:**
  - Strong ACID guarantees critical for educational data integrity
  - Excellent support for JSON/JSONB (flexible analysis result storage)
  - Mature ecosystem with robust ORMs (TypeORM, Prisma)
  - Full-text search capabilities for student search
  - Advanced analytics capabilities (window functions, CTEs)
  - Excellent managed service options (AWS RDS, Google Cloud SQL, Azure Database)
  - Strong compliance track record (FERPA, HIPAA-ready)
- **Negative:**
  - Requires more operational overhead than NoSQL solutions
  - Vertical scaling limits (though mitigated by cloud providers)
  - Schema migrations require careful planning
- **Risks:**
  - Need to plan for scaling strategy (read replicas, connection pooling) as we grow
  - Large analytics queries may require optimization (caching, materialized views)

**Alternatives Considered:**
1. **MongoDB** - Rejected:
   - Complex joins difficult for our relational data model
   - Weaker consistency guarantees
   - Less mature for analytics use cases
2. **MySQL** - Rejected:
   - PostgreSQL has superior JSON support (critical for flexible analysis data)
   - Better analytics capabilities (window functions)
   - More advanced indexing options
3. **SQLite** - Rejected:
   - Not suitable for multi-user web application
   - No built-in replication or scaling

**Related Decisions:**
- ORM choice (TypeORM vs. Prisma) - see Decision 2

---

### Decision 2: Use TypeScript for Full Stack
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Frontend Lead, Backend Lead

**Context:**
Need to choose type safety strategy for codebase. Project involves complex data models (students, analyses, users) and API contracts between frontend and backend. Type safety critical for:
- Catching errors at compile time
- Improving developer experience and IDE support
- Reducing bugs in production
- Enabling safe refactoring

**Decision:**
Use TypeScript for both frontend (Next.js) and backend (NestJS) with strict mode enabled.

**Consequences:**
- **Positive:**
  - End-to-end type safety from database to UI
  - Shared types between frontend and backend (via shared package)
  - Excellent IDE support and autocomplete
  - Catches many bugs at compile time
  - Self-documenting code (types serve as inline documentation)
  - Both Next.js and NestJS have first-class TypeScript support
  - Easier onboarding for new developers (types explain data structures)
- **Negative:**
  - Slightly slower development initially (writing type definitions)
  - Learning curve for team members unfamiliar with TypeScript
  - Build step required (TypeScript compilation)
  - Occasionally need to fight with complex types
- **Risks:**
  - Over-typing can lead to maintenance burden (use `unknown` and `any` sparingly)
  - Type definitions can get out of sync with runtime (need validation at boundaries)

**Alternatives Considered:**
1. **JavaScript only** - Rejected:
   - Too many runtime errors in production
   - Difficult to maintain as codebase grows
   - Poor developer experience for large teams
2. **TypeScript with loose tsconfig** - Rejected:
   - Defeats purpose of type safety
   - Still have compilation overhead without benefits
   - Prefer strict mode for maximum safety

**Related Decisions:**
- Validation library choice (Joi, class-validator, Zod)
- Shared types package structure

---

### Decision 3: Use Next.js for Frontend Framework
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Frontend Lead

**Context:**
Need a modern React framework that supports:
- Server-side rendering for fast initial page loads (important for schools with slow connections)
- Static generation for marketing pages
- Built-in routing and API routes
- Good developer experience
- Production-ready optimizations

**Decision:**
Use Next.js 14+ with App Router (React Server Components).

**Consequences:**
- **Positive:**
  - Best-in-class React framework with excellent DX
  - Server-side rendering improves performance and SEO
  - Built-in optimizations (image optimization, code splitting, font optimization)
  - API routes for BFF (Backend for Frontend) pattern if needed
  - Excellent documentation and community support
  - React Server Components reduce JavaScript bundle size
  - TypeScript support out of the box
  - Vercel deployment option (zero-config deployments)
- **Negative:**
  - App Router is newer, some patterns still evolving
  - Server components add complexity for team unfamiliar with them
  - Vendor lock-in to Next.js patterns
  - More complex than plain React
- **Risks:**
  - Breaking changes between major versions (mitigation: pin versions, thorough testing)
  - Server components paradigm shift may confuse developers initially

**Alternatives Considered:**
1. **Create React App** - Rejected:
   - No longer actively maintained
   - Lacks SSR capabilities
   - Poor performance for our use case
2. **Remix** - Rejected:
   - Smaller ecosystem and community
   - Less mature than Next.js
   - Team less familiar with it
3. **Vite + React** - Rejected:
   - Requires more manual setup
   - No built-in SSR (would need to add meta-framework)
   - Next.js provides more out-of-the-box

**Related Decisions:**
- State management library (Zustand vs. Context)
- UI component library (shadcn/ui, Radix UI)
- Deployment platform (Vercel vs. self-hosted)

---

### Decision 4: Use NestJS for Backend Framework
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Backend Lead

**Context:**
Need a Node.js backend framework that supports:
- TypeScript-first development
- Modular architecture for scalability
- Dependency injection for testability
- Built-in validation and error handling
- OpenAPI/Swagger documentation generation
- Enterprise-grade patterns and structure

**Decision:**
Use NestJS 10+ with TypeScript for backend API server.

**Consequences:**
- **Positive:**
  - Angular-inspired architecture familiar to enterprise developers
  - Excellent TypeScript support (built for TypeScript)
  - Modular design encourages clean architecture
  - Built-in dependency injection improves testability
  - Decorators make code declarative and readable
  - Built-in validation pipes (class-validator)
  - Automatic Swagger/OpenAPI documentation generation
  - Excellent ecosystem (Passport, TypeORM, Bull, etc.)
  - Strong convention over configuration
  - Great for monolithic and microservices architectures
- **Negative:**
  - Steeper learning curve than Express
  - More opinionated (less flexibility)
  - Heavier framework (more boilerplate)
  - Decorator-heavy syntax may feel unfamiliar
- **Risks:**
  - Over-engineering risk (NestJS can be overkill for simple APIs)
  - Vendor lock-in to NestJS patterns

**Alternatives Considered:**
1. **Express.js** - Rejected:
   - Too minimal, requires assembling many pieces
   - No built-in structure (leads to inconsistent codebases)
   - Poor TypeScript support out of the box
2. **Fastify** - Rejected:
   - More performant but less structure
   - Smaller ecosystem
   - Less familiar to team
3. **Koa** - Rejected:
   - Minimal like Express
   - Smaller community and ecosystem
   - Less TypeScript support

**Related Decisions:**
- ORM choice (TypeORM vs. Prisma)
- Validation library (class-validator via NestJS pipes)
- API design pattern (RESTful vs. GraphQL)

---

### Decision 5: Monorepo with npm Workspaces
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, DevOps Lead

**Context:**
Project requires multiple packages:
- Frontend (Next.js)
- Backend (NestJS)
- Shared types and utilities
- Database schemas and migrations

Need to decide on repository structure and tooling.

**Decision:**
Use monorepo architecture with npm workspaces (Node.js native workspaces).

**Consequences:**
- **Positive:**
  - Single repository simplifies coordination and versioning
  - Shared code (types, utilities) easily accessible to all packages
  - Atomic commits across frontend and backend
  - Simplified CI/CD (single pipeline)
  - No need for separate npm publishing for internal packages
  - npm workspaces is zero-config (built into npm 7+)
  - Works well with TypeScript project references
- **Negative:**
  - Larger repository size (slower clones)
  - More complex build orchestration
  - Risk of coupling between packages if not careful
  - CI/CD needs to be smart about which packages changed
- **Risks:**
  - Circular dependencies between packages
  - Build time increases as monorepo grows (mitigation: caching, Turborepo if needed)

**Alternatives Considered:**
1. **Separate repositories (multirepo)** - Rejected:
   - Complex coordination between frontend and backend changes
   - Difficult to share types (need to publish to npm or use git submodules)
   - More complex CI/CD setup
   - Versioning nightmare for breaking changes
2. **pnpm workspaces** - Considered:
   - Faster than npm, better disk space usage
   - Rejected: npm workspaces sufficient for MVP, can migrate later if needed
3. **Yarn workspaces** - Considered:
   - Similar to npm workspaces
   - Rejected: npm is simpler (one less tool), built-in to Node.js
4. **Turborepo** - Deferred:
   - Excellent for large monorepos with caching and parallel builds
   - Overkill for MVP, can add later if build times become issue

**Related Decisions:**
- Package structure and naming conventions
- Shared code organization (/packages/shared)
- Build orchestration strategy

---

### Decision 6: PostgreSQL ORM - Defer to Architect Phase
**Date:** 2025-12-30
**Status:** Proposed (Awaiting Architecture Phase)
**Deciders:** Tech Lead, Backend Lead (decision during Architect Phase)

**Context:**
Need to choose ORM (Object-Relational Mapping) library for database interactions. Top candidates:
- **Prisma:** Modern ORM, excellent DX, type-safe query builder
- **TypeORM:** Mature, NestJS-integrated, similar to JPA/Hibernate

Both have strong TypeScript support and work well with NestJS.

**Proposed Decision:**
Recommend **Prisma** for its superior developer experience and type safety, but final decision during Architect Phase after team evaluation.

**Factors to Consider:**
- **Prisma Pros:** Better type safety, automatic migrations, excellent introspection, modern syntax
- **Prisma Cons:** Newer (less mature), separate schema language, opinionated migrations
- **TypeORM Pros:** More mature, NestJS native support, familiar to Java devs, flexible
- **TypeORM Cons:** Less type-safe, manual migrations, heavier decorators

**Decision Point:** Architect Phase (when designing data model)

---

### Decision 7: Authentication Strategy - Defer to Architect Phase
**Date:** 2025-12-30
**Status:** Proposed (Awaiting Architecture Phase)
**Deciders:** Tech Lead, Security Lead

**Context:**
Need to decide on authentication implementation:
- **Self-managed:** Build with Passport.js + JWT + bcrypt
- **Auth-as-a-Service:** Use Auth0, Clerk, AWS Cognito, or similar

Critical requirements:
- Email/password authentication
- SSO with Google Workspace and Microsoft 365
- Role-based access control (Teacher, Principal, Admin)
- Session management
- MFA support (future)

**Proposed Decision:**
Recommend **self-managed auth with Passport.js** for MVP to avoid per-user costs and vendor lock-in, but evaluate Auth0 for faster time-to-market.

**Factors to Consider:**
- **Self-managed Pros:** No per-user costs, full control, no vendor lock-in
- **Self-managed Cons:** Security responsibility, more development time, maintenance burden
- **Auth0 Pros:** Fast implementation, battle-tested security, built-in MFA
- **Auth0 Cons:** Costs scale with users, vendor lock-in, complexity for simple use case

**Decision Point:** Early in Architect Phase (impacts timeline and budget)

---

### Decision 8: Deployment Platform - Defer to Architect Phase
**Date:** 2025-12-30
**Status:** Proposed (Awaiting Architecture Phase)
**Deciders:** Tech Lead, DevOps Lead

**Context:**
Need to choose cloud provider and deployment strategy. Options:
- **AWS:** Most mature, comprehensive services, complex
- **Google Cloud Platform:** Strong K8s, good education discounts, simpler than AWS
- **Microsoft Azure:** Good for enterprises using Microsoft stack
- **Vercel + Railway/Render:** Simplified deployment, good for MVP

Requirements:
- Managed PostgreSQL
- Managed Redis
- Container hosting
- FERPA-compliant infrastructure

**Proposed Decision:**
Recommend **Google Cloud Platform** for education focus and simplicity, but evaluate during Architect Phase based on:
- Education pricing and programs
- Team expertise
- Managed service quality
- Compliance certifications
- Total cost of ownership

**Decision Point:** Architect Phase (before infrastructure setup)

---

## Decision Summary Table

| # | Decision | Status | Impact | Decider Phase |
|---|----------|--------|--------|---------------|
| 1 | PostgreSQL Database | ✅ Accepted | High | Discovery |
| 2 | TypeScript Full Stack | ✅ Accepted | High | Discovery |
| 3 | Next.js Frontend | ✅ Accepted | Medium | Discovery |
| 4 | NestJS Backend | ✅ Accepted | Medium | Discovery |
| 5 | Monorepo with npm Workspaces | ✅ Accepted | Medium | Discovery |
| 6 | ORM Choice (Prisma/TypeORM) | ⏳ Deferred | Medium | Architect |
| 7 | Authentication Strategy | ⏳ Deferred | High | Architect |
| 8 | Cloud Provider | ⏳ Deferred | High | Architect |

---

## Future Decisions to Track

As the project progresses, document decisions for:
- UI component library (shadcn/ui, Radix UI, MUI)
- Chart/visualization library (Recharts, Chart.js, Victory)
- Email service provider (SendGrid, SES, Postmark)
- State management (Zustand, Redux Toolkit, Context)
- Testing framework specifics (Jest config, E2E tool choice)
- CI/CD pipeline details (GitHub Actions workflows)
- Monitoring and APM tools (Datadog, New Relic, Sentry)
- Feature flags system (LaunchDarkly, Unleash, custom)
- Error tracking (Sentry, Rollbar, Bugsnag)
- Logging strategy (Winston, Pino, structured logging format)
