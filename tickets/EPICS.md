# Epics & Features - Growth Engine MVP

This file tracks all epics/features and their associated tickets for the Growth Engine MVP.

## Current Iteration / Release

**Release/Version:** v1.0 (MVP - Pilot Launch)
**Target Date:** End of February 2026 (Month 5)
**Focus:** Complete MVP with core teacher analysis workflow, principal dashboard, and FERPA compliance for pilot school deployment

---

## Active Epics

### Epic 1: project-setup
**Epic ID:** project-setup
**Status:** Not Started
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Initialize monorepo, development environment, CI/CD pipeline, and E2E testing framework. Foundation for all development work.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-001 (architect) - Project Setup - Architecture Design
- [ ] GE-002 (backend) - Project Setup - Initialize Monorepo Structure
- [ ] GE-003 (backend) - Project Setup - Local Development Environment
- [ ] GE-004 (backend) - Project Setup - CI/CD Pipeline
- [ ] GE-005 (e2e) - Project Setup - E2E Testing Framework

**Notes:** Must be completed before any feature development begins. This establishes the technical foundation.

**Dependencies:** None - this is the starting point.

---

### Epic 2: authentication
**Epic ID:** authentication
**Status:** Not Started
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** User authentication with email/password and SSO (Google Workspace, Microsoft 365). JWT token management, password reset, and role-based access control (RBAC).
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-006 (architect) - Authentication - Architecture and Strategy
- [ ] GE-007 (backend) - Authentication - Backend Implementation
- [ ] GE-008 (frontend) - Authentication - Frontend Implementation
- [ ] GE-009 (designer) - Authentication - UI/UX Design
- [ ] GE-010 (e2e) - Authentication - E2E Tests

**Notes:** Critical security foundation. SSO is preferred by schools. FERPA compliance starts here (audit logging).

**Dependencies:**
- GE-001 (architect - overall architecture)
- GE-002 (backend - app initialized)

---

### Epic 3: user-management
**Epic ID:** user-management
**Status:** Not Started
**Priority:** P1 (high)
**Target Release:** v1.0 (MVP)
**Description:** User profile management, teacher/principal/admin user CRUD, school associations, and role assignment.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-011 (backend) - User Management - Backend Implementation
- [ ] GE-012 (frontend) - User Management - Frontend Implementation
- [ ] GE-013 (designer) - User Management - UI/UX Design
- [ ] GE-014 (e2e) - User Management - E2E Tests

**Notes:** Principals need ability to manage teachers. Teachers manage their own profiles.

**Dependencies:**
- GE-007 (backend - authentication, users created during auth)
- GE-009 (designer - design system from auth UI)

---

### Epic 4: student-management
**Epic ID:** student-management
**Status:** Not Started
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Student roster management including CRUD operations, class organization, CSV bulk import, archival, and data isolation (teachers only see their students).
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-015 (backend) - Student Management - Backend Implementation
- [ ] GE-016 (frontend) - Student Management - Frontend Implementation
- [ ] GE-017 (designer) - Student Management - UI/UX Design
- [ ] GE-018 (e2e) - Student Management - E2E Tests

