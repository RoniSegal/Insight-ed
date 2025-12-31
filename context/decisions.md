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

### Decision 6: PostgreSQL ORM - Prisma
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Backend Lead, Architect

**Context:**
Need to choose ORM (Object-Relational Mapping) library for database interactions. Top candidates:
- **Prisma:** Modern ORM, excellent DX, type-safe query builder
- **TypeORM:** Mature, NestJS-integrated, similar to JPA/Hibernate

Both have strong TypeScript support and work well with NestJS.

**Decision:**
Use **Prisma 5+** as the ORM for database interactions.

**Rationale:**
- **Superior Type Safety:** Prisma generates TypeScript types directly from schema, eliminating runtime type mismatches
- **Developer Experience:** Auto-completion, schema migrations, and Prisma Studio for database visualization
- **Automatic Migrations:** `prisma migrate` handles schema changes with version control
- **Modern Syntax:** Clean, intuitive API that's easier to learn than TypeORM decorators
- **JSONB Support:** Excellent support for PostgreSQL JSONB (needed for analysis results)
- **NestJS Integration:** Works seamlessly with NestJS via `@prisma/client`
- **Community Momentum:** Rapidly growing ecosystem and active development

**Consequences:**
- **Positive:**
  - Faster development with auto-generated types
  - Fewer runtime errors due to compile-time type checking
  - Schema-first approach encourages better database design
  - Excellent migration tooling reduces deployment risk
- **Negative:**
  - Separate schema language (Prisma Schema Language) vs. TypeScript decorators
  - Slightly less mature than TypeORM (though production-ready)
  - Team needs to learn new schema syntax
- **Risks:**
  - Vendor lock-in to Prisma (mitigated by active community and open-source)
  - Complex queries may require raw SQL (acceptable for edge cases)

