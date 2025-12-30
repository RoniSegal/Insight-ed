# GE-024: Analysis Results - Backend Implementation

**Epic:** analysis-results
**Owner role:** backend
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-020 (backend) - AI analysis backend (results exist to display/edit)

## Context
- PRD: /docs/PRD.md (Section 5: Journey 1 - Review Results step)
- Requirements: /context/requirements.md (Analysis Results & Recommendations)

## Description
Implement backend API for analysis results viewing, editing, PDF export, and sharing.

## Acceptance Criteria
- [ ] Results viewing API:
  - [ ] GET /analyses/:id/results - retrieve analysis results
  - [ ] Results include: strengths, weaknesses, learning_style, recommendations, evidence
  - [ ] Include metadata: student_name, teacher_name, date_completed
- [ ] Results editing API:
  - [ ] PATCH /analyses/:id/results - edit any section
  - [ ] Track edit history (versions)
  - [ ] Add private notes (teacher-only, not visible to principal)
- [ ] PDF export:
  - [ ] GET /analyses/:id/export-pdf - generate PDF report
  - [ ] Professional formatting (school branding optional)
  - [ ] Include: student info, analysis summary, recommendations
  - [ ] Store generated PDFs or generate on-demand
- [ ] Sharing functionality:
  - [ ] POST /analyses/:id/share - share with other teachers/specialists
  - [ ] Permission-based access
  - [ ] Audit log for sharing (FERPA compliance)
- [ ] Flagging system:
  - [ ] PATCH /analyses/:id/flag - mark student for follow-up
  - [ ] Flag categories: reading_intervention, behavioral_support, urgent
- [ ] History tracking:
  - [ ] GET /students/:id/analyses - list all analyses for student
  - [ ] Compare multiple analyses (show progress over time)
- [ ] Testing:
  - [ ] Unit and integration tests
  - [ ] Test PDF generation
  - [ ] Test data isolation (teacher can only edit own analyses)

## Deliverables
- Results viewing and editing endpoints
- PDF generation service
- Database migrations for flagging/sharing
- Unit and integration tests
- API documentation

## Estimated Effort
3 days (backend)
