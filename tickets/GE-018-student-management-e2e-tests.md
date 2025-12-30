# GE-018: Student Management - E2E Tests

**Epic:** student-management
**Owner role:** e2e
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-005 (e2e) - E2E framework
- GE-015 (backend) - Student management backend
- GE-016 (frontend) - Student management frontend

## Context
- PRD: /docs/PRD.md (Student management flows)
- Discovery: /context/discovery.md (Testing Priorities - Student data integrity)

## Description
Create E2E tests for student management including CRUD operations, CSV import, class organization, and data isolation.

## Acceptance Criteria
- [ ] Student CRUD tests:
  - [ ] Test: Create new student successfully
  - [ ] Test: Edit student information
  - [ ] Test: Archive student (with confirmation)
  - [ ] Test: Unarchive student
  - [ ] Test: View student detail page
- [ ] Student list tests:
  - [ ] Test: Search students by name
  - [ ] Test: Filter by class
  - [ ] Test: Filter by grade level
  - [ ] Test: Sort by name, grade
  - [ ] Test: Pagination works correctly
- [ ] Class management tests:
  - [ ] Test: Create new class
  - [ ] Test: Assign students to class
  - [ ] Test: Remove student from class
  - [ ] Test: Delete class (empty class only)
- [ ] CSV import tests:
  - [ ] Test: Download CSV template
  - [ ] Test: Upload valid CSV (students created)
  - [ ] Test: Upload CSV with errors (validation failures shown)
  - [ ] Test: Import summary displayed correctly
- [ ] Data isolation tests:
  - [ ] Test: Teacher A cannot see Teacher B's students
  - [ ] Test: Principal can see all students in school
- [ ] Edge cases:
  - [ ] Test: Duplicate student detection
  - [ ] Test: Large roster (100+ students) loads correctly

## Deliverables
- `/e2e/student-management/` with comprehensive tests
- Test utilities for student creation
- CSV test fixtures (valid and invalid files)
- Page Object Models

## Notes
- Critical: Test data isolation strictly (FERPA compliance)
- CSV import is high-priority (common onboarding path)

## Estimated Effort
3 days (e2e)
