# GE-014: User Management - E2E Tests

**Epic:** user-management
**Owner role:** e2e
**Status:** TODO
**Priority:** P1 (high)
**Created:** 2025-12-30

## Dependencies
- GE-005 (e2e) - E2E framework set up
- GE-011 (backend) - User management backend
- GE-012 (frontend) - User management frontend

## Context
- PRD: /docs/PRD.md (User management flows)

## Description
Create E2E tests for user profile management and admin user management workflows.

## Acceptance Criteria
- [ ] Profile management tests:
  - [ ] Test: Teacher edits own profile successfully
  - [ ] Test: Profile changes persist after page refresh
  - [ ] Test: Password change works correctly
  - [ ] Test: Profile photo upload (optional)
- [ ] Principal: Teacher management tests:
  - [ ] Test: Principal views list of teachers in their school
  - [ ] Test: Principal creates new teacher
  - [ ] Test: Principal edits teacher information
  - [ ] Test: Principal deactivates teacher (with confirmation)
  - [ ] Test: Search and filter teachers works
- [ ] Admin: User management tests:
  - [ ] Test: Admin views all users across schools
  - [ ] Test: Admin creates principal user
  - [ ] Test: Admin edits user role (with proper authorization)
  - [ ] Test: Filter by role, school, status works
- [ ] Authorization tests:
  - [ ] Test: Teacher cannot access teacher management page
  - [ ] Test: Principal cannot manage users outside their school
  - [ ] Test: Admin can manage all users

## Deliverables
- `/e2e/user-management/` with comprehensive test coverage
- Test utilities for user creation and management
- Page Object Models for user management screens

## Notes
- Test data isolation (create test users, clean up after)
- Verify RBAC enforcement strictly

## Estimated Effort
2 days (e2e)
