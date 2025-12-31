# Discovery Notes

## Project Context

- **Project:** growth-engine
- **Domain:** education
- **Date Started:** December 2025
- **Project Phase:** Pre-implementation / Planning
- **Discovery Completed:** December 30, 2025

## Existing Codebase Analysis

### Repository Structure

**Current State:** Greenfield project - no application code exists yet

**Planned Structure:** Monorepo with packages architecture

```
growth-engine/
├── packages/
│   ├── frontend/          # Next.js web application
│   ├── backend/           # NestJS API server
│   ├── shared/            # Shared types, utilities, constants
│   └── database/          # Database schemas, migrations, seeds
├── .claude/               # Multi-agent R&D OS configuration (EXISTS)
├── context/               # Project context and requirements (EXISTS)
├── docs/                  # Architecture and PRD documentation (EXISTS)
├── tickets/               # Work backlog and epic tracking (EXISTS)
├── docker-compose.yml     # Local development environment (TO BE CREATED)
└── package.json           # Root package.json for monorepo (TO BE CREATED)
```

**Recommendation:** Use a monorepo tool like npm workspaces, pnpm workspaces, or Turborepo for efficient package management and build orchestration.

### Tech Stack Identified

- **Frontend:** Next.js 14+ (React 18+, TypeScript)
- **Backend:** NestJS 10+ with TypeScript
- **Database:** PostgreSQL 15+ (to be provisioned)
- **Caching:** Redis (to be integrated)
- **Dependencies/Integrations:**
  - OpenAI API (ChatGPT-4) - requires API key and cost management
  - Email service (SendGrid or Amazon SES) - to be selected
  - Cloud storage (AWS S3, GCS, or Azure Blob) - to be selected
- **Infrastructure:** Cloud-native (AWS/GCP/Azure) - provider to be decided

### Code Quality Observations

**Current State:** No code written yet - this is a greenfield project

**Pre-Implementation Analysis:**

#### 1. Code Organization and Architecture

**Status:** ✅ Well-planned, not yet implemented

**Strengths:**

- Clear separation of concerns with monorepo packages structure
- Next.js and NestJS both promote modular, scalable architectures
- Multi-agent R&D OS framework ensures systematic development approach
- Epic-based workflow will enable organized feature development

**Recommendations Before Starting:**

- Establish coding standards and style guide (ESLint, Prettier configs)
- Define folder structure conventions for both frontend and backend
- Create architectural decision records (ADRs) for key decisions
- Set up code review process and branch protection rules
- Define module boundaries to prevent circular dependencies
- Plan domain-driven design (DDD) structure for backend (modules per domain: auth, students, analysis, etc.)

#### 2. Testing Coverage

**Status:** ⚠️ No tests exist - testing strategy needed

**Critical Setup Tasks:**

- Configure Jest for unit and integration testing (both frontend and backend)
- Set up Playwright or Cypress for E2E testing
- Define testing standards:
  - Unit test coverage target: 80%+ for business logic
  - Integration tests for all API endpoints
  - E2E tests for critical user flows (teacher analysis, principal dashboard)
- Create test data factories and fixtures for consistent test data
- Set up test database with proper seed data
- Configure CI/CD pipeline to run tests on every PR
- Implement pre-commit hooks to run tests locally

**Testing Priorities:**

1. **Critical:** AI analysis workflow (ChatGPT integration with proper mocking)
2. **Critical:** Authentication and authorization (security-sensitive)
3. **High:** Student data CRUD operations (data integrity)
4. **High:** Dashboard aggregations and trends (complex logic)
5. **Medium:** CSV import/export functionality
6. **Medium:** Search and filtering

#### 3. Documentation Quality

**Status:** ✅ Excellent planning documentation, needs code documentation plan

**Existing Documentation:**

- Comprehensive multi-agent R&D OS framework (CLAUDE.md)
- Agent role definitions (.claude/agents/)
- Context files (client, requirements, discovery, decisions)
- PRD and Architecture templates ready to be populated

**Gaps to Address:**

- API documentation strategy (consider Swagger/OpenAPI for NestJS)
- Component documentation for React components (Storybook?)
- Database schema documentation (automatic generation from ORM)
- Deployment runbooks and operational documentation
- Onboarding guide for new developers
- Code commenting standards (when to comment, JSDoc format)

