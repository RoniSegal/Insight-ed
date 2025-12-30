# GE-017: Student Management - UI/UX Design

**Epic:** student-management
**Owner role:** designer
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-013 (designer) - User management UI (establishes patterns for data tables)

## Context
- PRD: /docs/PRD.md (Section 4: Personas - Sarah Chen, Jennifer Rodriguez)
- Requirements: /context/requirements.md (Student Management section)

## Description
Design student roster management interface that works for both elementary teachers (25 students) and high school teachers (150+ students). Include student list, CRUD forms, class organization, and CSV import flow.

## Acceptance Criteria
- [ ] Student roster list design:
  - [ ] Table view for desktop (name, grade, class, actions)
  - [ ] Card view for mobile (compact, touch-friendly)
  - [ ] Search and filter controls
  - [ ] "Add Student" and "Import CSV" buttons
  - [ ] Empty state with call-to-action
  - [ ] Loading state (skeleton loaders)
  - [ ] Pagination controls
- [ ] Add/Edit student form design:
  - [ ] Clean, focused form layout
  - [ ] Required field indicators
  - [ ] Class multi-select with clear visual
  - [ ] Validation error states
  - [ ] Save and cancel buttons
- [ ] Student detail view design:
  - [ ] Student information card
  - [ ] Analysis history section
  - [ ] Edit and archive actions
  - [ ] Breadcrumb navigation
- [ ] Class organization interface:
  - [ ] Class list with student count
  - [ ] Create/edit class form
  - [ ] Visual indication of which students are in which classes
  - [ ] (Optional) Drag-and-drop to assign students to classes
- [ ] CSV import flow design:
  - [ ] Upload modal with clear instructions
  - [ ] CSV template download button
  - [ ] Drag-and-drop upload area
  - [ ] Preview table (first 10 rows)
  - [ ] Validation error display
  - [ ] Progress indicator
  - [ ] Success summary screen
  - [ ] Error report (downloadable)
- [ ] Archive functionality design:
  - [ ] Confirmation modal for archiving
  - [ ] Archived badge or visual indicator
  - [ ] Archived students view (separate or filtered)
  - [ ] Unarchive action
- [ ] Design for scale:
  - [ ] Virtual scrolling for 150+ students
  - [ ] Efficient filtering and search
  - [ ] Bulk actions (future: archive multiple)
- [ ] Accessibility:
  - [ ] Keyboard navigation for table
  - [ ] Screen reader labels
  - [ ] Focus management in modals
  - [ ] Touch targets min 44x44px (mobile)

## Deliverables
- High-fidelity mockups for student management screens
- Interactive prototype showing workflows
- CSV import flow designs
- Mobile responsive variations
- Design specifications

## Notes
- Persona: Jennifer Rodriguez needs interface that scales to 150 students
- Persona: Sarah Chen needs simplicity for 24 students
- CSV import is critical for onboarding (teachers won't manually add 150 students)
- Empty state should encourage first student or CSV import
- Consider accessibility (many students may have IEPs)

## Estimated Effort
3 days (designer)
