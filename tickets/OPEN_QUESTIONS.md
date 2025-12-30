# Open Questions - Growth Engine MVP

Track important open questions and unknowns that need resolution before or during implementation.

---

## Critical Decisions (Must Resolve Before Development)

### 1. Cloud Provider Selection
**Question:** AWS, Google Cloud Platform, or Microsoft Azure?
**Context:**
- Need managed PostgreSQL, Redis, container hosting
- Education pricing and programs available
- FERPA-compliant infrastructure required
**Owner:** Architect (GE-001)
**Related Tickets:** GE-001, GE-003, GE-004
**Decision Deadline:** End of Architecture Phase (before GE-004 - CI/CD setup)
**Impact:** High - affects infrastructure costs, deployment strategy, and developer experience

**Recommendation:** Google Cloud Platform
- Rationale: Strong education programs (Google for Education), simpler than AWS, good K8s support
- Needs validation: Team expertise, cost comparison, compliance certifications

---

### 2. Database ORM Choice
**Question:** Prisma vs TypeORM?
**Context:**
- Both work well with NestJS and TypeScript
- Prisma: Better DX, modern, type-safe
- TypeORM: More mature, NestJS native support, familiar to Java devs
**Owner:** Architect (GE-001)
**Related Tickets:** GE-001, GE-002
**Decision Deadline:** Architecture Phase (before GE-002 - Monorepo init)
**Impact:** Medium - affects data layer development speed and maintainability

**Recommendation:** Prisma
- Rationale: Superior type safety, better migrations, cleaner syntax
- Trade-off: Slightly newer, separate schema language

---

### 3. Authentication Strategy
**Question:** Self-managed (Passport.js) vs Auth-as-a-Service (Auth0, Clerk)?
**Context:**
- Self-managed: Full control, no per-user costs, more dev time
- Auth0: Faster implementation, battle-tested, but costs scale with users
**Owner:** Architect (GE-006)
**Related Tickets:** GE-006, GE-007
**Decision Deadline:** Early in Architecture Phase (auth is critical path)
**Impact:** High - affects timeline, costs, and security posture

**Recommendation:** Self-managed with Passport.js
- Rationale: School pricing models don't support per-user SaaS costs, full control needed for FERPA
- Trade-off: More implementation time, but saves long-term costs and vendor lock-in

---

### 4. Email Service Provider
**Question:** SendGrid, Amazon SES, Mailgun, or Postmark?
**Context:**
- Need transactional emails (password reset, alerts, notifications)
- Deliverability and cost are key factors
**Owner:** Architect (GE-001)
**Related Tickets:** GE-001, GE-007 (password reset)
**Decision Deadline:** Before authentication implementation (GE-007)
**Impact:** Low-Medium - affects email reliability and costs

**Recommendation:** SendGrid or Amazon SES
- SendGrid: Better templates, analytics
- Amazon SES: Lower cost, good if using AWS
- Decide based on cloud provider choice

---

### 5. OpenAI Model Selection
**Question:** GPT-4 vs GPT-3.5-turbo vs GPT-4-turbo?
**Context:**
- Cost/quality trade-off critical
- GPT-4: Best quality, highest cost (~$0.03-0.06 per analysis)
- GPT-3.5-turbo: Good quality, lower cost (~$0.002-0.004 per analysis)
- GPT-4-turbo: Middle ground
**Owner:** Architect (GE-019)
**Related Tickets:** GE-019, GE-020
**Decision Deadline:** AI Analysis Architecture Phase (GE-019)
**Impact:** High - affects product quality and unit economics

**Recommendation:** Start with GPT-4-turbo, A/B test with GPT-3.5-turbo
- Rationale: Quality is critical for teacher trust, but costs must be managed
- Plan: Pilot with GPT-4-turbo, evaluate quality vs cost, consider downgrade if quality acceptable

---

### 6. State Management Library (Frontend)
**Question:** Zustand, Redux Toolkit, React Context, or Jotai?
**Context:**
- Next.js 14 with React Server Components
- Need: Auth state, user data, dashboard state
**Owner:** Frontend Lead
**Related Tickets:** GE-008 (auth frontend), GE-029 (dashboard)
**Decision Deadline:** Before frontend auth implementation (GE-008)
**Impact:** Medium - affects frontend architecture and complexity

**Recommendation:** Zustand
- Rationale: Lightweight, simple API, works well with SSR, minimal boilerplate
- Trade-off: For simple MVP, even React Context might suffice

---