**Recommendations:**

- Use JSDoc comments for public APIs and complex functions
- Generate API documentation automatically from code (NestJS Swagger)
- Document environment variables and configuration in README
- Create ADRs (Architecture Decision Records) for major technical decisions
- Maintain CHANGELOG.md for release notes

#### 4. Technical Debt Areas

**Status:** ✅ No debt yet - opportunity to start clean

**Proactive Debt Prevention:**

- Avoid premature optimization - focus on MVP features first
- Don't over-engineer abstractions until patterns emerge (Rule of Three)
- Keep dependencies up to date from the start (Renovate bot, Dependabot)
- Allocate 15-20% of sprint capacity for refactoring and tech debt
- Document known shortcuts taken for MVP (create tech debt tickets)
- Regular architecture reviews (monthly or quarterly)

**Common Pitfalls to Avoid:**

- Tight coupling between frontend and backend (use API contracts, TypeScript shared types)
- Monolithic backend modules (keep NestJS modules focused and bounded)
- Insufficient error handling (implement global error handlers early)
- Lack of logging and monitoring (set up from day one, not later)
- Hardcoded configuration (use environment variables and configuration management)
- Missing database migrations strategy (establish from first schema change)
- No API versioning strategy (plan for breaking changes)

#### 5. Performance Bottlenecks

**Status:** 🔍 No code yet - areas to monitor from the start

**Potential Performance Concerns:**

- **ChatGPT API latency:** Each analysis requires multiple API calls (3-5 seconds per exchange)
  - Mitigation: Implement streaming responses, loading states, progress indicators
  - Consider caching repeated prompts or responses
  - Monitor token usage and optimize prompts for efficiency

- **Dashboard aggregations:** Principal dashboards may require complex queries across many students
  - Mitigation: Implement caching (Redis) for aggregated data
  - Use materialized views or pre-computed analytics tables
  - Paginate large result sets
  - Consider background jobs for expensive computations

- **Database query performance:** As data grows (100k+ students), queries may slow down
  - Mitigation: Proper indexing from the start (foreign keys, search fields, timestamps)
  - Use database query analysis tools (EXPLAIN ANALYZE in PostgreSQL)
  - Implement connection pooling
  - Monitor slow query logs

- **Frontend bundle size:** Rich dashboards with charts may result in large JavaScript bundles
  - Mitigation: Code splitting and lazy loading for dashboard components
  - Tree-shaking and minification in production builds
  - Use Next.js dynamic imports for heavy components
  - Optimize images and assets

- **File uploads (CSV imports):** Large CSV files may time out or consume excessive memory
  - Mitigation: Stream processing for large files
  - Background job queue (Bull/BullMQ) for async processing
  - Progress tracking for long-running imports
  - File size limits and validation

**Performance Monitoring Plan:**

- Set up APM (Application Performance Monitoring) from day one
- Track Core Web Vitals for frontend (LCP, FID, CLS)
- Monitor API response times (p50, p95, p99)
- Database query performance monitoring
- ChatGPT API usage and costs
- Regular load testing before major releases

## User Research

### Target Users

**Primary Users:**

1. **Classroom Teachers** (K-12)
   - Age range: 25-60
   - Tech proficiency: Varies (basic to advanced)
   - Typical class size: 20-30 students
   - Time constraints: Extremely limited prep time (often <1 hour/day)
   - Pain point: Need to understand each student but lack time for individual assessments

2. **School Principals**
   - Age range: 35-65
   - Tech proficiency: Moderate to advanced
   - Management span: 20-80 teachers, 300-2000 students
   - Time constraints: Very limited, need high-level insights quickly
   - Pain point: Difficulty identifying trends and intervention needs across entire school

### User Needs & Pain Points

**Teacher Pain Points (from education research and industry insights):**

