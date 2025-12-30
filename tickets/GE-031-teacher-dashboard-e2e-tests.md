# GE-031: Teacher Dashboard - E2E Tests

**Epic:** teacher-dashboard
**Owner role:** e2e
**Status:** TODO
**Priority:** P1 (high)
**Created:** 2025-12-30

## Dependencies
- GE-029 (frontend) - Dashboard implemented

## Description
Create E2E tests for teacher dashboard workflows including viewing students, starting analyses, and viewing trends.

## Acceptance Criteria
- [ ] Dashboard viewing tests:
  - [ ] Test: Teacher logs in and sees dashboard
  - [ ] Test: All students displayed with correct status
  - [ ] Test: Completion rate calculated correctly
- [ ] Quick action tests:
  - [ ] Test: Click "Start Analysis" navigates to analysis page
  - [ ] Test: Click "View Results" opens results page
- [ ] Filtering tests:
  - [ ] Test: Filter by completion status
  - [ ] Test: Search students by name
- [ ] Trends tests:
  - [ ] Test: Trends chart displays after analyses completed

## Deliverables
- `/e2e/teacher-dashboard/` with tests
- Page Object Models

## Estimated Effort
2 days (e2e)
