# Gemini Module

NestJS module for Google Gemini API integration.

## Overview

The Gemini Module provides a service wrapper for the Google Gemini API, enabling AI-powered conversations in the Growth Engine application. It handles:

- Chat completions with Gemini models
- Configuration management via environment variables
- Error handling and retry logic with exponential backoff
- Circuit breaker pattern for sustained failures
- Token usage logging for cost tracking

## Configuration

Set the following environment variables:

| Variable             | Description                | Default            |
| -------------------- | -------------------------- | ------------------ |
| `GEMINI_API_KEY`     | Your Google Gemini API key | Required           |
| `GEMINI_MODEL`       | Model to use               | `gemini-2.5-flash` |
| `GEMINI_MAX_TOKENS`  | Maximum tokens per request | `2000`             |
| `GEMINI_TEMPERATURE` | Randomness (0.0-2.0)       | `0.7`              |

### Getting an API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create or select a project
3. Generate an API key
4. Add the key to your `.env` file

## Usage

### Import the Module

```typescript
import { Module } from '@nestjs/common';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  // ...
})
export class YourModule {}
```

### Inject the Service

```typescript
import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini/gemini.service';

@Injectable()
export class YourService {
  constructor(private readonly geminiService: GeminiService) {}

  async generateAnalysis(studentName: string): Promise<string> {
    const messages = [
      { role: 'system', content: 'You are an educational psychologist...' },
      { role: 'user', content: `Analyze ${studentName}` },
    ];

    const response = await this.geminiService.chat(messages);
    return response.message;
  }
}
```

### Chat Interface

```typescript
// Message types
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Options (optional)
interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

// Response
interface ChatResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

### Role Mapping

| Application Role | Gemini API          |
| ---------------- | ------------------- |
| `system`         | `systemInstruction` |
| `user`           | `user`              |
| `assistant`      | `model`             |

## Features

### Retry Logic

Failed requests are automatically retried with exponential backoff:

- Initial delay: 100ms
- Maximum delay: 30 seconds
- Maximum retries: 3

Authentication errors are never retried.

### Circuit Breaker

After 10 consecutive failures, the circuit breaker opens for 60 seconds, preventing further requests. This protects against sustained API outages.

### Token Usage Logging

Every successful request logs token usage:

```
[Nest] 12345 - GeminiService: Gemini API Call - Model: gemini-2.5-flash,
Prompt: 150 tokens, Completion: 80 tokens, Total: 230 tokens,
Estimated Cost: $0.000047
```

## Error Handling

The module provides specific exception types:

| Exception                       | HTTP Status | When                   |
| ------------------------------- | ----------- | ---------------------- |
| `GeminiConfigurationException`  | 500         | API key not configured |
| `GeminiAuthenticationException` | 401         | Invalid API key        |
| `GeminiRateLimitException`      | 429         | Rate limit exceeded    |
| `GeminiServiceException`        | 503         | Service unavailable    |
| `GeminiCircuitBreakerException` | 503         | Circuit breaker open   |
| `GeminiException`               | 500         | Other errors           |

### Example Error Handling

```typescript
import { GeminiException, GeminiRateLimitException } from './gemini/exceptions/gemini.exception';

try {
  const response = await geminiService.chat(messages);
} catch (error) {
  if (error instanceof GeminiRateLimitException) {
    // Wait and retry later
  } else if (error instanceof GeminiException) {
    // Generic Gemini error
  }
}
```

## Supported Models

Recommended models for different use cases:

| Use Case          | Model                   |
| ----------------- | ----------------------- |
| General tasks     | `gemini-2.5-flash`      |
| Complex reasoning | `gemini-2.5-pro`        |
| Low latency       | `gemini-2.5-flash-lite` |

See [Google's documentation](https://ai.google.dev/gemini-api/docs/models) for the full list of available models.

## Testing

Run unit tests:

```bash
cd packages/backend
npm test -- gemini
```

The test suite covers:

- Service initialization
- Configuration validation
- Successful chat requests
- Error handling scenarios
- Retry logic
- Circuit breaker behavior
- Edge cases (Hebrew text, long messages, etc.)

## Migration from OpenAI

If migrating from the previous OpenAI integration:

1. Update environment variables:
   - `OPENAI_API_KEY` → `GEMINI_API_KEY`
   - `OPENAI_MODEL` → `GEMINI_MODEL`
   - `OPENAI_MAX_TOKENS` → `GEMINI_MAX_TOKENS`
   - `OPENAI_TEMPERATURE` → `GEMINI_TEMPERATURE`

2. Update imports:
   - `OpenAIService` → `GeminiService`
   - `OpenAIModule` → `GeminiModule`

3. Exception classes are now prefixed with `Gemini` instead of `OpenAI`.

4. The chat interface (`ChatMessage`, `ChatOptions`, `ChatResponse`) remains the same.
