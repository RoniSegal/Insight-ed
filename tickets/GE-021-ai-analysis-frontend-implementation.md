# GE-021: AI Analysis - Frontend Implementation

**Epic:** ai-analysis
**Owner role:** frontend
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-016 (frontend) - Student management (select student to analyze)
- GE-020 (backend) - AI analysis backend API
- GE-022 (designer) - AI analysis UI designed

## Context
- PRD: /docs/PRD.md (Section 5: Journey 1 - Teacher Conducts Student Analysis, 5-10 min flow)
- Design: UI designs from GE-022

## Description
Implement AI-guided analysis interface with conversational UI, real-time Q&A, progress tracking, and session persistence.

## Acceptance Criteria
- [ ] Analysis session initiation:
  - [ ] "Start Analysis" button on student detail page
  - [ ] Analysis session loading screen
  - [ ] First question displayed immediately
- [ ] Conversational interface (`/students/:id/analyze`):
  - [ ] Chat-like UI (AI questions on left, teacher responses on right)
  - [ ] Text input area for teacher responses
  - [ ] "Send" button and Enter key to submit
  - [ ] Loading indicator while AI generates next question
  - [ ] Conversation history scrollable
  - [ ] Progress indicator (e.g., "2 of 3 sections complete")
  - [ ] Auto-scroll to latest message
- [ ] Session management:
  - [ ] "Save & Resume Later" button (always visible)
  - [ ] Auto-save every 2 minutes (prevent data loss)
  - [ ] Resume saved session (show where left off)
  - [ ] Session timeout warning (if idle too long)
- [ ] Analysis completion:
  - [ ] "Complete Analysis" button when conversation ends
  - [ ] Synthesizing loading screen ("Analyzing your observations...")
  - [ ] Results page displayed
- [ ] User experience:
  - [ ] Typing indicator (show AI is thinking)
  - [ ] Character count or guidance (encourage detailed responses)
  - [ ] Help text or examples for teachers unsure what to say
  - [ ] Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- [ ] Error handling:
  - [ ] API timeout message ("Taking longer than usual, please wait...")
  - [ ] Network error ("Connection lost, retrying...")
  - [ ] Retry button for failed messages
  - [ ] Queue analysis for later if API unavailable
- [ ] Accessibility:
  - [ ] Keyboard navigation for entire conversation
  - [ ] Screen reader support
  - [ ] Focus management (auto-focus on input after each response)
- [ ] Testing:
  - [ ] Unit tests for conversation components
  - [ ] Integration tests for analysis flow
  - [ ] Test save/resume functionality
  - [ ] Test error scenarios

## Deliverables
- `/packages/frontend/src/app/students/[id]/analyze` - analysis session page
- Conversational UI components
- Session state management
- Unit and integration tests

## Notes
- Persona: Sarah Chen - 5-10 minute completion time is critical
- Chat interface should feel natural, not robotic
- Progress indicator helps teachers see how much time left
- Auto-save is critical (teachers may be interrupted by class needs)
- Mobile responsive (teachers may use tablets)

## Estimated Effort
5 days (frontend)
