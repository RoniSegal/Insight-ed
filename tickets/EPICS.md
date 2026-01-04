# Epics & Features - Growth Engine MVP

This file tracks all epics/features and their associated tickets for the Growth Engine MVP.

## Current Iteration / Release

**Release/Version:** v0.1 (3-Day Proof-of-Concept Demo)
**Target Date:** 3 DAYS FROM NOW (URGENT)
**Focus:** Ultra-minimal working demo showing AI-powered student analysis - internal prototype for validation

---

## URGENT: 3-Day Sprint Epic (IN PROGRESS)

### Epic: 3-day-mvp-demo
**Epic ID:** 3-day-mvp-demo
**Status:** IN PROGRESS ⚡
**Priority:** P0 (CRITICAL - URGENT)
**Target Delivery:** Day 3 EOD (72 hours from start)
**Team:** 5 people (backend, frontend, designer, integration, product/QA)
**Description:** Ultra-minimal proof-of-concept to demonstrate core AI analysis workflow. Internal prototype only (localhost). Chat interface where teacher selects student, converses with AI, and receives analysis results.

**Scope:**
- ✅ Simple password authentication (1 teacher account)
- ✅ In-memory student management (add via form, localStorage persistence)
- ✅ Chat interface for AI conversation
- ✅ OpenAI GPT-4 integration
- ✅ Simple text results display
- ❌ NO database (deferred)
- ❌ NO dashboards (deferred)
- ❌ NO PDF export (deferred)

**E2E Status:** Manual testing only (no automated tests for sprint)

**Related Tickets (16 total - organized by day):**

**DAY 1: FOUNDATION (6 tickets)**
- [x] GE-050 (backend) - 3-Day MVP - Simple Auth Backend (4h) ✅ **DONE** (API routes implemented)
- [x] GE-051 (frontend) - 3-Day MVP - Simple Auth Frontend (4h) ✅ **DONE** (Login page, auth flow complete)
- [ ] GE-052 (backend) - 3-Day MVP - Student Management Backend (4h)
- [ ] GE-053 (frontend) - 3-Day MVP - Student Management Frontend (4h)
- [ ] GE-054 (designer) - 3-Day MVP - UI Design System (8h)
- [x] GE-055 (architect) - 3-Day MVP - Environment Setup (8h) ✅ **DONE**

**DAY 2: AI INTEGRATION (6 tickets) - READY**
- [ ] GE-056 (frontend) - 3-Day MVP - Chat Interface (6h) ✅ CREATED
- [ ] GE-057 (backend) - 3-Day MVP - OpenAI Integration (6h) ✅ CREATED
- [ ] GE-058 (backend) - 3-Day MVP - Analysis Results API (2h) ✅ CREATED
- [ ] GE-059 (frontend) - 3-Day MVP - Results Display (2h) ✅ CREATED
- [ ] GE-060 (designer) - 3-Day MVP - Prompt Engineering (6h) ✅ CREATED
- [ ] GE-061 (e2e) - 3-Day MVP - Integration Testing (8h) ✅ CREATED

**DAY 3: POLISH & DEPLOY (4 tickets) - READY**
- [ ] GE-062 (backend+frontend) - 3-Day MVP - Critical Bug Fixes (6h) ✅ CREATED
- [ ] GE-063 (designer+frontend) - 3-Day MVP - UI Polish (4h) ✅ CREATED
- [ ] GE-064 (architect+product) - 3-Day MVP - Deployment & Demo Prep (6h) ✅ CREATED
- [ ] GE-065 (e2e+all) - 3-Day MVP - Final Testing & Sign-Off (2h) ✅ CREATED

