# Analysis API - OpenAI Integration

This directory contains the backend API implementation for AI-powered student analysis using OpenAI GPT-4.

## Overview

The Analysis API enables teachers to conduct conversational student assessments powered by OpenAI's GPT-4. The system:

1. Initializes conversations with educational psychology prompts
2. Maintains conversation history across multiple teacher responses
3. Uses GPT-4 to ask follow-up questions and analyze responses
4. Generates comprehensive Hebrew analysis with actionable recommendations

## Architecture

### Implementation Approach

For the 3-day MVP, we implemented the backend using **Next.js API routes** instead of a separate NestJS server. This simplifies deployment and development while maintaining all required functionality.

### Core Components

```
src/app/api/
├── analysis/
│   ├── chat/route.ts          # Send messages in conversation
│   ├── start/route.ts         # Initialize new conversation
│   ├── complete/route.ts      # Generate final analysis
│   └── README.md              # This file
└── lib/
    ├── openai.ts              # OpenAI service
    ├── conversationStore.ts   # In-memory conversation storage
    ├── prompts.ts             # Prompt templates
    └── auth.ts                # JWT authentication
```

## API Endpoints

### 1. Start Conversation

**POST** `/api/analysis/start`

Initialize a new conversation for a student.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "studentId": "uuid-string"
}
```

**Response:**

```json
{
  "conversationId": "uuid-string",
  "message": "שלום! בואו ננתח את דוד. כדי ליצור ניתוח מקיף..."
}
```

### 2. Send Chat Message

**POST** `/api/analysis/chat`

Send a message in an active conversation.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "conversationId": "uuid-string",
  "message": "התלמיד מצטיין במתמטיקה אבל מתקשה בקריאה"
}
```

**Response:**

```json
{
  "message": "תודה! זה מאוד מועיל. כיצד דוד בדרך כלל מתקשר עם השיעורים?",
  "isComplete": false,
  "metadata": {
    "questionCount": 2,
    "messageCount": 5
  }
}
```

### 3. Complete Analysis

**POST** `/api/analysis/complete`

Generate final comprehensive analysis (called when `isComplete: true`).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "conversationId": "uuid-string"
}
```

**Response:**

```json
{
  "analysis": "# 📊 ניתוח למידה מקיף...",
  "studentId": "uuid-string",
  "studentName": "דוד כהן",
  "createdAt": "2025-12-31T10:00:00Z"
}
```

## Configuration

### Environment Variables

Add these to `.env.local` or `.env`:

```bash
# OpenAI Configuration (REQUIRED for AI features)
OPENAI_API_KEY=sk-proj-YOUR-API-KEY-HERE
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# JWT Secret (REQUIRED for authentication)
JWT_SECRET=your-secret-key-change-in-production
```

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-proj-` or `sk-`)
6. Add to `.env.local`

**Important:** Never commit your API key to git!

## How It Works

### 1. Conversation Flow

```
Teacher → Start Conversation
          ↓
    System loads prompt with student name
          ↓
    AI asks first question (Hebrew)
          ↓
    Teacher responds
          ↓
    AI asks follow-up (2-6 questions)
          ↓
    Conversation marked complete
          ↓
    Generate final analysis
```

### 2. System Prompt

The system uses an educational psychologist prompt from `/context/chat-prompt-simple.txt`:

```
You are an expert educational psychologist for K-12 students.
Your role is to help teachers analyze individual student learning profiles.

PROCESS:
1. Ask 6 key questions one at a time about:
   - Academic performance and subject strengths/weaknesses
   - Learning style and class engagement
   - Homework habits and behavior
   - Social interactions and emotional patterns
   - Learning challenges and progress
   - Unique strengths and observations

2. Provide comprehensive Hebrew analysis with:
   - Summary
   - Strengths (academic + behavioral/social)
   - Areas for improvement
   - Action plan with recommendations
   - Classroom adaptations
   - Success metrics
```

### 3. Conversation State Management

Conversations are stored **in-memory** using a Map:

```typescript
type ConversationState = {
  id: string;
  studentId: string;
  studentName: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  questionCount: number;
  isComplete: boolean;
  createdAt: Date;
};
```

**Note:** In production, migrate to database storage (Prisma + PostgreSQL).

### 4. OpenAI Integration

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: conversation.messages,
  temperature: 0.7,
  max_tokens: 2000,
});
```

Token usage is logged for cost tracking:

```
OpenAI API Call: {
  model: 'gpt-4-turbo-preview',
  promptTokens: 450,
  completionTokens: 280,
  totalTokens: 730,
  estimatedCost: '0.0073'
}
```

## Features

### Authentication

All endpoints require JWT authentication:

```typescript
const user = verifyToken(request);
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Rate Limiting

Simple in-memory rate limiter:

- **Limit:** 20 requests per minute per user
- **Window:** 60 seconds

```typescript
if (!checkRateLimit(user.userId, 20, 60000)) {
  return 429; // Too Many Requests
}
```

### Error Handling

Comprehensive error handling for:

- **OpenAI Rate Limits (429):** "Too many requests to AI service..."
- **Invalid API Key (401):** Falls back to template responses
- **Network Errors:** Retries once, then returns error
- **Validation Errors (400):** Empty messages, missing IDs

