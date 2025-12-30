# GE-011: User Management - Backend Implementation

**Epic:** user-management
**Owner role:** backend
**Status:** TODO
**Priority:** P1 (high)
**Created:** 2025-12-30

## Dependencies
- GE-001 (architect) - Architecture design with user data model
- GE-007 (backend) - Authentication system (user creation tied to auth)

## Context
- Architecture: /docs/ARCHITECTURE.md (Database schema - Users table)
- Requirements: /context/requirements.md (User Management section)
- PRD: /docs/PRD.md (Section 4: User Personas)

## Description
Implement user management backend API for CRUD operations on teachers, principals, and admin users. Support profile management, role assignment, and school/class associations.

## Acceptance Criteria
- [ ] User CRUD API endpoints:
  - [ ] GET /users - list users (with pagination, filtering by role/school)
  - [ ] GET /users/:id - get single user by ID
  - [ ] GET /users/me - get current authenticated user profile
  - [ ] POST /users - create new user (admin only)
  - [ ] PATCH /users/:id - update user profile
  - [ ] DELETE /users/:id - soft delete user (admin only)
- [ ] User profile fields:
  - [ ] Basic: name, email, role (teacher/principal/admin)
  - [ ] School affiliation: school_id (required for teachers/principals)
  - [ ] Teacher-specific: grade levels taught, subjects
  - [ ] Principal-specific: managed grade levels/departments
  - [ ] Optional: profile photo, phone number, bio
- [ ] Role-based access control:
  - [ ] Teachers can update their own profile only
  - [ ] Principals can view teachers in their school
  - [ ] Principals can manage teacher accounts (create, update)
  - [ ] Admins can manage all users
  - [ ] Users cannot change their own role
- [ ] School and class associations:
  - [ ] Teachers belong to one school
  - [ ] Teachers can be assigned to multiple classes
  - [ ] Principals belong to one school
  - [ ] Validate school exists when creating user
- [ ] Data validation:
  - [ ] Email format validation and uniqueness
  - [ ] Role enum validation (teacher, principal, admin)
  - [ ] Required field validation
  - [ ] Input sanitization (prevent XSS, SQL injection)
- [ ] Audit logging:
  - [ ] Log user creation, updates, deletions
  - [ ] Track who made changes (FERPA compliance)
- [ ] Database migrations:
  - [ ] Users table schema
  - [ ] School table schema (basic: id, name, district)
  - [ ] User-school association
  - [ ] Indexes on foreign keys and email
- [ ] Testing:
  - [ ] Unit tests for user service
  - [ ] Integration tests for all CRUD endpoints
  - [ ] Test RBAC (teacher can't delete users, etc.)
  - [ ] Test validation rules

## Deliverables
- `/packages/backend/src/users` module with controller, service, DTOs
- Database migrations for users and schools tables
- Unit and integration tests
- API documentation (Swagger)

## Notes
- Users are created initially via authentication registration
- This module is for profile management after account creation
- Soft delete users to preserve data integrity (don't hard delete)
- Consider bulk user import for schools (CSV) in future
- School management is minimal for MVP (just name and ID)

## Estimated Effort
3 days (backend)
