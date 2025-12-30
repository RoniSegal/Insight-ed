# GE-023: AI Analysis - E2E Tests

**Epic:** ai-analysis
**Owner role:** e2e
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-005 (e2e) - E2E framework
- GE-020 (backend) - AI analysis backend (mocked)
- GE-021 (frontend) - AI analysis frontend

## Context
- PRD: /docs/PRD.md (Core product feature - must be thoroughly tested)
- Discovery: /context/discovery.md (Testing Priorities #1: AI analysis workflow)

## Description
Create comprehensive E2E tests for AI-guided analysis workflow including conversation flow, session persistence, and results generation. Mock OpenAI API to ensure deterministic tests.

## Acceptance Criteria
- [ ] Analysis workflow tests:
  - [ ] Test: Start analysis session from student detail page
  - [ ] Test: Complete full analysis (mock 3-5 question flow)
  - [ ] Test: Analysis results generated correctly
  - [ ] Test: Teacher can edit generated results
  - [ ] Test: Save final analysis
- [ ] Conversation tests:
  - [ ] Test: Send teacher response, receive next question
  - [ ] Test: Progress indicator updates correctly
  - [ ] Test: Conversation history displayed
  - [ ] Test: Auto-scroll to latest message
- [ ] Session persistence tests:
  - [ ] Test: Save session and resume later
  - [ ] Test: Auto-save prevents data loss
  - [ ] Test: Session timeout warning displayed
- [ ] Error handling tests:
  - [ ] Test: API timeout handled gracefully
  - [ ] Test: Network error with retry
  - [ ] Test: Invalid API response handled
- [ ] Authorization tests:
  - [ ] Test: Teacher can only analyze their own students
  - [ ] Test: Principal can view analysis results
- [ ] Edge cases:
  - [ ] Test: Very short teacher responses (prompt for detail)
  - [ ] Test: Session interrupted (can resume)

## Deliverables
- `/e2e/ai-analysis/` with comprehensive tests
- Mocked OpenAI API responses
- Page Object Models for analysis screens

## Notes
- CRITICAL: Mock OpenAI API (use interceptors)
- Test full happy path end-to-end
- This is the core product feature - thorough testing required

## Estimated Effort
4 days (e2e)
