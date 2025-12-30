# GE-012: User Management - Frontend Implementation

**Epic:** user-management
**Owner role:** frontend
**Status:** TODO
**Priority:** P1 (high)
**Created:** 2025-12-30

## Dependencies
- GE-011 (backend) - User management API implemented
- GE-013 (designer) - User management UI designed

## Context
- PRD: /docs/PRD.md (Section 4: User Personas)
- Requirements: /context/requirements.md (User Management section)
- Design: UI designs from GE-013

## Description
Implement user profile management interface and admin user management screens. Allow users to view and edit their profiles, and allow principals/admins to manage teachers.

## Acceptance Criteria
- [ ] User profile page (`/profile`):
  - [ ] Display current user information (name, email, role, school)
  - [ ] Edit profile form (name, grade levels, subjects, phone)
  - [ ] Profile photo upload (optional)
  - [ ] Change password functionality
  - [ ] Save changes button with validation
  - [ ] Success/error messaging
- [ ] Principal: Manage teachers page (`/manage/teachers`):
  - [ ] List all teachers in principal's school
  - [ ] Search and filter teachers (by name, grade, subject)
  - [ ] View teacher details
  - [ ] Add new teacher button (opens create form)
  - [ ] Edit teacher (opens edit form)
  - [ ] Deactivate teacher (soft delete with confirmation)
- [ ] Create/Edit teacher form:
  - [ ] Fields: name, email, role, grade levels, subjects
  - [ ] Form validation (required fields, email format)
  - [ ] School auto-assigned (principal's school)
  - [ ] Save and cancel buttons
  - [ ] Success/error handling
- [ ] Admin: Manage all users page (`/admin/users`):
  - [ ] List all users (teachers, principals, admins)
  - [ ] Filter by role, school, status (active/inactive)
  - [ ] Pagination for large user lists
  - [ ] Create new user (any role)
  - [ ] Edit user
  - [ ] Deactivate/reactivate user
- [ ] User data table:
  - [ ] Columns: Name, Email, Role, School, Status, Actions
  - [ ] Sortable columns
  - [ ] Row actions (view, edit, deactivate)
  - [ ] Bulk actions (future: deactivate multiple)
- [ ] Form components:
  - [ ] Reusable form inputs (text, email, select, multi-select)
  - [ ] Validation and error display
  - [ ] Loading states during submission
  - [ ] Confirmation modals for destructive actions
- [ ] Testing:
  - [ ] Unit tests for profile components
  - [ ] Integration tests for form submission
  - [ ] Test RBAC (teacher can't access manage teachers)

## Deliverables
- `/packages/frontend/src/app/profile` - user profile page
- `/packages/frontend/src/app/manage/teachers` - principal teacher management
- `/packages/frontend/src/app/admin/users` - admin user management
- Reusable form components
- Unit and integration tests

## Notes
- Teachers should only see profile editing (not user management)
- Principals can only manage teachers in their own school
- Admins have full access to all users
- Consider using react-hook-form for form management
- Use data table component library (e.g., TanStack Table) for user lists
- Mobile responsive design (works on tablets for principals)

## Estimated Effort
3 days (frontend)
