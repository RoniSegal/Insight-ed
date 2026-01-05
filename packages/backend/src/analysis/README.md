# Analysis Module

REST API endpoints for student analysis workflow using AI-powered conversations.

## Overview

The Analysis Module provides a complete backend implementation for the student analysis feature, replacing the Next.js API routes with proper NestJS endpoints.

### Features

- Start new analysis conversations for students
- Continue conversations with AI-powered responses
- Generate final analysis reports
- Retrieve saved analysis results
- In-memory conversation state management (MVP)
- JWT authentication on all endpoints
- Swagger/OpenAPI documentation
- Rate limiting support (TODO)
- Authorization checks (TODO)

## Architecture

### Components

- **AnalysisController** - REST API endpoints
- **AnalysisService** - Business logic and state management
- **DTOs** - Request/response validation with class-validator
- **Entities** - Data models for conversations and analyses

### Dependencies

- **OpenAIModule** - AI conversation via GPT models
- **PromptsModule** - System prompts and question templates
- **AuthModule** - JWT authentication

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

Base URL: `http://localhost:4000/api/v1/analysis`

### 1. Start Analysis Conversation

**POST** `/start`

Initialize a new analysis conversation for a student.

**Request:**

```json
{
  "studentId": "1",
  "studentName": "Sarah Cohen"
}
```

**Response:**

```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "שלום! בואו ננתח את Sarah Cohen. כדי ליצור ניתוח מקיף..."
}
```

### 2. Send Chat Message

**POST** `/chat`

Continue an analysis conversation by sending a user message.

**Request:**

```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "התלמידה מצטיינת במתמטיקה אבל מתקשה בקריאה"
}
```

**Response:**

```json
{
  "message": "תודה על המידע. ספר לי יותר על התנהגות התלמידה בכיתה...",
  "isComplete": false,
  "metadata": {
    "questionCount": 2,
    "messageCount": 5
  }
}
```

### 3. Complete Analysis

**POST** `/complete`

Generate the final analysis report and save it.

**Request:**

```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**

```json
{
  "analysisId": "42",
  "studentId": "1",
  "completedAt": "2026-01-04T19:30:00.000Z"
}
```

### 4. Get Analysis by ID

**GET** `/:id`

Retrieve a saved analysis result by ID.

**Response:**

```json
{
  "id": "42",
  "studentId": "1",
  "analysis": "# ניתוח תלמידה: שרה כהן\n\n## נקודות חוזק...",
  "createdAt": "2026-01-04T19:30:00.000Z",
  "createdBy": "teacher-123",
  "conversationHistory": [...]
}
```

### 5. Get All Analyses for Student

**GET** `/student/:studentId`

Retrieve all analyses for a specific student (sorted by date, newest first).

**Response:**

```json
[
  {
    "id": "42",
    "studentId": "1",
    "analysis": "...",
    "createdAt": "2026-01-04T19:30:00.000Z",
    "createdBy": "teacher-123"
  }
]
```

### 6. Get Latest Analysis for Student

**GET** `/student/:studentId/latest`

Retrieve the most recent analysis for a student.

**Response:** Same as "Get Analysis by ID"

## Usage Example

```typescript
// 1. Start conversation
const startResponse = await fetch('http://localhost:4000/api/v1/analysis/start', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <jwt-token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    studentId: '1',
    studentName: 'Sarah Cohen',
  }),
});
const { conversationId, message } = await startResponse.json();

// 2. Send messages
const chatResponse = await fetch('http://localhost:4000/api/v1/analysis/chat', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <jwt-token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    conversationId,
    message: 'התלמידה מצטיינת במתמטיקה',
  }),
});

// 3. Complete analysis
const completeResponse = await fetch('http://localhost:4000/api/v1/analysis/complete', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <jwt-token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ conversationId }),
});
const { analysisId } = await completeResponse.json();

// 4. Get saved analysis
const analysisResponse = await fetch(`http://localhost:4000/api/v1/analysis/${analysisId}`, {
  headers: {
    Authorization: 'Bearer <jwt-token>',
  },
});
```

## State Management

### Conversation Store (In-Memory - MVP)

- Conversations are stored in-memory using a Map
- TTL: 24 hours (auto-cleanup runs every hour)
- Structure: `conversationId -> ConversationState`

### Analysis Store (In-Memory - MVP)

- Analyses are stored in-memory using a Map
- Student index for fast lookup: `studentId -> analysisId[]`
- Persists until server restart

**Future:** Both stores will be replaced with database persistence (Prisma).

## Error Handling

### HTTP Status Codes

- `200` - Success (GET, POST chat/complete)
- `201` - Created (POST start)
- `400` - Bad Request (validation errors, invalid conversation state)
- `401` - Unauthorized (missing or invalid JWT)
- `404` - Not Found (conversation or analysis not found)
- `429` - Rate Limit Exceeded (too many requests)
- `500` - Internal Server Error

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Conversation ID required",
  "error": "Bad Request"
}
```

## Validation

All DTOs use `class-validator` for automatic validation:

- `studentId` - required, non-empty string
- `conversationId` - required, non-empty string (UUID format)
- `message` - required, non-empty string, max 5000 characters

## Testing

See `/packages/backend/src/analysis/__tests__/` for:

- Integration tests for all endpoints
- Mock OpenAI service
- Authorization tests
- Error scenario tests
- 85%+ code coverage

Run tests:

```bash
npm test -- analysis
```

## Future Enhancements

- [ ] Database persistence (replace in-memory stores)
- [ ] Rate limiting per user (global + per-endpoint)
- [ ] Authorization checks:
  - Teachers can only analyze their own students
  - Principals can view all analyses for their school
- [ ] Fetch student name from database (remove `studentName` from start DTO)
- [ ] WebSocket support for real-time updates
- [ ] Conversation resumption (save/load partial conversations)
- [ ] Analysis versioning and comparison
- [ ] Export analyses as PDF

## Migration from Next.js API Routes

This module replaces:

- `/packages/frontend/src/app/api/analysis/start/route.ts`
- `/packages/frontend/src/app/api/analysis/chat/route.ts`
- `/packages/frontend/src/app/api/analysis/complete/route.ts`
- `/packages/frontend/src/app/api/analysis/by-id/[id]/route.ts`
- `/packages/frontend/src/app/api/analysis/student/[studentId]/route.ts`
- `/packages/frontend/src/app/api/analysis/student/[studentId]/latest/route.ts`

Frontend should update API calls to use `http://localhost:4000/api/v1/analysis/*` instead.

## Swagger Documentation

View interactive API documentation at:

```
http://localhost:4000/api/docs
```

(Requires Swagger module to be configured in main.ts)