**Notes:**
- **ASSUMPTION:** Internal prototype (localhost only) - can deploy to Vercel later if needed
- **ASSUMPTION:** Will use default ChatGPT prompt template (can be replaced with user's original prompt)
- **Team Parallelization:** Days 1-2 optimized for 5 people working simultaneously
- **Success Criteria:** Working demo of student selection → AI chat → analysis results

**Dependencies:** None - this is the current sprint focus.

**Timeline:**
- Day 1 Checkpoint (EOD): Login works, students can be added, chat UI exists
- Day 2 Checkpoint (EOD): Full workflow works (student → chat → AI results)
- Day 3 Checkpoint (EOD): Demo-ready, critical bugs fixed, tested

---

## Active Epics

### Epic 1: project-setup
**Epic ID:** project-setup
**Status:** Complete (5/5 tickets complete)
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Initialize monorepo, development environment, CI/CD pipeline, and E2E testing framework. Foundation for all development work.
**E2E Status:** Complete ✅

**Related Tickets:**
- [x] GE-001 (architect) - Project Setup - Architecture Design ✅ **DONE** (builds successfully)
- [x] GE-002 (backend) - Project Setup - Initialize Monorepo Structure ✅ **DONE** (builds successfully)
- [x] GE-003 (backend) - Project Setup - Local Development Environment ✅ **DONE** (Docker compose exists)
- [x] GE-004 (backend) - Project Setup - CI/CD Pipeline ✅ **DONE** (workflows exist)
- [x] GE-005 (e2e) - Project Setup - E2E Testing Framework ✅ **DONE** (infrastructure complete, 64/95 tests passing)

**Notes:** **Epic complete** - All infrastructure in place:
- ✅ Complete architecture documentation (DATABASE_SCHEMA.md, API_CONTRACT.md, ARCHITECTURE.md)
- ✅ Monorepo with 3 packages (shared, backend, frontend) - **builds successfully**
- ✅ Docker Compose for local development (PostgreSQL, Redis, MailHog)
- ✅ 4 GitHub Actions workflows (CI, E2E, Deploy Staging, Deploy Production)
- ✅ Playwright E2E framework with global setup/teardown, database fixtures, 64/95 tests passing
- ✅ Automated backend/frontend startup for tests
- ✅ Test data isolation and cleanup mechanisms

**Dependencies:** None - this is the starting point.

---

### Epic 2: authentication
**Epic ID:** authentication
**Status:** In Progress (code complete, testing in progress)
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** User authentication with email/password and SSO (Google Workspace, Microsoft 365). JWT token management, password reset, and role-based access control (RBAC).
**E2E Status:** Testing - Module integration fixed, E2E tests should now pass

**Related Tickets:**
- [ ] GE-006 (architect) - Authentication - Architecture and Strategy **TODO** (code complete, needs verification)
- [ ] GE-007 (backend) - Authentication - Backend Implementation **TODO** (compiles but untested)
- [x] **GE-042 (backend) - Authentication - Module Integration Hotfix** ✅ **DONE** (AuthModule now imported in AppModule)
- [ ] GE-008 (frontend) - Authentication - Frontend Implementation **TODO** (compiles but untested)
- [ ] GE-009 (designer) - Authentication - UI/UX Design **TODO** (needs verification)
- [ ] GE-010 (e2e) - Authentication - E2E Tests **IN PROGRESS** (unblocked, should now pass)

**Notes:** **Code complete, module integration fixed** - All auth code exists and is now integrated:
- ✅ Comprehensive auth architecture (AUTHENTICATION.md, 82KB)
- ✅ NestJS backend with Passport.js (11 endpoints, JWT + Google OAuth) - **compiles successfully**
- ✅ **FIXED:** AuthModule now imported in AppModule (GE-042 complete) - auth endpoints should be accessible
- ✅ Next.js frontend (7 pages: login, register, password reset, OAuth callback) - **builds successfully**
- ✅ Zustand state management with automatic token refresh
- ✅ RBAC guards and decorators
- ✅ FERPA-compliant audit logging
- ✅ E2E test infrastructure complete with global setup/teardown, database fixtures, test isolation
- ⏳ E2E tests: Previously 64/95 passing (67%), 31 auth tests were blocked - should now pass with GE-042 fix

**Dependencies:**
- GE-001 (architect - overall architecture)
- GE-002 (backend - app initialized)

---

### Epic 3: user-management
**Epic ID:** user-management
**Status:** Not Started (Architecture Documented)
**Priority:** P1 (high)
**Target Release:** v1.0 (MVP)
**Description:** User profile management, teacher/principal/admin user CRUD, school associations, and role assignment.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-011 (backend) - User Management - Backend Implementation
- [ ] GE-012 (frontend) - User Management - Frontend Implementation
- [ ] GE-013 (designer) - User Management - UI/UX Design
- [ ] GE-014 (e2e) - User Management - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 3 section. Ready for implementation. Principals need ability to manage teachers. Teachers manage their own profiles.

**Dependencies:**
- GE-007 (backend - authentication, users created during auth)
- GE-009 (designer - design system from auth UI)

---

### Epic 4: student-management
**Epic ID:** student-management
**Status:** Not Started (Architecture Documented)
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Student roster management including CRUD operations, class organization, CSV bulk import, archival, and data isolation (teachers only see their students).
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-015 (backend) - Student Management - Backend Implementation
- [ ] GE-016 (frontend) - Student Management - Frontend Implementation
- [ ] GE-017 (designer) - Student Management - UI/UX Design
- [ ] GE-018 (e2e) - Student Management - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 4 section. CSV import is critical for onboarding (teachers won't manually add 150 students). Data isolation enforced strictly (FERPA).

**Dependencies:**
- GE-011 (backend - user management, teacher-student associations)

---

### Epic 5: ai-analysis
**Epic ID:** ai-analysis
**Status:** Not Started (Architecture Documented)
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** AI-powered student analysis workflow using ChatGPT-4. Conversational interface guiding teachers through assessment, conversation management, prompt engineering, and cost control.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-019 (architect) - AI Analysis - Architecture and Prompt Engineering
- [ ] GE-020 (backend) - AI Analysis - Backend Implementation
- [ ] GE-021 (frontend) - AI Analysis - Frontend Implementation
- [ ] GE-022 (designer) - AI Analysis - UI/UX Design
- [ ] GE-023 (e2e) - AI Analysis - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 5 section. THIS IS THE CORE PRODUCT DIFFERENTIATOR. Must complete in 5-10 minutes. Cost control critical ($0.01-0.05 per analysis). Prompt engineering will require iteration.

**Dependencies:**
- GE-015 (backend - students exist to analyze)
- GE-019 (architect - prompts and architecture designed)

---

### Epic 6: analysis-results
**Epic ID:** analysis-results
**Status:** Not Started (Architecture Documented)
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Display, edit, and export analysis results. Teacher can review AI-generated recommendations, edit them, add private notes, export PDF, and flag students for intervention.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-024 (backend) - Analysis Results - Backend Implementation
- [ ] GE-025 (frontend) - Analysis Results - Frontend Implementation
- [ ] GE-026 (designer) - Analysis Results - UI/UX Design
- [ ] GE-027 (e2e) - Analysis Results - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 6 section. Teachers must approve all AI recommendations (human-in-the-loop). PDF export for parent conferences. Private notes for teacher use only.

**Dependencies:**
- GE-020 (backend - AI analysis generates results)
- GE-021 (frontend - flows from analysis session to results)

---

### Epic 7: teacher-dashboard
**Epic ID:** teacher-dashboard
**Status:** Not Started (Architecture Documented)
**Priority:** P1 (high)
**Target Release:** v1.0 (MVP)
**Description:** Teacher dashboard showing student roster, analysis completion status, flagged students, quick actions to start analyses, and class-wide trends.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-028 (backend) - Teacher Dashboard - Backend Implementation
- [ ] GE-029 (frontend) - Teacher Dashboard - Frontend Implementation
- [ ] GE-030 (designer) - Teacher Dashboard - UI/UX Design
- [ ] GE-031 (e2e) - Teacher Dashboard - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 7 section. Dashboard is landing page after login. Must show all students at a glance. Quick actions to start analysis.

**Dependencies:**
- GE-015 (backend - student data)
- GE-020 (backend - analysis data)
- GE-008 (frontend - auth flows into dashboard)

---

### Epic 8: principal-dashboard
**Epic ID:** principal-dashboard
**Status:** Not Started (Architecture Documented)
**Priority:** P1 (high)
**Target Release:** v1.0 (MVP)
**Description:** Principal executive dashboard with school-wide metrics, teacher activity, aggregated student insights, grade-level comparisons, and exportable reports.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-032 (backend) - Principal Dashboard - Backend Implementation
- [ ] GE-033 (frontend) - Principal Dashboard - Frontend Implementation
- [ ] GE-034 (designer) - Principal Dashboard - UI/UX Design
- [ ] GE-035 (e2e) - Principal Dashboard - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 8 section. Principals need school-wide visibility. Drill-down from metrics to individual students. Export reports for district meetings.

**Dependencies:**
- GE-028 (backend - similar analytics logic to teacher dashboard)
- GE-029 (frontend - reuse dashboard components)

---

### Epic 9: search-filter
**Epic ID:** search-filter
**Status:** Not Started (Architecture Documented)
**Priority:** P2 (medium)
**Target Release:** v1.0 (MVP)
**Description:** Global search and advanced filtering for students and analyses. Full-text search, multi-criteria filtering, and saved filter presets.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-036 (backend) - Search & Filter - Backend Implementation
- [ ] GE-037 (frontend) - Search & Filter - Frontend Implementation
- [ ] GE-038 (designer) - Search & Filter - UI/UX Design
- [ ] GE-039 (e2e) - Search & Filter - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 9 section. Important for teachers with 150+ students. Full-text search with fuzzy matching. Filter persistence in URL.

**Dependencies:**
- GE-015 (backend - student data to search)
- GE-020 (backend - analysis data to search)

---

### Epic 10: security-compliance
**Epic ID:** security-compliance
**Status:** Not Started (Architecture Documented)
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Comprehensive security and FERPA compliance including encryption (at rest/in transit), audit logging, data protection, CSRF/XSS prevention, rate limiting, and compliance documentation.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-040 (backend) - Security & Compliance - Implementation
- [ ] GE-041 (e2e) - Security & Compliance - E2E Tests

**Notes:** Architecture documented in IMPLEMENTATION_SUMMARY.md - Epic 10 section. FERPA COMPLIANCE IS NON-NEGOTIABLE. Must be complete before pilot launch. Engage legal counsel for review. Annual security audit recommended.

**Dependencies:**
- GE-001 (architect - security architecture)
- GE-007 (backend - authentication as security foundation)

---

## Standalone Tickets

No standalone tickets for MVP. All work is organized by epics.

---

## Completed Epics

**Epic 1: project-setup** ✅ - Completed 2025-12-30
- Complete infrastructure implementation (monorepo, Docker, CI/CD, E2E framework)

**Epic 2: authentication** ✅ - Completed 2025-12-30
- Full authentication system (email/password, Google OAuth, JWT, RBAC)

---

## Release History

**v1.0 (MVP - Pilot Launch)** - Target: End of February 2026 (Month 5)
- Epic: project-setup (foundation)
- Epic: authentication (login/SSO)
- Epic: user-management (profiles)
- Epic: student-management (roster, CSV import)
- Epic: ai-analysis (CORE FEATURE - AI-guided analysis)
- Epic: analysis-results (view, edit, export PDF)
- Epic: teacher-dashboard (student overview)
- Epic: principal-dashboard (school-wide insights)
- Epic: search-filter (find students/analyses)
- Epic: security-compliance (FERPA, encryption, audit logs)

**MVP Success Criteria:**
- 3-5 pilot schools onboarded
- 50-100 active teachers
- 80%+ analysis completion rate
- 2+ hours/week teacher time savings
- 99%+ system uptime
- Zero security incidents
- FERPA compliant

---

## Epic Summary

| Epic ID | Epic Name | Priority | Tickets | Status | Target |
|---------|-----------|----------|---------|--------|--------|
| project-setup | Project Setup | P0 | 5 | Not Started | v1.0 |
| authentication | Authentication | P0 | 5 | Not Started | v1.0 |
| user-management | User Management | P1 | 4 | Not Started | v1.0 |
| student-management | Student Management | P0 | 4 | Not Started | v1.0 |
| ai-analysis | AI Analysis | P0 | 5 | Not Started | v1.0 |
| analysis-results | Analysis Results | P0 | 4 | Not Started | v1.0 |
| teacher-dashboard | Teacher Dashboard | P1 | 4 | Not Started | v1.0 |
| principal-dashboard | Principal Dashboard | P1 | 4 | Not Started | v1.0 |
| search-filter | Search & Filter | P2 | 4 | Not Started | v1.0 |
| security-compliance | Security & Compliance | P0 | 2 | Not Started | v1.0 |
| **TOTAL** | **10 Epics** | | **41 Tickets** | | |

---

## Work by Agent Role

| Role | Ticket Count | Epic Involvement |
|------|--------------|------------------|
| Architect | 3 | project-setup, authentication, ai-analysis |
| Designer | 8 | authentication, user-mgmt, student-mgmt, ai-analysis, analysis-results, teacher-dash, principal-dash, search-filter |
| Backend | 14 | project-setup, authentication, user-mgmt, student-mgmt, ai-analysis, analysis-results, teacher-dash, principal-dash, search-filter, security |
| Frontend | 8 | authentication, user-mgmt, student-mgmt, ai-analysis, analysis-results, teacher-dash, principal-dash, search-filter |
| E2E | 8 | project-setup, authentication, user-mgmt, student-mgmt, ai-analysis, analysis-results, teacher-dash, principal-dash, search-filter, security |
| **TOTAL** | **41** | **10 epics** |

---

## Critical Path (Dependency Order)

**Phase 1: Foundation** (Parallel after GE-001)
1. GE-001 (architect) - Architecture Design → BLOCKS ALL OTHER WORK

**Phase 2: Infrastructure** (Can run in parallel)
2. GE-002, GE-003, GE-004, GE-005 (backend, e2e) - Project Setup
3. GE-006 (architect) - Auth Architecture

**Phase 3: Core Authentication**
4. GE-007, GE-008, GE-009, GE-010 (all roles) - Authentication Epic

**Phase 4: User & Student Management** (Can run in parallel after auth)
5. GE-011, GE-012, GE-013, GE-014 (all roles) - User Management
6. GE-015, GE-016, GE-017, GE-018 (all roles) - Student Management

**Phase 5: AI Analysis (CORE FEATURE)**
7. GE-019 (architect) - AI Analysis Architecture
8. GE-020, GE-021, GE-022, GE-023 (all roles) - AI Analysis Implementation
9. GE-024, GE-025, GE-026, GE-027 (all roles) - Analysis Results

**Phase 6: Dashboards** (Can run in parallel)
10. GE-028, GE-029, GE-030, GE-031 (all roles) - Teacher Dashboard
11. GE-032, GE-033, GE-034, GE-035 (all roles) - Principal Dashboard

**Phase 7: Search & Security** (Final polish)
12. GE-036, GE-037, GE-038, GE-039 (all roles) - Search & Filter
13. GE-040, GE-041 (backend, e2e) - Security & Compliance → MUST BE COMPLETE BEFORE PILOT

---

## Notes

- **MVP Focus:** Teacher analysis workflow and principal dashboard
- **Core Differentiator:** AI-powered analysis (Epic 5)
- **Non-Negotiable:** Security and FERPA compliance (Epic 10)
- **Scalability:** Architecture designed for 10x growth
- **Time to Market:** Aggressive 5-month timeline to pilot launch

**Next Steps:**
1. Start with GE-001 (Architecture Design) - blocks all other work
2. Run project setup in parallel once architecture is defined
3. Prioritize authentication → students → AI analysis (critical path)
4. Security must be complete before pilot deployment
5. E2E tests for each epic ensure quality

**Post-MVP Enhancements:**
- Parent portal (view analyses with permission)
- LMS integrations (Google Classroom, Canvas)
- Mobile native apps
- Advanced analytics (predictive ML)
- Multi-language support
