# Architecture Proposal: Backend Prompt Management

## Overview

Move prompt management from file-based to backend-managed system with proper separation between system prompts and conversation messages.

## Current State

- System prompt loaded from `/context/chat-prompt-simple.txt`
- File read at runtime in API routes
- No versioning or prompt management

## Proposed Architecture

### 1. Prompt Service Layer

**Location:** `/packages/backend/src/modules/prompts/prompts.service.ts`

**Responsibilities:**

- Store and manage system prompts
- Provide prompt templates
- Support prompt versioning
- Enable A/B testing of different prompts

```typescript
export class PromptsService {
  // System prompt for student analysis
  getSystemPrompt(studentName: string): string {
    return `You are an expert educational psychologist specializing in K-12 students.
Your task is to conduct a comprehensive analysis of ${studentName}'s academic and behavioral strengths and areas for growth.

CONVERSATION FLOW:
1. Ask questions one at a time, waiting for responses
2. Ask 6 core questions covering different aspects
3. After all questions, provide comprehensive analysis

OUTPUT FORMAT:
- Hebrew language only
- Professional tone
- Strengths-first approach
- Actionable recommendations

... (full prompt content)`;
  }

  // Question templates for structured conversation
  getQuestionTemplates(): string[] {
    return [
      'שאלה 1 מתוך 6: כיצד היית מתאר/ת את הביצועים האקדמיים של {studentName}?',
      'שאלה 2 מתוך 6: כיצד {studentName} מתקשר/ת עם החומר הלימודי?',
      'שאלה 3 מתוך 6: תאר/י את ההתנהגות החברתית של {studentName} בכיתה.',
      'שאלה 4 מתוך 6: מהן נקודות החוזק הבולטות של {studentName}?',
      'שאלה 5 מתוך 6: באילו תחומים {studentName} זקוק/ה לתמיכה נוספת?',
      'שאלה 6 מתוך 6: האם יש משהו נוסף שחשוב לציין לגבי {studentName}?',
    ];
  }

  // Analysis prompt template
  getAnalysisPrompt(): string {
    return `Based on the conversation above, provide a comprehensive analysis in Hebrew with the following sections:

📊 **ניתוח מקיף של {studentName}**

🎯 **נקודות חוזק מרכזיות**
...

⚠️ **תחומים הדורשים תשומת לב**
...

💡 **המלצות לפעולה**
...

... (full template)`;
  }
}
```

### 2. Message Management

**Location:** `/packages/backend/src/modules/analysis/analysis.service.ts`

**Responsibilities:**

- Construct OpenAI message arrays
- Separate system vs user/assistant messages
- Manage conversation history

```typescript
export class AnalysisService {
  constructor(
    private promptsService: PromptsService,
    private openaiService: OpenAIService
  ) {}

  async startConversation(studentName: string): Promise<ConversationResponse> {
    // Get system prompt from service (not file)
    const systemPrompt = this.promptsService.getSystemPrompt(studentName);

    // Structure messages properly
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `התחל את השיחה עם המורה של ${studentName}`,
      },
    ];

    // Call OpenAI
    const response = await this.openaiService.chat({ messages });

    // Store conversation with proper structure
    return {
      conversationId: uuid(),
      studentName,
      systemPrompt, // Store for reference
      messages: [
        ...messages,
        {
          role: 'assistant',
          content: response.content,
        },
      ],
      questionCount: 1,
    };
  }

  async continueConversation(
    conversationId: string,
    teacherMessage: string
  ): Promise<ConversationResponse> {
    // Retrieve conversation state
    const conversation = await this.getConversation(conversationId);

    // Add teacher message
    conversation.messages.push({
      role: 'user',
      content: teacherMessage,
    });

    // Get next response
    const response = await this.openaiService.chat({
      messages: conversation.messages,
    });

    // Update conversation
    conversation.messages.push({
      role: 'assistant',
      content: response.content,
    });
    conversation.questionCount++;

    return conversation;
  }

  async completeAnalysis(conversationId: string): Promise<AnalysisResult> {
    const conversation = await this.getConversation(conversationId);

    // Add analysis request to messages
    const analysisPrompt = this.promptsService
      .getAnalysisPrompt()
      .replace('{studentName}', conversation.studentName);

    conversation.messages.push({
      role: 'user',
      content: analysisPrompt,
    });

    // Get final analysis
    const response = await this.openaiService.chat({
      messages: conversation.messages,
      temperature: 0.5, // Lower for more consistent analysis
    });

    // Save analysis
    return this.saveAnalysis({
      studentId: conversation.studentId,
      conversationId,
      content: response.content,
      metadata: {
        questionCount: conversation.questionCount,
        tokensUsed: response.tokensUsed,
      },
    });
  }
}
```

### 3. Database Schema for Prompt Versioning

**Location:** `/packages/backend/prisma/schema.prisma`

```prisma
model Prompt {
  id          String   @id @default(cuid())
  type        PromptType
  version     Int      @default(1)
  content     String   @db.Text
  language    String   @default("he") // Hebrew
  isActive    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?

  // Metadata for A/B testing
  metadata    Json?

  @@unique([type, version])
  @@index([type, isActive])
}

enum PromptType {
  SYSTEM_ANALYSIS      // Main system prompt
  QUESTION_TEMPLATE    // Question templates
  ANALYSIS_TEMPLATE    // Final analysis template
}

model Conversation {
  id            String   @id @default(cuid())
  studentId     String
  teacherId     String
  student       Student  @relation(fields: [studentId], references: [id])
  teacher       User     @relation(fields: [teacherId], references: [id])

  // Store which prompt version was used
  systemPromptId   String?
  systemPrompt     Prompt?   @relation(fields: [systemPromptId], references: [id])

  // Message history as JSON
  messages      Json     // Array of {role, content, timestamp}

  questionCount Int      @default(0)
  isComplete    Boolean  @default(false)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  analysis      Analysis?

  @@index([studentId])
  @@index([teacherId])
}
```

