# GE-015: Student Management - Backend Implementation

**Epic:** student-management
**Owner role:** backend
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-001 (architect) - Database schema for students, classes
- GE-011 (backend) - User management (teacher-student associations)

## Context
- Architecture: /docs/ARCHITECTURE.md (Database schema - Students, Classes)
- Requirements: /context/requirements.md (Student Management section)
- PRD: /docs/PRD.md (Core Features - Student Management)

## Description
Implement student management backend API for CRUD operations on students and classes. Support student roster management, class organization, CSV import, and proper data isolation (teachers only access their students).

## Acceptance Criteria
- [ ] Student CRUD API endpoints:
  - [ ] GET /students - list students (filtered by teacher, paginated)
  - [ ] GET /students/:id - get single student
  - [ ] POST /students - create student
  - [ ] PATCH /students/:id - update student
  - [ ] DELETE /students/:id - archive student (soft delete)
  - [ ] POST /students/bulk-import - CSV import
- [ ] Student data model:
  - [ ] Required fields: name, grade_level, teacher_id, school_id
  - [ ] Optional fields: student_id (external ID), date_of_birth, notes
  - [ ] PII handling (encrypted if sensitive data stored)
  - [ ] Status field (active/archived)
  - [ ] Timestamps (created_at, updated_at, archived_at)
- [ ] Class/Section management:
  - [ ] GET /classes - list classes for teacher
  - [ ] POST /classes - create class/section
  - [ ] PATCH /classes/:id - update class
  - [ ] DELETE /classes/:id - delete class (cascade handling)
  - [ ] Class fields: name (e.g., "Math Period 3"), teacher_id, grade_level
- [ ] Student-class associations:
  - [ ] POST /classes/:id/students - add students to class
  - [ ] DELETE /classes/:id/students/:studentId - remove student from class
  - [ ] Students can belong to multiple classes
  - [ ] Teachers can organize students by classes
- [ ] CSV bulk import:
  - [ ] POST /students/bulk-import endpoint
  - [ ] Accept CSV file (multipart/form-data)
  - [ ] Parse CSV with headers: name, grade_level, student_id, class
  - [ ] Validation of all rows before import
  - [ ] Return import summary (success count, errors)
  - [ ] Handle duplicate detection (skip or update)
  - [ ] Async processing for large files (queue job)
- [ ] Data isolation and authorization:
  - [ ] Teachers can only access students in their classes
  - [ ] Principals can access all students in their school
  - [ ] Admins can access all students
  - [ ] Enforce row-level security (filter queries by user role)
- [ ] Data validation:
  - [ ] Name required and non-empty
  - [ ] Grade level validation (K-12 or 1-12)
  - [ ] Student ID uniqueness within school (if provided)
  - [ ] Input sanitization (prevent XSS, SQL injection)
- [ ] Search and filtering:
  - [ ] Search students by name (fuzzy search)
  - [ ] Filter by class, grade level, status (active/archived)
  - [ ] Sort by name, grade, date added
- [ ] Audit logging:
  - [ ] Log student creation, updates, archival (FERPA compliance)
  - [ ] Track who made changes
- [ ] Database migrations:
  - [ ] Students table with indexes
  - [ ] Classes table
  - [ ] Student-class junction table (many-to-many)
  - [ ] Teacher-student association (via classes)
- [ ] Testing:
  - [ ] Unit tests for student service
  - [ ] Integration tests for CRUD endpoints
  - [ ] Test CSV import (valid and invalid files)
  - [ ] Test data isolation (teacher can't access other teacher's students)
  - [ ] Test archival (archived students not in active list)

## Deliverables
- `/packages/backend/src/students` module with controller, service, DTOs
- `/packages/backend/src/classes` module
- Database migrations for students and classes tables
- CSV import processor
- Unit and integration tests
- API documentation (Swagger)

## Notes
- Student data is PII - handle with care (FERPA compliance)
- Soft delete students (archive) to preserve historical analysis data
- CSV import should be async for large files (100+ students)
- Consider duplicate detection: match by name+grade or student_id
- Principals need access to all students in school for dashboard
- Search should be fast (indexed on name column)

## Estimated Effort
4 days (backend)