### 7. Monorepo Build Tool
**Question:** npm workspaces (native) vs Turborepo?
**Context:**
- npm workspaces: Built-in, zero-config
- Turborepo: Faster builds, caching, parallel execution
**Owner:** Backend Lead
**Related Tickets:** GE-002
**Decision Deadline:** Monorepo setup (GE-002)
**Impact:** Medium - affects build performance and DX

**Recommendation:** Start with npm workspaces, add Turborepo if needed
- Rationale: npm workspaces sufficient for MVP, can add Turborepo later if build times become issue
- Decision: Evaluate during GE-002, upgrade if team prefers Turborepo from start

---

## Implementation Questions (Resolve During Development)

### 8. Prompt Engineering Strategy
**Question:** How should we version and manage AI prompts?
**Context:**
- Prompts will need iteration based on real teacher feedback
- Need to track prompt versions with analysis results
- A/B testing different prompts?
**Owner:** Architect (GE-019), Backend (GE-020)
**Related Tickets:** GE-019, GE-020
**Decision Deadline:** AI Analysis Architecture Phase
**Impact:** Medium - affects prompt iteration velocity and quality tracking

**Ideas:**
- Store prompt templates in database with version numbers
- Tag each analysis with prompt version used
- Create admin UI for prompt editing (future)
- Use LangChain or similar for prompt management

---

### 9. Cost Control Mechanism
**Question:** How to limit OpenAI API costs per school/teacher?
**Context:**
- Runaway costs could sink business model
- Need quotas but can't block teachers during busy periods
**Owner:** Architect (GE-019), Backend (GE-020)
**Related Tickets:** GE-019, GE-020
**Decision Deadline:** AI Analysis Architecture Phase
**Impact:** High - critical for unit economics

**Options:**
1. Hard quota per school/month (e.g., 100 analyses)
2. Soft quota with warnings
3. Tiered pricing (basic vs premium depth)
4. Rate limiting (max X analyses per day per teacher)

**Recommendation:** Soft quota with alerts + rate limiting
- Alert school admin at 80% of quota
- Rate limit: Max 10 analyses per teacher per day (prevent abuse)
- Monitor costs in real-time, adjust quotas dynamically

---

### 10. PDF Generation Strategy
**Question:** Server-side PDF generation vs client-side?
**Context:**
- Need professional PDF reports for parent conferences
- Server-side: More control, consistent formatting, but resource intensive
- Client-side: Faster, less server load, but browser-dependent
**Owner:** Backend (GE-024)
**Related Tickets:** GE-024, GE-025
**Decision Deadline:** Analysis Results Implementation Phase
**Impact:** Low-Medium - affects server load and user experience

**Options:**
- Server-side: Puppeteer, PDFKit, or similar
- Client-side: jsPDF, html2pdf
- Hybrid: Render HTML on server, convert to PDF

**Recommendation:** Server-side with Puppeteer or PDFKit
- Rationale: Professional formatting, consistent across browsers, can add school branding
- Trade-off: Server resources, but PDFs are generated infrequently

---

### 11. Caching Strategy for Dashboards
**Question:** What should be cached and for how long?
**Context:**
- Principal dashboards: Heavy aggregations, read-heavy
- Teacher dashboards: Need fresh data on completion
- Balance freshness vs performance
**Owner:** Backend (GE-028, GE-032)
**Related Tickets:** GE-028, GE-032
**Decision Deadline:** Dashboard Implementation Phase
**Impact:** Medium - affects dashboard performance and user experience

**Recommendation:**
- Principal dashboard: Cache for 5 minutes (Redis), refresh on demand
- Teacher dashboard: Cache for 1 minute, invalidate on analysis completion
- Use Redis for caching with TTL
- Implement cache warming for common queries (e.g., weekly principal dashboard refresh)

---

### 12. E2E Test Data Strategy
**Question:** How to manage test data for E2E tests?
**Context:**
- Need consistent test data (students, teachers, analyses)
- Seed data vs API-generated data?
- How to clean up after tests?
**Owner:** E2E Engineer (GE-005)
**Related Tickets:** GE-005, all E2E tickets
**Decision Deadline:** E2E Framework Setup (GE-005)
**Impact:** Medium - affects test reliability and speed

**Recommendation:**
- Use test database with seed data (base users, schools)
- Tests create their own students/analyses via API (isolation)
- Clean up after each test (delete created data)
- Use test data factories (e.g., Faker.js for realistic names)
- Consider database snapshots for faster resets

---