### Fallback Mode

When OpenAI is not configured (placeholder API key), the system uses Hebrew template questions:

```typescript
const questionTemplates = [
  'שאלה 1 מתוך 6: כיצד היית מתאר/ת את הביצועים האקדמיים...',
  'שאלה 2 מתוך 6: כיצד התלמיד/ה בדרך כלל מתקשר/ת עם השיעורים...',
  // ... 6 questions total
];
```

This allows demo/testing without a real API key.

## Testing

### 1. Integration Test

Run the full conversation flow test:

```bash
cd packages/frontend
./scripts/test-chat-api.sh
```

Expected output:

```
Testing Chat API at http://localhost:4001
================================
1. Logging in...
✓ Logged in successfully
2. Getting students...
✓ Found student ID: abc-123
3. Starting conversation...
✓ Conversation started: xyz-789
4. Sending chat message...
✓ Chat response received
✓ Question count: 1
5. Sending second message...
✓ Second chat response received
✓ Question count: 2

✅ All tests passed!
```

### 2. OpenAI Connectivity Test

Test if OpenAI API key is configured correctly:

```bash
npm run test:openai
```

Expected output with valid key:

```
Testing OpenAI API connection...

✅ SUCCESS!
Response: API connection successful!

API Details:
- Model: gpt-4-turbo-preview
- Tokens used: 42

✅ OpenAI API is configured correctly!
```

### 3. Manual Testing with curl

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"Test123!"}' \
  | jq -r '.accessToken')

# 2. Start conversation
CONV_ID=$(curl -s -X POST http://localhost:4001/api/analysis/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"student-id-here"}' \
  | jq -r '.conversationId')

# 3. Send message
curl -s -X POST http://localhost:4001/api/analysis/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"message\":\"התלמיד מצטיין במתמטיקה\"}" \
  | jq
```

## Performance & Costs

### Token Usage

Average conversation:

- **Questions (6 exchanges):** ~1,200 tokens
- **Final analysis:** ~800 tokens
- **Total per student:** ~2,000 tokens

### Cost Estimates

Using GPT-4 Turbo pricing:

- **Input tokens:** $0.01 per 1K tokens
- **Output tokens:** $0.03 per 1K tokens
- **Average cost per analysis:** ~$0.05-0.10

### Response Times

- **Start conversation:** ~50-200ms (prompt loading)
- **Chat message with OpenAI:** ~2-5 seconds (GPT-4 API call)
- **Chat message with templates:** ~10-50ms (fallback)

## Security Considerations

### 1. API Key Protection

- Never commit `.env` or `.env.local` to git
- Use `.env.example` for templates only
- Rotate API keys regularly in production

### 2. Prompt Injection Prevention

User messages are sanitized and isolated from system prompts:

```typescript
// User input never modifies system prompt
conversation.messages.push({
  role: 'user',
  content: message.trim(), // Sanitized input
});
```

### 3. Rate Limiting

Prevents abuse and manages costs:

- 20 requests per minute per user
- Could be enhanced with Redis in production

### 4. Authentication

All endpoints require valid JWT tokens:

```typescript
const user = verifyToken(request);
```

## Troubleshooting

### Issue: "OpenAI API key not configured"

**Solution:** Add valid API key to `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-YOUR-REAL-KEY-HERE
```

### Issue: "Rate limit exceeded"

**Cause:** OpenAI free tier rate limits or internal rate limiter

**Solution:**

1. Wait 60 seconds for internal rate limit to reset
2. Upgrade OpenAI plan if hitting their limits
3. Reduce request frequency

### Issue: Template responses instead of AI responses

**Cause:** OpenAI API key not configured or invalid

**Solution:**

1. Check API key starts with `sk-proj-` or `sk-`
2. Verify key is valid on OpenAI platform
3. Check `.env.local` is loaded (restart dev server)

### Issue: Conversation not found

**Cause:** Using in-memory store; conversation lost on server restart

**Solution:**

1. Start new conversation after server restart
2. For production: Migrate to database storage

## Migration to Production

### 1. Database Storage

Replace in-memory store with Prisma models:

```prisma
model Conversation {
  id            String   @id @default(uuid())
  studentId     String
  student       Student  @relation(fields: [studentId], references: [id])
  messages      Json     // Store as JSONB
  questionCount Int      @default(0)
  isComplete    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### 2. Redis Rate Limiting

Replace in-memory Map with Redis:

```typescript
import { Redis } from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimit(userId: string) {
  const key = `rate_limit:${userId}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 60);
  }
  return current <= 20;
}
```

### 3. Enhanced Error Monitoring

Add Sentry or similar:

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // ... OpenAI call
} catch (error) {
  Sentry.captureException(error);
  // ... error handling
}
```

### 4. Cost Management

- Implement spending alerts
- Add daily/monthly budget caps
- Monitor token usage per teacher/school
- Consider caching common responses

## Support & Contact

For issues or questions:

1. Check this README
2. Review `/context/student-analysis-prompt.md`
3. Check ticket `/tickets/GE-057-openai-integration-backend.md`
4. Contact development team

---

**Last Updated:** 2025-12-31
**Version:** 1.0.0 (3-Day MVP)
