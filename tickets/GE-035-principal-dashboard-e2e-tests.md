# GE-035: Principal Dashboard - E2E Tests

**Epic:** principal-dashboard
**Owner role:** e2e
**Status:** TODO
**Priority:** P1 (high)
**Created:** 2025-12-30

## Dependencies
- GE-033 (frontend) - Principal dashboard implemented

## Description
Create E2E tests for principal dashboard workflows including viewing school-wide data, filtering, drill-down, and export.

## Acceptance Criteria
- [ ] Dashboard viewing tests:
  - [ ] Test: Principal logs in and sees executive dashboard
  - [ ] Test: All metrics displayed correctly
  - [ ] Test: Charts render with data
- [ ] Filtering tests:
  - [ ] Test: Filter by grade level
  - [ ] Test: Filter by teacher
  - [ ] Test: Filter by date range
- [ ] Drill-down tests:
  - [ ] Test: Click metric to see details
  - [ ] Test: View student analysis from flagged list
- [ ] Export tests:
  - [ ] Test: Export report as CSV
  - [ ] Test: Download completes successfully
- [ ] Authorization tests:
  - [ ] Test: Principal only sees their school's data

## Deliverables
- `/e2e/principal-dashboard/` with tests
- Page Object Models

## Estimated Effort
3 days (e2e)
