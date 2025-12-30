# GE-020: AI Analysis - Backend Implementation

**Epic:** ai-analysis
**Owner role:** backend
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-015 (backend) - Student management (students exist to analyze)
- GE-019 (architect) - AI analysis architecture and prompts designed

## Context
- Architecture: /docs/ARCHITECTURE.md (AI Analysis section)
- Prompt Engineering: /docs/PROMPT_ENGINEERING.md
- Requirements: /context/requirements.md (Analysis Workflow)
- PRD: /docs/PRD.md (Section 5: Journey 1 - Analysis session flow)

## Description
Implement AI-powered analysis backend including OpenAI API integration, conversation management, prompt orchestration, analysis synthesis, and cost tracking.

## Acceptance Criteria
- [ ] OpenAI API integration:
  - [ ] Install and configure OpenAI SDK (@openai/api)
  - [ ] API key management (from environment variables)
  - [ ] Chat completions endpoint integration
  - [ ] Streaming response support (optional for better UX)
  - [ ] Error handling (timeouts, rate limits, invalid responses)
  - [ ] Retry logic with exponential backoff
- [ ] Analysis session management API:
  - [ ] POST /analyses/start - create new analysis session
    - Input: student_id
    - Output: analysis_id, first question
    - Initialize conversation state
  - [ ] POST /analyses/:id/message - conversational turn
    - Input: analysis_id, teacher_message
    - Output: next_question or completion signal
    - Append to conversation history
    - Call OpenAI API with accumulated context
    - Determine next state (continue or synthesize)
  - [ ] POST /analyses/:id/synthesize - generate final analysis
    - Input: analysis_id
    - Output: analysis_results (strengths, weaknesses, recommendations)
    - Send full conversation to synthesis prompt
    - Parse structured output (JSON or markdown)
    - Save results to database
  - [ ] GET /analyses/:id - retrieve analysis
    - Output: analysis status, results, conversation history
  - [ ] PATCH /analyses/:id - teacher edits results
    - Input: updated strengths, weaknesses, recommendations, private_notes
    - Output: success confirmation
  - [ ] POST /analyses/:id/save - finalize and save analysis
    - Mark analysis as complete
    - Trigger any post-save actions (alerts, notifications)
- [ ] Conversation state machine:
  - [ ] States: intro, academic, behavioral, engagement, synthesizing, complete, error
  - [ ] State transitions based on conversation progress
  - [ ] Progress indicator (% complete)
  - [ ] Pause/resume functionality (persist state)
- [ ] Prompt orchestration:
  - [ ] System prompt injection (educational context, role)
  - [ ] Question generation based on state
  - [ ] Context accumulation (build full conversation context)
  - [ ] Variable substitution (student name, grade, etc.)
  - [ ] Prompt templates loaded from database or config
- [ ] Response processing:
  - [ ] Parse OpenAI responses
  - [ ] Extract structured data (recommendations list, strengths list)
  - [ ] Validate response quality (length, relevance, safety)
  - [ ] Detect hallucinations or nonsensical output
  - [ ] Safety filtering (inappropriate content detection)
- [ ] Cost tracking:
  - [ ] Log token usage per API call
  - [ ] Calculate cost per analysis (input tokens + output tokens)
  - [ ] Aggregate cost by teacher, school, time period
  - [ ] GET /analytics/api-usage endpoint (admin only)
  - [ ] Cost alerts (email if monthly cost exceeds threshold)
- [ ] Database schema implementation:
  - [ ] Analyses table migration
  - [ ] Conversation history table migration
  - [ ] Prompt templates seeding
  - [ ] Usage metrics table migration
- [ ] Authorization:
  - [ ] Teachers can only analyze their own students
  - [ ] Teachers can only access their own analyses
  - [ ] Principals can view analyses for students in their school
  - [ ] Enforce row-level security
- [ ] Audit logging:
  - [ ] Log analysis start, completion, edits (FERPA compliance)
  - [ ] Track who accessed analysis results
- [ ] Testing:
  - [ ] Unit tests for conversation state machine
  - [ ] Integration tests with mocked OpenAI API
  - [ ] Test prompt generation for different states
  - [ ] Test cost calculation logic
  - [ ] Test error handling (API timeout, rate limit, invalid response)
  - [ ] Test data isolation (teacher can't access other teacher's analyses)

## Deliverables
- `/packages/backend/src/analyses` module with controller, service, DTOs
- OpenAI integration service
- Conversation state machine
- Prompt orchestration engine
- Database migrations for analyses, conversation history, usage metrics
- Unit and integration tests (80%+ coverage)
- API documentation (Swagger)

## Notes
- This is the core product feature - must be bulletproof
- Mock OpenAI API in tests to avoid costs and ensure deterministic tests
- Consider using LangChain library for prompt management (optional)
- Streaming responses improve UX but add complexity (implement if time allows)
- Store full conversation history for future model fine-tuning
- Implement cost alerts early to prevent runaway spending
- Test with real GPT-4 during development (allocate budget for testing)
- Edge case: Teacher gives very short responses - prompt should ask for elaboration
- Edge case: Teacher gives conflicting information - AI should ask clarifying questions

## Estimated Effort
6 days (backend)