**Notes:** CSV import is critical for onboarding (teachers won't manually add 150 students). Data isolation enforced strictly (FERPA).

**Dependencies:**
- GE-011 (backend - user management, teacher-student associations)

---

### Epic 5: ai-analysis
**Epic ID:** ai-analysis
**Status:** Not Started
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

**Notes:** THIS IS THE CORE PRODUCT DIFFERENTIATOR. Must complete in 5-10 minutes. Cost control critical ($0.01-0.05 per analysis). Prompt engineering will require iteration.

**Dependencies:**
- GE-015 (backend - students exist to analyze)
- GE-019 (architect - prompts and architecture designed)

---

### Epic 6: analysis-results
**Epic ID:** analysis-results
**Status:** Not Started
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Display, edit, and export analysis results. Teacher can review AI-generated recommendations, edit them, add private notes, export PDF, and flag students for intervention.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-024 (backend) - Analysis Results - Backend Implementation
- [ ] GE-025 (frontend) - Analysis Results - Frontend Implementation
- [ ] GE-026 (designer) - Analysis Results - UI/UX Design
- [ ] GE-027 (e2e) - Analysis Results - E2E Tests

**Notes:** Teachers must approve all AI recommendations (human-in-the-loop). PDF export for parent conferences. Private notes for teacher use only.

**Dependencies:**
- GE-020 (backend - AI analysis generates results)
- GE-021 (frontend - flows from analysis session to results)

---

### Epic 7: teacher-dashboard
**Epic ID:** teacher-dashboard
**Status:** Not Started
**Priority:** P1 (high)
**Target Release:** v1.0 (MVP)
**Description:** Teacher dashboard showing student roster, analysis completion status, flagged students, quick actions to start analyses, and class-wide trends.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-028 (backend) - Teacher Dashboard - Backend Implementation
- [ ] GE-029 (frontend) - Teacher Dashboard - Frontend Implementation
- [ ] GE-030 (designer) - Teacher Dashboard - UI/UX Design
- [ ] GE-031 (e2e) - Teacher Dashboard - E2E Tests

**Notes:** Dashboard is landing page after login. Must show all students at a glance. Quick actions to start analysis.

**Dependencies:**
- GE-015 (backend - student data)
- GE-020 (backend - analysis data)
- GE-008 (frontend - auth flows into dashboard)

---

### Epic 8: principal-dashboard
**Epic ID:** principal-dashboard
**Status:** Not Started
**Priority:** P1 (high)
**Target Release:** v1.0 (MVP)
**Description:** Principal executive dashboard with school-wide metrics, teacher activity, aggregated student insights, grade-level comparisons, and exportable reports.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-032 (backend) - Principal Dashboard - Backend Implementation
- [ ] GE-033 (frontend) - Principal Dashboard - Frontend Implementation
- [ ] GE-034 (designer) - Principal Dashboard - UI/UX Design
- [ ] GE-035 (e2e) - Principal Dashboard - E2E Tests

**Notes:** Principals need school-wide visibility. Drill-down from metrics to individual students. Export reports for district meetings.

**Dependencies:**
- GE-028 (backend - similar analytics logic to teacher dashboard)
- GE-029 (frontend - reuse dashboard components)

---

### Epic 9: search-filter
**Epic ID:** search-filter
**Status:** Not Started
**Priority:** P2 (medium)
**Target Release:** v1.0 (MVP)
**Description:** Global search and advanced filtering for students and analyses. Full-text search, multi-criteria filtering, and saved filter presets.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-036 (backend) - Search & Filter - Backend Implementation
- [ ] GE-037 (frontend) - Search & Filter - Frontend Implementation
- [ ] GE-038 (designer) - Search & Filter - UI/UX Design
- [ ] GE-039 (e2e) - Search & Filter - E2E Tests

**Notes:** Important for teachers with 150+ students. Full-text search with fuzzy matching. Filter persistence in URL.

**Dependencies:**
- GE-015 (backend - student data to search)
- GE-020 (backend - analysis data to search)

---

### Epic 10: security-compliance
**Epic ID:** security-compliance
**Status:** Not Started
**Priority:** P0 (critical)
**Target Release:** v1.0 (MVP)
**Description:** Comprehensive security and FERPA compliance including encryption (at rest/in transit), audit logging, data protection, CSRF/XSS prevention, rate limiting, and compliance documentation.
**E2E Status:** Not Started

**Related Tickets:**
- [ ] GE-040 (backend) - Security & Compliance - Implementation
- [ ] GE-041 (e2e) - Security & Compliance - E2E Tests

**Notes:** FERPA COMPLIANCE IS NON-NEGOTIABLE. Must be complete before pilot launch. Engage legal counsel for review. Annual security audit recommended.

**Dependencies:**
- GE-001 (architect - security architecture)
- GE-007 (backend - authentication as security foundation)

---

## Standalone Tickets

No standalone tickets for MVP. All work is organized by epics.

---

## Completed Epics

None yet. All epics are in planning/development phase.

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