1. **Time scarcity:** Teachers spend 50+ hours/week, limited time for individual student assessment
2. **Assessment overload:** Required to conduct multiple assessments but struggle to synthesize insights
3. **Differentiation challenges:** Know they should personalize instruction but lack data to inform decisions
4. **Documentation burden:** Required to document student progress but paperwork is overwhelming
5. **Early intervention:** Hard to identify at-risk students early enough for effective intervention
6. **Inconsistent assessment:** Subjective assessments vary, need more structured approach
7. **Lost insights:** Mental notes about students are forgotten without documentation system
8. **Parent communication:** Difficult to provide specific, evidence-based feedback to parents

**Principal Pain Points:**

1. **Limited visibility:** Hard to get comprehensive view of student needs across all classrooms
2. **Resource allocation:** Difficult to identify where to focus intervention resources
3. **Teacher support:** Can't effectively support teachers without understanding their class needs
4. **Compliance reporting:** Time-consuming to compile data for district and state reporting
5. **Pattern recognition:** Miss school-wide trends that could inform professional development
6. **Data silos:** Student data scattered across multiple systems and teacher notebooks

**User Goals:**

- **Teachers:** Understand each student's unique needs in < 10 minutes per student
- **Teachers:** Generate actionable intervention strategies based on their observations
- **Teachers:** Track student progress over time to validate intervention effectiveness
- **Principals:** Identify school-wide trends to inform strategic decisions
- **Principals:** Ensure all students receiving appropriate support and interventions
- **Both:** Reduce administrative burden while improving educational outcomes

### User Journeys

**Teacher Journey: Conducting Student Analysis**

1. **Login** → Single sign-on with Google/Microsoft account (familiar, fast)
2. **Dashboard** → See all students with completion status, identify who needs analysis
3. **Select Student** → Choose student from class roster (searchable, filterable)
4. **Analysis Session:**
   - System asks guided questions about student (academic, behavioral, engagement)
   - Teacher responds with free-form observations (natural language, not checkboxes)
   - Conversation is conversational and adaptive (follow-up questions based on responses)
   - Session can be paused/resumed if interrupted (realistic for busy teachers)
5. **Review Results:**
   - AI generates comprehensive profile with strengths, challenges, recommendations
   - Teacher reviews for accuracy, adds private notes
   - Teacher can edit or reject suggestions
6. **Save & Act:**
   - Analysis saved to student record
   - Recommendations available for reference
   - Teacher can print/export for parent conferences or IEP meetings
7. **Follow-up:** Repeat analysis periodically (quarterly/semester) to track progress

**Principal Journey: Monitoring School-Wide Trends**

1. **Login** → Secure authentication
2. **Executive Dashboard:**
   - Key metrics: total students, analysis completion rate, flagged students
   - Visual charts: trends over time, grade-level comparisons
   - Alerts: students requiring urgent attention
3. **Drill-Down:**
   - Filter by grade, class, teacher, date range
   - View aggregated insights: most common needs, patterns
   - Identify teachers who need support (low usage, high flagged students)
4. **Action Planning:**
   - Export reports for meetings with teachers, district leadership
   - Identify professional development needs based on common challenges
   - Allocate intervention resources to classes/grades with highest needs
5. **Continuous Monitoring:** Weekly check-ins to track progress

## Competitive Analysis

**Market Landscape:**

### Direct Competitors (Student Assessment Platforms)

1. **ClassDojo (Behavior tracking + portfolios)**
   - Strengths: Simple UI, parent engagement, widespread adoption
   - Weaknesses: Limited deep analysis, focuses on behavior over academics, no AI-powered insights
   - Positioning: Growth Engine offers deeper analytical insights and personalized recommendations

2. **Seesaw (Student portfolios + assessment)**
   - Strengths: Strong K-5 presence, parent communication, student-created content
   - Weaknesses: Teachers still do manual assessment, no AI analysis, time-intensive
   - Positioning: Growth Engine automates the synthesis and recommendation process

3. **Bloomz (Parent communication + behavior)**
   - Strengths: Comprehensive communication features, behavior tracking
   - Weaknesses: Surface-level insights, no AI, lacks depth in student analysis
   - Positioning: Growth Engine focuses on actionable insights rather than just communication

### Indirect Competitors (Assessment Tools)

