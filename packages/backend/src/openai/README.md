# OpenAI Service

This module provides integration with OpenAI APIs for the Growth Engine application.

## Current Status (MVP)

For the MVP, the OpenAI service is **configured but not actively used** for the question-asking phase. Questions are loaded directly from template files (`/prompts/templates/questions.txt`) to ensure consistency and Hebrew language accuracy.

## Configuration

Environment variables (`.env` or `.env.local`):

```env
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

## Future Use

In future iterations, the OpenAI service will be used for:

- Generating final analysis reports
- Dynamic follow-up questions
- Personalized recommendations
