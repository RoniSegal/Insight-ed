# GE-032: Principal Dashboard - Backend Implementation

**Epic:** principal-dashboard
**Owner role:** backend
**Status:** TODO
**Priority:** P1 (high)
**Created:** 2025-12-30

## Dependencies
- GE-028 (backend) - Teacher dashboard (similar analytics logic)

## Context
- PRD: /docs/PRD.md (Section 5: Journey 2 - Principal Reviews School-Wide Trends)
- Requirements: /context/requirements.md (Dashboard Principals)

## Description
Implement principal dashboard API providing school-wide analytics, teacher activity, aggregated student insights, and exportable reports.

## Acceptance Criteria
- [ ] Principal dashboard API:
  - [ ] GET /dashboard/principal - executive dashboard data
    - Total students in school
    - Total teachers
    - Analysis completion rate (school-wide)
    - Flagged students count and list
    - Teacher activity (who's using the platform)
    - School-wide trends (aggregated patterns)
  - [ ] GET /dashboard/principal/students - all students (filterable by grade, teacher, class)
  - [ ] GET /dashboard/principal/teachers - teacher activity report
  - [ ] GET /dashboard/principal/trends - time-series trends
- [ ] Advanced analytics:
  - [ ] Grade-level comparisons
  - [ ] Teacher-level comparisons (engagement metrics)
  - [ ] Most common student needs (aggregated across all analyses)
  - [ ] Intervention effectiveness (before/after analysis comparison)
- [ ] Data export:
  - [ ] GET /dashboard/principal/export - generate CSV/Excel report
  - [ ] Customizable date ranges and filters
- [ ] Authorization:
  - [ ] Principal can only see data for their school
  - [ ] Row-level security enforcement
- [ ] Performance:
  - [ ] Heavy caching (principal dashboards are read-heavy)
  - [ ] Pre-computed aggregations (materialized views or cron jobs)
  - [ ] Efficient queries for large datasets
- [ ] Testing:
  - [ ] Unit and integration tests
  - [ ] Test multi-school data isolation
  - [ ] Test aggregation logic

## Deliverables
- Principal dashboard endpoints
- Advanced analytics aggregations
- Export functionality
- Tests

## Estimated Effort
4 days (backend)