4. **Renaissance Learning (myIGDIs, Star Assessments)**
   - Strengths: Standardized assessments, growth tracking, large assessment library
   - Weaknesses: Test-based only (doesn't capture teacher observations), impersonal, expensive
   - Positioning: Growth Engine captures qualitative teacher insights, not just test scores

5. **Google Classroom + Forms (Manual assessment)**
   - Strengths: Free, integrated with G Suite, familiar to teachers
   - Weaknesses: Completely manual, no analysis, no recommendations, time-consuming
   - Positioning: Growth Engine automates analysis that teachers would do manually

### AI-Powered Education Tools (Adjacent)

6. **Panorama Education (SEL assessment + analytics)**
   - Strengths: Research-backed SEL focus, district-level analytics, strong dashboards
   - Weaknesses: Survey-based (not teacher observation), expensive, complex onboarding
   - Positioning: Growth Engine is teacher-driven and faster to deploy

7. **Ellevation Education (ELL student support)**
   - Strengths: Specialized for English Language Learners, data-driven
   - Weaknesses: Narrow focus (ELL only), not general purpose
   - Positioning: Growth Engine serves all students, not just specific populations

**Competitive Advantages:**

- AI-powered analysis reduces teacher time from hours to minutes
- Conversational interface feels natural (not another form to fill out)
- Captures tacit knowledge that teachers have but don't document
- Immediate, actionable recommendations (not just data reporting)
- Affordable for individual schools (not just districts)
- Fast onboarding (< 30 minutes) vs. multi-day training for competitors

**Market Gaps Growth Engine Fills:**

- No competitor combines teacher observation + AI analysis + actionable recommendations
- Most tools are either purely data (tests) or purely manual (teacher notes)
- Principals lack tools for school-wide insights based on teacher observations
- Current solutions are too expensive, complex, or time-consuming for most schools

## Technical Constraints

**Original Constraints:** None specified (greenfield project)

**Identified Constraints from Discovery:**

### Regulatory Compliance Constraints

- **FERPA compliance:** All student data handling must meet federal privacy requirements
- **COPPA compliance:** If any direct student interaction added, must comply with under-13 rules
- **State-specific laws:** Varies by state (California CCPA, New York Ed Law 2-d, etc.)
- **Data residency:** Some districts require data stored within US or specific regions

### Integration Constraints

- **School IT security:** Many schools have strict firewall rules, limited ports, VPN requirements
- **SSO providers:** Must support Google Workspace and Microsoft 365 (most common in K-12)
- **Legacy systems:** Some schools still use outdated Student Information Systems (difficult to integrate)
- **Internet bandwidth:** Many schools have limited bandwidth (rural areas especially)

### Cost Constraints

- **OpenAI API costs:** Analysis requires multiple API calls per student ($0.01-0.05 per analysis estimated)
  - At scale (10,000 analyses/month): $100-500/month in API costs alone
  - Must build cost controls and quotas to prevent runaway spending
- **Hosting costs:** Cloud infrastructure must remain affordable at scale
- **School budgets:** Limited EdTech budgets, need competitive pricing (<$10/teacher/month ideal)

### Performance Constraints

- **Analysis latency:** Teachers won't wait >30 seconds for AI responses (user expectations)
- **Concurrent analysis:** Back-to-school rush means 100+ teachers using system simultaneously
- **Large class rosters:** Some teachers have 150+ students (high school), need efficient processing
- **Low-bandwidth networks:** System must work on slow connections (3G in rural schools)

### Usability Constraints

- **Limited training time:** Teachers won't attend multi-hour training sessions
- **Varying tech literacy:** Must be intuitive for less tech-savvy educators
- **Mobile access:** Teachers often use personal phones/tablets (need responsive design)
- **Accessibility:** Must support screen readers and meet WCAG 2.1 AA standards

## Key Decisions Needed

**Critical Decisions for Architecture Phase:**

### 1. Cloud Provider Selection

**Question:** AWS, Google Cloud Platform, or Microsoft Azure?
**Factors:**

- Cost structure and pricing model
- Education-specific programs and discounts (Google for Education, AWS Educate)
- Managed service availability (PostgreSQL, Redis, container orchestration)
- Compliance certifications (FERPA-ready infrastructure)
- Team expertise and learning curve
  **Timeline:** Decide by end of Architect Phase (before infrastructure setup)

### 2. Database ORM Choice

**Question:** TypeORM, Prisma, or Sequelize?
**Factors:**

- TypeScript support and type safety
- Migration strategy and tooling
- Performance characteristics
- NestJS integration quality
- Team familiarity
  **Timeline:** Decide during Architect Phase (impacts data model design)

### 3. State Management Strategy (Frontend)

**Question:** Zustand, Redux Toolkit, React Context, or Jotai?
**Factors:**

- Complexity vs. simplicity tradeoff
- Bundle size impact
- Developer experience
- Server state vs. client state handling
- React Server Components compatibility (Next.js 14+)
  **Timeline:** Decide during Frontend Phase kickoff

### 4. Email Service Provider

**Question:** SendGrid, Amazon SES, Mailgun, or Postmark?
**Factors:**

- Deliverability reputation
- Cost structure (transactional email pricing)
- Template management features
- Analytics and tracking
- API quality and documentation
  **Timeline:** Decide before authentication implementation (password reset emails)

### 5. OpenAI API Cost Management Strategy

**Question:** How to control and predict AI costs?
**Options:**

- Per-school quotas (e.g., 100 analyses/month/school)
- Rate limiting per teacher
- Tiered pricing (basic vs. premium analysis depth)
- Prompt optimization to reduce token usage
- Caching common responses
  **Timeline:** Decide during Architect Phase (impacts pricing model and UX)

### 6. Monorepo Tool

**Question:** npm workspaces, pnpm workspaces, Yarn workspaces, or Turborepo?
**Factors:**

- Build performance (caching, parallelization)
- Dependency management efficiency
- CI/CD integration
- Team familiarity
- Active maintenance and community
  **Timeline:** Decide immediately (project setup Phase 1)

### 7. Authentication Strategy

**Question:** Self-managed auth or Auth-as-a-Service (Auth0, Clerk, AWS Cognito)?
**Factors:**

- Control vs. convenience tradeoff
- Cost implications (per-user pricing vs. infrastructure)
- SSO integration complexity
- Security expertise required
- Vendor lock-in concerns
  **Timeline:** Decide during Architect Phase (critical for security)

### 8. Analytics and Monitoring Stack

**Question:** Which APM and monitoring tools?
**Options:**

- APM: New Relic, Datadog, Sentry, AWS X-Ray
- Logging: CloudWatch, Datadog Logs, Logtail
- Frontend: Vercel Analytics, Google Analytics, PostHog
  **Timeline:** Decide before MVP deployment (need monitoring from day one)

## Risks & Mitigations

### Risk 1: OpenAI API Dependency and Costs

**Impact:** High
**Probability:** Medium
**Description:** Core product depends on third-party AI service; costs could spiral or service could be unavailable

**Mitigations:**

- Implement rate limiting and quotas per school/teacher
- Build fallback queue system for API outages (retry later)
- Optimize prompts to minimize token usage
- Monitor costs in real-time with alerts
- Negotiate enterprise pricing with OpenAI at scale
- Consider alternative AI providers as backup (Anthropic Claude, etc.)
- Build cost into pricing model with adequate margin

### Risk 2: FERPA/Privacy Compliance Violation

**Impact:** Critical (legal liability, loss of customer trust)
**Probability:** Low (with proper precautions)
**Description:** Mishandling student data could violate FERPA and result in legal consequences

**Mitigations:**

- Engage legal counsel specializing in education law
- Conduct privacy impact assessment (PIA) before launch
- Implement data protection by design (encryption, access controls, audit logs)
- Regular security audits and penetration testing
- Staff training on FERPA requirements
- Data Processing Agreements (DPAs) with all third-party vendors
- Incident response plan for potential breaches
- Clear privacy policy and terms of service reviewed by attorney

### Risk 3: Low Teacher Adoption

**Impact:** High (product fails without users)
**Probability:** Medium
**Description:** Teachers may resist new tool due to change fatigue or perceived complexity

**Mitigations:**

- Extremely simple onboarding (<30 minutes)
- Demonstrate immediate value in pilot (time savings, actionable insights)
- Integrate into existing workflow (not another system to check)
- Provide excellent support during pilot phase
- Collect and act on user feedback rapidly
- Identify and empower teacher champions at each school
- Show clear ROI: time saved, improved student outcomes
- Avoid complex features in MVP - start simple

### Risk 4: ChatGPT Analysis Quality Issues

**Impact:** High (inaccurate recommendations damage credibility)
**Probability:** Medium
**Description:** AI may generate inappropriate, inaccurate, or biased recommendations

**Mitigations:**

- Extensive prompt engineering and testing
- Human-in-the-loop: teachers review and approve all analyses
- Bias detection and mitigation in prompts
- Hallucination detection (fact-checking against input)
- Safety filters for inappropriate content
- Continuous monitoring of output quality
- Feedback mechanism for teachers to flag issues
- Iterative improvement based on flagged outputs
- Transparency: clearly label AI-generated content

### Risk 5: Database Performance Degradation at Scale

**Impact:** Medium (poor user experience, increased costs)
**Probability:** Medium
**Description:** As student data grows to 100k+, queries may slow down significantly

**Mitigations:**

- Proper database indexing from day one
- Query optimization and EXPLAIN ANALYZE reviews
- Implement caching layer (Redis) early
- Monitor database performance metrics continuously
- Plan for read replicas before needed
- Regular load testing at 10x current scale
- Database query timeout enforcement
- Pagination for all large result sets

### Risk 6: Scope Creep and Feature Bloat

**Impact:** Medium (delayed launch, over-engineered MVP)
**Probability:** High (common in software projects)
**Description:** Stakeholders request additional features, delaying MVP and increasing complexity

**Mitigations:**

- Clear PRD with explicit "out of scope" section
- Product owner empowered to say no
- Ruthless prioritization (MoSCoW method)
- Fixed timeline for MVP (time-boxed)
- Feature freeze 2 weeks before pilot launch
- Post-MVP roadmap for deferred features
- Regular scope review meetings
- User research to validate features before building

## Next Steps

**Immediate Actions (Week 1):**

- [x] Complete discovery documentation (this file)
- [ ] Populate PRD.md with comprehensive product requirements
- [ ] Populate ARCHITECTURE.md with system design decisions
- [ ] Populate decisions.md with key architectural decisions
- [ ] Make final decisions on open questions (#1-8 above)
- [ ] Schedule architecture review meeting with technical lead

**Phase 1 - Project Setup (Weeks 1-2):**

- [ ] Initialize monorepo structure with chosen tool
- [ ] Set up base Next.js and NestJS applications
- [ ] Configure development environment (Docker Compose)
- [ ] Set up PostgreSQL database with initial schema
- [ ] Configure linting, formatting, and pre-commit hooks
- [ ] Set up GitHub repository with branch protection rules
- [ ] Create CI/CD pipeline skeleton (GitHub Actions)
- [ ] Set up initial logging and error tracking (Sentry)

**Phase 2 - Foundation Development (Weeks 3-4):**

- [ ] Implement authentication system (email/password + SSO)
- [ ] Create user management (CRUD for teachers, principals, admins)
- [ ] Build student management (CRUD, CSV import)
- [ ] Set up OpenAI API integration and cost tracking
- [ ] Create basic frontend layout and navigation
- [ ] Implement role-based access control (RBAC)

**Phase 3 - Core Features (Weeks 5-8):**

- [ ] Build AI analysis workflow (ChatGPT conversation)
- [ ] Create analysis results display and editing
- [ ] Implement teacher dashboard
- [ ] Build principal dashboard with aggregations
- [ ] Add trends visualization and charting
- [ ] Implement search and filtering functionality

**Phase 4 - Polish & Pilot Prep (Weeks 9-10):**

- [ ] Security audit and FERPA compliance review
- [ ] Performance testing and optimization
- [ ] E2E test coverage for critical flows
- [ ] User acceptance testing with internal users
- [ ] Documentation for end users (teacher guide, principal guide)
- [ ] Deployment to production environment
- [ ] Training materials and onboarding flow

**Phase 5 - Pilot Launch (Week 11+):**

- [ ] Deploy to 3 pilot schools
- [ ] Conduct onboarding sessions with pilot teachers
- [ ] Provide intensive support (daily check-ins first week)
- [ ] Collect feedback and monitor usage metrics
- [ ] Rapid iteration based on feedback
- [ ] Prepare for broader rollout