### 13. Deployment Strategy (Staging vs Production)
**Question:** Blue-green, rolling, or canary deployments?
**Context:**
- Need zero-downtime deployments for production
- Staging environment for pre-production testing
**Owner:** Backend (GE-004)
**Related Tickets:** GE-004
**Decision Deadline:** CI/CD Pipeline Setup (GE-004)
**Impact:** Medium - affects deployment safety and rollback capability

**Recommendation:** Rolling deployments for MVP, blue-green for production scale
- MVP: Rolling deployments (Kubernetes or similar)
- Scale: Blue-green for safer releases
- Always deploy to staging first, run smoke tests

---

### 14. Observability and Monitoring
**Question:** Which APM and monitoring tools?
**Context:**
- Need application performance monitoring, logging, error tracking
- Options: New Relic, Datadog, Sentry, AWS CloudWatch, Google Cloud Monitoring
**Owner:** Backend (GE-004)
**Related Tickets:** GE-004, GE-040 (security monitoring)
**Decision Deadline:** CI/CD Pipeline Setup (GE-004)
**Impact:** Medium - affects operational visibility and incident response

**Recommendation:**
- **APM:** Datadog or New Relic (comprehensive)
- **Error tracking:** Sentry (excellent React/Node support)
- **Logging:** Cloud provider native (CloudWatch, Cloud Logging)
- **Uptime:** Pingdom or UptimeRobot (external monitoring)
- Start simple, can add more tools as needed

---

### 15. Mobile Responsive Breakpoints
**Question:** What screen sizes should we optimize for?
**Context:**
- Teachers use laptops, tablets (iPads), and phones
- Principals use iPads for on-the-go dashboard checks
**Owner:** Designer
**Related Tickets:** All designer tickets
**Decision Deadline:** First design ticket (GE-009)
**Impact:** Medium - affects design and frontend implementation

**Recommendation:**
- Mobile: 320px - 768px (phones, small tablets)
- Tablet: 768px - 1024px (iPads, Android tablets)
- Desktop: 1024px+ (laptops, desktops)
- Optimize primarily for tablet and desktop (primary use cases)
- Mobile: Essential features only (viewing, not heavy data entry)

---

## Post-MVP Questions (Defer for Now)

### 16. Multi-Language Support
**Question:** Which languages to support first?
**Context:** Deferred to Phase 2, but consider architecture implications
**Owner:** Product, Architect (Phase 2)
**Impact:** Low for MVP - ensure i18n-friendly architecture

---

### 17. Parent Portal Access
**Question:** How should parent access work? (permissions, consent, etc.)
**Context:** Deferred to Phase 2
**Owner:** Product (Phase 2)
**Impact:** Low for MVP - ensure analysis privacy settings support future parent access

---

### 18. LMS/SIS Integrations
**Question:** Which systems to integrate first? (Google Classroom, Canvas, PowerSchool, etc.)
**Context:** Deferred to Phase 2 - MVP uses CSV import only
**Owner:** Product, Architect (Phase 2)
**Impact:** Low for MVP - design APIs to support future integrations

---

## Resolved Questions

None yet - all questions are open.

---

## Question Priority

**P0 (Critical - Block development):**
1. Cloud Provider Selection (affects all infrastructure)
2. Database ORM Choice (affects data layer)
3. Authentication Strategy (affects timeline and costs)
4. OpenAI Model Selection (affects product quality and costs)

**P1 (High - Needed soon):**
5. Email Service Provider
6. State Management Library
7. Monorepo Build Tool
8. Prompt Engineering Strategy
9. Cost Control Mechanism

**P2 (Medium - Decide during implementation):**
10. PDF Generation Strategy
11. Caching Strategy
12. E2E Test Data Strategy
13. Deployment Strategy
14. Observability and Monitoring
15. Mobile Responsive Breakpoints

**P3 (Low - Post-MVP):**
16-18. All post-MVP questions

---

## Notes

- **Decision-Making Process:** Product Owner approves all P0/P1 decisions, Architect proposes solutions
- **Documentation:** All decisions should be documented in `/context/decisions.md` with rationale
- **Review Cadence:** Review open questions weekly, mark as resolved when decided
- **Escalation:** If question blocks work for >2 days, escalate to Product Owner

**Next Steps:**
1. Architect addresses P0 questions during GE-001 (Architecture Design)
2. Update `/context/decisions.md` as decisions are made
3. Mark questions as resolved in this file with date and final decision
4. Add new questions as they arise during implementation
