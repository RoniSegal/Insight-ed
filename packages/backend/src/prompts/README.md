# Prompts Module

This module provides prompt management services for the student analysis system. It encapsulates all AI prompt logic used in ChatGPT-based student learning profile analysis.

## Overview

The Prompts module manages three types of prompts:

1. **System Prompt**: Defines the AI's role as an educational psychologist and establishes the conversation context
2. **Question Templates**: 6 Hebrew questions used to gather information about each student
3. **Analysis Prompt**: Instructions for generating the final comprehensive analysis report

## Architecture

### Phase 1 (Current): Hardcoded Prompts
- Prompts are stored as constants in the service
- Quick deployment with no database dependencies
- Easy to version control and review
- Variable substitution support (e.g., `{studentName}`)

### Phase 2 (Future): Database-Backed Prompts
- Store prompts in PostgreSQL via Prisma
- Support versioning and A/B testing
- Enable runtime prompt updates
- Track usage analytics per prompt version

## Usage

### Basic Usage

```typescript
import { PromptsService } from './prompts/prompts.service';

@Injectable()
export class AnalysisService {
  constructor(private readonly promptsService: PromptsService) {}

  async analyzeStudent(studentName: string) {
    // 1. Get system prompt with student name
    const systemPrompt = this.promptsService.getSystemPrompt(studentName);

    // 2. Get questions to ask
    const questions = this.promptsService.getQuestionTemplates();

    // 3. Ask questions and collect responses...

    // 4. Get analysis prompt for final synthesis
    const analysisPrompt = this.promptsService.getAnalysisPrompt();

    // 5. Send to ChatGPT for final analysis...
  }
}
```

### Module Import

```typescript
import { Module } from '@nestjs/common';
import { PromptsModule } from './prompts/prompts.module';

@Module({
  imports: [PromptsModule],
  // PromptsService is now available for injection
})
export class AnalysisModule {}
```

## API Reference

### `getSystemPrompt(studentName: string): string`

Returns the system prompt with the student's name interpolated.

**Parameters:**
- `studentName`: The name of the student being analyzed

**Returns:** System prompt string defining the AI's role and process

**Example:**
```typescript
const prompt = promptsService.getSystemPrompt('דוד כהן');
```

### `getQuestionTemplates(): string[]`

Returns an array of 6 Hebrew question templates.

**Returns:** Array of question strings to ask about the student

**Example:**
```typescript
const questions = promptsService.getQuestionTemplates();
// Returns: ['מה הביצועים האקדמיים...', ...]
```

### `getAnalysisPrompt(): string`

Returns the analysis prompt template for final report generation.

**Returns:** Hebrew prompt string with structured analysis requirements

**Example:**
```typescript
const analysisPrompt = promptsService.getAnalysisPrompt();
```

## Prompt Structure

### System Prompt
- Defines role as educational psychologist
- Specifies 6-question process
- Outlines analysis structure
- Sets empathetic, strengths-first tone
- Requires Hebrew output

### Question Templates (6 questions)
1. Academic performance and subject strengths/weaknesses
2. Learning style and class engagement
3. Homework habits and behavior
4. Social interactions and emotional patterns
5. Main learning challenges and recent progress
6. Unique strengths and additional observations

### Analysis Prompt
Structured output with:
- 📊 Summary (2-3 sentences)
- 💪 Strengths (academic + behavioral/social)
- 🎯 Areas for improvement (academic + behavioral/emotional)
- 📈 Action plan (immediate + long-term)
- 🎓 Classroom adaptations (seating, teaching style, materials)
- 💡 Success metrics and follow-up timeline

## Testing

Run unit tests:
```bash
npm test -- prompts.service.spec.ts
```

Check coverage (currently 100%):
```bash
npm test -- prompts.service.spec.ts --coverage
```

## Migration Notes

### From File-Based to Service-Based

**Before (Frontend file loading):**
```typescript
// Old approach in frontend/src/app/api/lib/openai.ts
const promptPath = path.join(process.cwd(), 'context', 'chat-prompt-simple.txt');
const systemPrompt = fs.readFileSync(promptPath, 'utf-8');
```

**After (Backend service):**
```typescript
// New approach
const systemPrompt = promptsService.getSystemPrompt(studentName);
```

**Benefits:**
- ✅ Centralized prompt management
- ✅ Type-safe API
- ✅ Easy to test and mock
- ✅ Supports variable substitution
- ✅ No file system dependencies
- ✅ Ready for database migration

### Original Prompt Reference

The original prompt file (`/context/chat-prompt-simple.txt`) is preserved as reference during migration. All prompt content has been accurately transferred to the service with:
- ✅ Exact Hebrew phrasing maintained
- ✅ All emojis preserved
- ✅ Same structure and tone
- ✅ Complete process definition

## Future Enhancements (Phase 2)

- [ ] Database schema for prompt versioning
- [ ] Prisma models for `Prompt`, `PromptVersion`
- [ ] A/B testing support
- [ ] Usage analytics
- [ ] Admin UI for prompt editing
- [ ] Rollback to previous versions
- [ ] Prompt effectiveness tracking

## Contributing

When modifying prompts:

1. **Preserve the tone**: Empathetic, strengths-first, growth-oriented
2. **Maintain Hebrew quality**: Review with native speaker
3. **Update tests**: Add tests for any new functionality
4. **Document changes**: Update this README
5. **Consider impact**: Prompt changes affect all analyses

## Related Files

- **Service**: `prompts.service.ts`
- **Module**: `prompts.module.ts`
- **Tests**: `__tests__/prompts/prompts.service.spec.ts`
- **Original Prompt**: `/context/chat-prompt-simple.txt` (reference)
- **Architecture Proposal**: `/docs/ARCHITECTURE_PROPOSAL_PROMPT_MANAGEMENT.md`

## License

Part of the Growth Engine education platform.