**Alternatives Considered:**
1. **TypeORM** - Rejected:
   - Less type-safe (decorators don't generate types)
   - Manual migrations are error-prone
   - Heavier syntax with more boilerplate
2. **Sequelize** - Rejected:
   - Poor TypeScript support
   - Less active development
   - Not designed for modern TypeScript workflows

**Related Decisions:**
- PostgreSQL as primary database (Decision 1)
- TypeScript full stack (Decision 2)

---

### Decision 7: Authentication Strategy - Self-Managed with Passport.js
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Security Lead, Architect

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

**Decision:**
Use **self-managed authentication** with Passport.js, JWT tokens, and bcrypt password hashing.

**Rationale:**
- **Cost Control:** No per-user costs; critical for scaling to thousands of teachers without SaaS fees
- **Full Control:** Complete control over auth logic, session management, and data sovereignty
- **FERPA Compliance:** Student data never sent to third-party auth providers
- **No Vendor Lock-in:** Can modify or migrate authentication without vendor constraints
- **SSO Support:** Passport.js supports Google OAuth and Microsoft OAuth via official strategies
- **NestJS Integration:** Passport integrates seamlessly with NestJS via `@nestjs/passport`
- **Proven Pattern:** Well-established pattern with extensive community support

**Implementation Details:**
- **Password Auth:** bcrypt with 10 rounds for password hashing
- **JWT Tokens:** Short-lived access tokens (15 min) + refresh tokens (7 days)
- **HTTP-only Cookies:** Prevent XSS attacks on tokens
- **SSO Strategies:** `passport-google-oauth20` and `passport-microsoft`
- **RBAC:** Role-based guards at controller/route level

**Consequences:**
- **Positive:**
  - Zero marginal cost per user (only infrastructure costs)
  - Complete flexibility to customize auth flows
  - No external dependencies for core functionality
  - Data privacy and FERPA compliance ensured
  - Educational institutions prefer self-hosted auth for security
- **Negative:**
  - More development time initially (estimate: 1-2 weeks)
  - Security responsibility (mitigated by following best practices)
  - Need to implement password reset, email verification ourselves
  - MFA requires custom implementation (future enhancement)
- **Risks:**
  - Security vulnerabilities if not implemented correctly (mitigated by code review, security audit)
  - Maintenance burden for auth infrastructure (acceptable trade-off)

**Alternatives Considered:**
1. **Auth0** - Rejected:
   - Cost: $23/month per active user → $11,500/month for 500 teachers (unsustainable)
   - Vendor lock-in makes future migration difficult
   - Overkill for our simple RBAC requirements
   - External dependency for critical infrastructure
2. **AWS Cognito** - Rejected:
   - Complex setup and configuration
   - Less flexible than Passport.js for custom flows
   - Ties us to AWS ecosystem
3. **Clerk** - Rejected:
   - Similar pricing concerns as Auth0
   - Newer, less proven in education sector

**Related Decisions:**
- NestJS backend framework (Decision 4)
- Security architecture and FERPA compliance (see ARCHITECTURE.md)

---

### Decision 8: Deployment Platform - Google Cloud Platform (GCP)
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, DevOps Lead, Architect

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

**Decision:**
Use **Google Cloud Platform (GCP)** as the primary cloud provider.

**Rationale:**
- **Education Focus:** Google for Education programs offer significant discounts for education sector
- **Simplicity:** GCP has cleaner, more intuitive interface than AWS
- **Managed Services:** Excellent managed services aligned with our stack:
  - Cloud SQL for PostgreSQL (highly rated, reliable)
  - Memorystore for Redis (managed Redis service)
  - Cloud Run for serverless containers (simpler than Kubernetes, auto-scaling)
  - Cloud Storage for file storage
  - Cloud CDN for static assets
- **FERPA Compliance:** GCP infrastructure is FERPA-compliant with proper configuration
- **Cost-Effective:** Competitive pricing + education discounts + free tier for development
- **Developer Experience:** Good integration with GitHub Actions, excellent documentation
- **Scalability:** Easy path from Cloud Run → GKE (Kubernetes) when needed

**Deployment Architecture:**
- **Compute:** Cloud Run (managed containers with auto-scaling)
- **Database:** Cloud SQL PostgreSQL (HA mode for production)
- **Cache:** Memorystore Redis (HA mode for production)
- **Storage:** Cloud Storage (file uploads, PDFs)
- **CDN:** Cloud CDN (static assets)
- **Logging:** Cloud Logging (centralized logs)
- **Monitoring:** Cloud Monitoring (uptime, metrics)
- **Container Registry:** Google Container Registry (Docker images)

**Consequences:**
- **Positive:**
  - Predictable costs with transparent pricing
  - Managed services reduce operational burden
  - Cloud Run simplifies deployment (no server management)
  - Excellent uptime SLAs (99.95% for Cloud Run, 99.95% for Cloud SQL)
  - Strong security posture with compliance certifications
  - Regional replication for disaster recovery
- **Negative:**
  - Vendor lock-in to GCP (mitigated by containerization)
  - Team needs to learn GCP (less ubiquitous than AWS)
  - Some services less mature than AWS equivalents
- **Risks:**
  - Cloud Run cold starts (mitigated by min instances config)
  - Cost overruns if not monitored (mitigated by budgets and alerts)
  - Regional outages (mitigated by multi-region failover plan)

**Cost Estimate (MVP with 500 teachers):**
- Cloud Run (frontend + backend): ~$200/month
- Cloud SQL PostgreSQL (db-n1-standard-2): ~$150/month
- Memorystore Redis (5GB): ~$50/month
- Cloud Storage (100GB): ~$3/month
- Data transfer & CDN: ~$50/month
- **Total:** ~$450/month (before education discounts)

**Alternatives Considered:**
1. **AWS (Amazon Web Services)** - Rejected:
   - More complex, steeper learning curve
   - Higher operational overhead (EC2, ECS, RDS)
   - Less education-focused than GCP
   - More expensive for equivalent services
2. **Microsoft Azure** - Rejected:
   - Less aligned with our stack (Node.js, PostgreSQL)
   - Stronger for Microsoft/.NET workloads
   - Less education sector presence than Google
3. **Vercel + Railway/Render** - Rejected:
   - Excellent for MVP but limited scalability
   - Higher costs at scale
   - Less control over infrastructure
   - Missing some enterprise features (VPC, advanced monitoring)

**Related Decisions:**
- Monorepo with npm workspaces (Decision 5)
- PostgreSQL database (Decision 1)
- CI/CD with GitHub Actions (see ARCHITECTURE.md)

---

### Decision 9: Email Service Provider - SendGrid
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Backend Lead, Architect

**Context:**
Need a reliable email service for transactional emails:
- Password reset emails
- Account activation
- Weekly digest reports (optional)
- Alert notifications for flagged students

**Decision:**
Use **SendGrid** for transactional email delivery.

**Rationale:**
- **Excellent Deliverability:** Industry-leading inbox placement rates
- **Generous Free Tier:** 100 emails/day free (3,000/month) - sufficient for MVP testing
- **Affordable Scaling:** $19.95/month for 50,000 emails (covers 500 teachers easily)
- **Template Management:** Built-in template editor for email design
- **Analytics:** Open rates, click rates, bounce tracking
- **NestJS Integration:** Good npm packages (`@sendgrid/mail`)
- **Proven Reliability:** Used by many SaaS products

**Alternatives Considered:**
1. **Amazon SES** - Viable alternative:
   - Pros: Very cheap ($0.10 per 1,000 emails), AWS integration
   - Cons: More complex setup, requires AWS SNS for bounces, less intuitive
2. **Postmark** - Rejected:
   - Pros: Excellent deliverability, beautiful templates
   - Cons: More expensive ($15/month for 10,000 emails), less generous free tier
3. **Mailgun** - Rejected:
   - Pros: Good API, reasonable pricing
   - Cons: Deliverability issues reported, less developer-friendly than SendGrid

**Related Decisions:**
- GCP deployment (Decision 8)

---

### Decision 10: State Management - Zustand
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Frontend Lead, Architect

**Context:**
Need client-side state management for Next.js frontend:
- User authentication state
- Dashboard data caching
- Form state (analysis session)
- UI state (modals, notifications)

**Decision:**
Use **Zustand** for client-side state management.

**Rationale:**
- **Simplicity:** Minimal boilerplate compared to Redux
- **Small Bundle Size:** ~1KB gzipped (vs. Redux ~10KB)
- **TypeScript-First:** Excellent TypeScript support out of the box
- **React Server Components Compatible:** Works well with Next.js 14 App Router
- **No Provider Wrapper:** Direct hook-based usage
- **Devtools Support:** Redux DevTools integration available
- **Performance:** Selective re-renders, no unnecessary re-renders

**Usage Pattern:**
```typescript
// stores/auth.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

**Alternatives Considered:**
1. **Redux Toolkit** - Rejected:
   - Pros: Industry standard, excellent DevTools, large ecosystem
   - Cons: More boilerplate, larger bundle size, overkill for our simple needs
2. **React Context** - Rejected:
   - Pros: Built-in, no dependencies
   - Cons: Performance issues with frequent updates, re-render entire subtree
3. **Jotai** - Considered:
   - Pros: Similar to Zustand, atomic state
   - Cons: Less mature, smaller community, less documentation

**Related Decisions:**
- Next.js frontend (Decision 3)

---

### Decision 11: Chart/Visualization Library - Recharts
**Date:** 2025-12-30
**Status:** Accepted
**Deciders:** Tech Lead, Frontend Lead, Architect

**Context:**
Need charting library for dashboards:
- Teacher dashboard: Class trends, completion rate over time
- Principal dashboard: School-wide analytics, grade-level comparisons
- Trends page: Time-series visualizations

**Decision:**
Use **Recharts** for data visualization.

**Rationale:**
- **React-Native:** Built specifically for React (not a wrapper)
- **Declarative API:** Composable chart components (very React-like)
- **Customizable:** Easy to style and customize for our Hebrew RTL design
- **TypeScript Support:** Good TypeScript definitions
- **Responsive:** Built-in responsiveness for mobile/desktop
- **Small Bundle Size:** ~95KB gzipped (reasonable)
- **Active Development:** Well-maintained, regular updates
- **Good Documentation:** Clear examples and API docs

**Chart Types Needed:**
- Bar charts (grade-level comparisons)
- Line charts (trends over time)
- Pie charts (completion rate distribution)
- Area charts (analysis volume over time)

**Example Usage:**
```typescript
<LineChart width={600} height={300} data={analysisData}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="count" stroke="#8884d8" />
</LineChart>
```

**Alternatives Considered:**
1. **Chart.js** - Rejected:
   - Pros: Very popular, extensive chart types
   - Cons: Imperative API (not React-like), requires wrapper (react-chartjs-2)
2. **Victory** - Rejected:
   - Pros: Excellent for complex visualizations, highly customizable
   - Cons: Larger bundle size (~200KB), steeper learning curve
3. **Nivo** - Rejected:
   - Pros: Beautiful defaults, comprehensive chart types
   - Cons: Larger bundle size, more complex API than Recharts

**Related Decisions:**
- Next.js frontend (Decision 3)
- Tailwind CSS styling (Decision 3)

---

### Decision 12: Primary Language - Hebrew with Full RTL Support
**Date:** 2025-12-31
**Status:** Accepted
**Deciders:** Product Lead, Tech Lead, Architect

**Context:**
Growth Engine targets the Israeli K-12 education market. Need to decide on primary language and internationalization (i18n) strategy:
- What is the primary language for all UI, system messages, and documentation?
- Do we support multiple languages from day one?
- How do we handle right-to-left (RTL) text direction?
- What about mixed Hebrew/English content (e.g., student names)?

Critical considerations:
- Target market: Israeli schools (Ministry of Education requirements)
- User base: Primarily Hebrew-speaking teachers and principals
- Adoption: Higher rates when users work in native language
- Compliance: Educational materials must be in local language

**Decision:**
Use **Hebrew (עברית) as the primary and only language** for MVP with full RTL (right-to-left) support. English language support deferred to post-MVP.

**Implementation Details:**

1. **Frontend i18n Framework:** next-intl
   - Native Next.js App Router support
   - Built-in RTL handling
   - Type-safe translations
   - Lightweight and performant

2. **Hebrew Typography:**
   - Primary font: Rubik (modern, clean, excellent Hebrew readability)
   - Fallback fonts: Heebo, Assistant
   - Google Fonts with Hebrew subset preloaded

3. **RTL CSS Strategy:**
   - Tailwind CSS with tailwindcss-rtl plugin
   - Use logical CSS properties (margin-inline-start vs margin-left)
   - HTML `dir="rtl"` attribute on root element
   - Bidirectional text support (dir="auto") for mixed content

4. **Database Unicode Support:**
   - PostgreSQL UTF-8 encoding with `he_IL.UTF-8` collation
   - Hebrew character range: U+0590-U+05FF explicitly supported
   - Unicode NFC normalization on all text inputs
   - Mixed Hebrew/English names allowed (e.g., "דוד Smith")

5. **API Validation:**
   - Name validation regex: `/^[\u0590-\u05FFa-zA-Z\s'-]+$/`
   - Error messages in Hebrew
   - Field names remain in English for API consistency

6. **Date/Number Formatting:**
   - Use Intl API with he-IL locale
   - Example: "30 בדצמבר 2025" for dates
   - Hebrew decimal notation (same as international)

7. **OpenAI Integration:**
   - System prompts in Hebrew
   - Explicitly instruct ChatGPT to respond in Hebrew
   - All analysis questions and responses in Hebrew

**Consequences:**
- **Positive:**
  - Higher adoption rates among target users (Hebrew-speaking teachers)
  - Meets Ministry of Education language requirements
  - Reduced cognitive load for non-English-speaking educators
  - Better accessibility for primary user base
  - Simpler MVP (single language reduces complexity)
  - Performance: Smaller translation bundles (~10-15KB gzipped)
  - Professional appearance for Israeli market
- **Negative:**
  - Limits initial market to Hebrew-speaking regions
  - International schools in Israel may require English version
  - Demo to English-speaking investors requires translation or explanation
  - Some English technical terms will remain (API, ChatGPT) - acceptable
  - RTL CSS requires more careful design and testing
- **Risks:**
  - Mixed Hebrew/English content may have layout issues (mitigated by dir="auto")
  - Font loading performance impact (mitigated by font preloading)
  - Unicode edge cases (diacritics, special characters) - mitigated by normalization

**Alternatives Considered:**
1. **English as primary language** - Rejected:
   - Target market is Israeli schools (Hebrew-speaking)
   - Lower adoption among teachers unfamiliar with English
   - Does not meet Ministry of Education requirements
   - Requires translation layer anyway for official communications
2. **Bilingual (Hebrew + English) from MVP** - Rejected:
   - Doubles development time for MVP
   - Increases bundle size and complexity
   - Most users will only use one language
   - Can add English post-MVP based on demand
3. **Arabic as primary language** - Rejected:
   - Smaller market segment in Israel (though significant)
   - Can add Arabic post-MVP for Arabic-speaking schools
   - Hebrew market is larger initial target

**Post-MVP Enhancement Path:**
- Add English (en-US) for international schools in Israel
- Add Arabic (ar-IL) for Arabic-speaking schools in Israel
- Add Russian (ru-IL) for Russian-speaking communities
- User-selectable language preference in settings
- Dynamic locale switching via middleware

**Quality Gates:**
- All UI text must be in Hebrew (no hardcoded English strings)
- RTL layout verified across all pages
- Mixed Hebrew/English names display correctly
- Hebrew collation works for student sorting
- Date/number formatting uses Hebrew locale
- Error messages in Hebrew with proper grammar
- OpenAI responses consistently in Hebrew
- E2E tests include Hebrew text input validation
- Accessibility testing with Hebrew screen readers

**Related Decisions:**
- Next.js frontend (Decision 3) - enables next-intl integration
- PostgreSQL database (Decision 1) - UTF-8 and Hebrew collation support
- NestJS backend (Decision 4) - Unicode validation and Hebrew error messages

---

## Decision Summary Table

| # | Decision | Status | Impact | Decider Phase |
|---|----------|--------|--------|---------------|
| 1 | PostgreSQL Database | ✅ Accepted | High | Discovery |
| 2 | TypeScript Full Stack | ✅ Accepted | High | Discovery |
| 3 | Next.js Frontend | ✅ Accepted | Medium | Discovery |
| 4 | NestJS Backend | ✅ Accepted | Medium | Discovery |
| 5 | Monorepo with npm Workspaces | ✅ Accepted | Medium | Discovery |
| 6 | ORM Choice (Prisma) | ✅ Accepted | Medium | Architect |
| 7 | Authentication (Self-Managed) | ✅ Accepted | High | Architect |
| 8 | Cloud Provider (GCP) | ✅ Accepted | High | Architect |
| 9 | Email Service (SendGrid) | ✅ Accepted | Low | Architect |
| 10 | State Management (Zustand) | ✅ Accepted | Medium | Architect |
| 11 | Chart Library (Recharts) | ✅ Accepted | Low | Architect |
| 12 | Primary Language (Hebrew + RTL) | ✅ Accepted | High | Architect |

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