### 4. OpenAI Service (Unchanged Core)

**Location:** `/packages/backend/src/modules/openai/openai.service.ts`

```typescript
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(options: {
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatResponse> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: options.messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
    });

    return {
      content: completion.choices[0].message.content,
      tokensUsed: completion.usage?.total_tokens || 0,
    };
  }
}
```

## Message Structure

### System Prompt (Sent Once at Start)

```typescript
{
  role: 'system',
  content: 'You are an expert educational psychologist... [full instructions]'
}
```

### Conversation Messages

```typescript
// Teacher's first implicit message
{
  role: 'user',
  content: 'התחל את השיחה עם המורה של [student name]'
}

// AI's first question
{
  role: 'assistant',
  content: 'שאלה 1 מתוך 6: כיצד היית מתאר/ת את הביצועים...'
}

// Teacher's response
{
  role: 'user',
  content: '[teacher's actual response]'
}

// AI's next question
{
  role: 'assistant',
  content: 'שאלה 2 מתוך 6: כיצד התלמיד/ה...'
}

// ... continues until 6 questions

// Final analysis request
{
  role: 'user',
  content: 'Based on the conversation above, provide comprehensive analysis...'
}

// Final analysis
{
  role: 'assistant',
  content: '📊 **ניתוח מקיף של [student]**...'
}
```

## Benefits

### 1. **Separation of Concerns**

- ✓ System prompt stored in code/database (not files)
- ✓ Clear separation: system instructions vs conversation messages
- ✓ Prompt management is a dedicated service

### 2. **Production Ready**

- ✓ No file system dependencies
- ✓ Works in containerized environments
- ✓ Works with serverless deployments

### 3. **Versioning & A/B Testing**

- ✓ Track which prompt version was used for each conversation
- ✓ Test different prompt variations
- ✓ Rollback to previous versions if needed

### 4. **Flexibility**

- ✓ Update prompts without code deployment
- ✓ Different prompts for different student types/ages
- ✓ Multi-language support ready

### 5. **Auditability**

- ✓ Know exactly what prompt was used for each analysis
- ✓ Track prompt performance over time
- ✓ Compliance with educational standards

## Migration Path

### Phase 1: Move to Service Layer (Immediate)

1. Create `PromptsService` with hardcoded prompts
2. Update `AnalysisService` to use it
3. Remove file-based prompt loading
4. Test thoroughly

### Phase 2: Add Database Storage (Week 2)

1. Add `Prompt` model to Prisma schema
2. Seed database with current prompts
3. Update `PromptsService` to read from DB
4. Add prompt management UI for admins

### Phase 3: Advanced Features (Future)

1. Prompt versioning and history
2. A/B testing framework
3. Multi-language support
4. Role-based prompt customization (elementary vs high school)

## File Structure

```
packages/backend/
├── src/
│   ├── modules/
│   │   ├── prompts/
│   │   │   ├── prompts.module.ts
│   │   │   ├── prompts.service.ts
│   │   │   ├── prompts.controller.ts  (admin only)
│   │   │   └── dto/
│   │   │       ├── create-prompt.dto.ts
│   │   │       └── update-prompt.dto.ts
│   │   ├── analysis/
│   │   │   ├── analysis.module.ts
│   │   │   ├── analysis.service.ts   (uses PromptsService)
│   │   │   └── analysis.controller.ts
│   │   └── openai/
│   │       ├── openai.module.ts
│   │       └── openai.service.ts     (generic chat wrapper)
│   └── prisma/
│       └── schema.prisma
└── test/
    └── prompts/
        └── prompts.service.spec.ts
```

## Example Usage

```typescript
// In controller
@Post('start')
async startAnalysis(@Body() dto: StartAnalysisDto) {
  return this.analysisService.startConversation(dto.studentName);
}

@Post('chat')
async continueChat(@Body() dto: ChatDto) {
  return this.analysisService.continueConversation(
    dto.conversationId,
    dto.message
  );
}

@Post('complete')
async completeAnalysis(@Body() dto: CompleteDto) {
  return this.analysisService.completeAnalysis(dto.conversationId);
}
```

## Testing

```typescript
describe('PromptsService', () => {
  it('should return system prompt with student name', () => {
    const prompt = service.getSystemPrompt('יוסי');
    expect(prompt).toContain('יוסי');
  });

  it('should return 6 question templates', () => {
    const questions = service.getQuestionTemplates();
    expect(questions).toHaveLength(6);
  });
});

describe('AnalysisService', () => {
  it('should start conversation with system prompt', async () => {
    const result = await service.startConversation('שרה');
    expect(result.messages[0].role).toBe('system');
    expect(result.messages[0].content).toContain('educational psychologist');
  });
});
```

## Conclusion

This architecture:

- ✓ Moves prompt from file to backend code/database
- ✓ Properly separates system prompt from messages
- ✓ Production-ready and scalable
- ✓ Enables versioning and A/B testing
- ✓ Maintains clean separation of concerns
