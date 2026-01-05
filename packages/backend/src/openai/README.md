# OpenAI Module

NestJS module for OpenAI API integration, providing chat completion services with robust error handling, retry logic, and circuit breaker pattern.

## Features

- **Chat Completions**: Full support for OpenAI chat completions API (GPT-4, GPT-3.5)
- **Error Handling**: Comprehensive error handling with custom exceptions
- **Retry Logic**: Exponential backoff retry for transient failures
- **Circuit Breaker**: Prevents cascading failures with automatic recovery
- **Token Tracking**: Automatic logging of token usage for cost monitoring
- **Type Safety**: Full TypeScript support with well-defined interfaces
- **Configuration**: Environment-based configuration via NestJS ConfigModule

## Installation

The OpenAI SDK is already installed as a dependency. No additional installation required.

## Configuration

Configure the service via environment variables:

```bash
# Required
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional (with defaults)
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

**Important**: The service validates that `OPENAI_API_KEY`:

- Starts with `sk-`
- Is at least 40 characters long
- Does not contain placeholder text (e.g., "placeholder", "replace", "your-key")

## Usage

### Basic Usage

```typescript
import { Injectable } from '@nestjs/common';
import { OpenAIService } from './openai/openai.service';
import { ChatMessage } from './openai/interfaces/chat.interface';

@Injectable()
export class AnalysisService {
  constructor(private readonly openaiService: OpenAIService) {}

  async generateStudentAnalysis(studentName: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert educational psychologist.',
      },
      {
        role: 'user',
        content: `Analyze the learning profile for ${studentName}`,
      },
    ];

    const response = await this.openaiService.chat(messages);
    return response.message;
  }
}
```

### Advanced Usage with Options

```typescript
const response = await this.openaiService.chat(messages, {
  model: 'gpt-3.5-turbo', // Override default model
  maxTokens: 1000, // Override max tokens
  temperature: 0.5, // More deterministic responses
});

console.log(response.message);
console.log(response.usage?.totalTokens); // Token usage for cost tracking
```

### Multi-turn Conversations

```typescript
const conversationMessages: ChatMessage[] = [
  { role: 'system', content: 'You are helpful' },
  { role: 'user', content: 'What is 2+2?' },
  { role: 'assistant', content: '2+2 equals 4.' },
  { role: 'user', content: 'What about 3+3?' },
];

const response = await this.openaiService.chat(conversationMessages);
```

## Importing the Module

```typescript
import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [OpenAIModule],
  // your controllers and providers
})
export class AnalysisModule {}
```

## Interfaces

### ChatMessage

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

### ChatOptions

```typescript
interface ChatOptions {
  maxTokens?: number; // Override default max tokens
  temperature?: number; // 0.0 to 2.0 (default: 0.7)
  model?: string; // Override default model
}
```

### ChatResponse

```typescript
interface ChatResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

## Error Handling

The service throws specific exceptions for different error scenarios:

### Exception Types

| Exception                       | HTTP Status | When Thrown                                    |
| ------------------------------- | ----------- | ---------------------------------------------- |
| `OpenAIConfigurationException`  | 500         | API key not configured or invalid format       |
| `OpenAIAuthenticationException` | 401         | Invalid API key                                |
| `OpenAIRateLimitException`      | 429         | Rate limit exceeded                            |
| `OpenAIServiceException`        | 503         | OpenAI service error (500, 502, 503)           |
| `OpenAICircuitBreakerException` | 503         | Circuit breaker open due to sustained failures |
| `OpenAIException`               | 500         | Other OpenAI errors                            |

### Error Handling Example

```typescript
import {
  OpenAIRateLimitException,
  OpenAIServiceException,
} from './openai/exceptions/openai.exception';

try {
  const response = await this.openaiService.chat(messages);
  return response.message;
} catch (error) {
  if (error instanceof OpenAIRateLimitException) {
    // Handle rate limit - maybe queue for later
    console.log('Rate limited, trying again in 60s');
  } else if (error instanceof OpenAIServiceException) {
    // OpenAI is down - use fallback
    console.log('OpenAI unavailable, using cached response');
  } else {
    // Other error
    throw error;
  }
}
```

## Retry Logic

The service automatically retries failed requests with exponential backoff:

- **Max retries**: 3
- **Initial delay**: 100ms
- **Max delay**: 30s
- **Backoff strategy**: Exponential (100ms, 200ms, 400ms, ...)

**Retries are NOT attempted for**:

- Authentication errors (401)
- Configuration errors
- Circuit breaker open errors

## Circuit Breaker

Protects the system from cascading failures when OpenAI is experiencing issues:

- **Threshold**: Opens after 10 consecutive failures
- **Reset time**: 60 seconds
- **Behavior**: Rejects all requests immediately while open

When the circuit breaker is open, requests fail immediately with `OpenAICircuitBreakerException` instead of waiting for timeouts.

## Token Usage Logging

The service automatically logs token usage for cost tracking:

```
OpenAI API Call - Model: gpt-4-turbo-preview, Prompt: 150 tokens,
Completion: 300 tokens, Total: 450 tokens, Estimated Cost: $0.0105
```

**Note**: Cost estimates are approximate and based on GPT-4 Turbo pricing as of 2024.

## Testing

The module includes comprehensive unit tests. Run them with:

```bash
npm test openai.service.spec.ts
```

Test coverage includes:

- Configuration validation
- Successful chat completions
- All error scenarios (401, 429, 500, 502, 503)
- Retry logic with exponential backoff
- Circuit breaker behavior
- Token usage logging
- Edge cases (Hebrew characters, empty messages, etc.)

## Best Practices

1. **Always check `isConfigured()`** before using the service in production
2. **Handle rate limits gracefully** - implement queuing for non-urgent requests
3. **Monitor token usage** - set up alerts for unexpected cost spikes
4. **Use appropriate models** - GPT-3.5 for simple tasks, GPT-4 for complex analysis
5. **Set reasonable temperature** - Lower (0.0-0.3) for deterministic, higher (0.7-1.0) for creative
6. **Implement fallbacks** - Have a plan B when OpenAI is unavailable

## Architecture Notes

This service follows the architectural decision to move OpenAI integration from the Next.js frontend to the NestJS backend:

- **Security**: API keys are server-side only
- **Control**: Centralized rate limiting and cost tracking
- **Reliability**: Circuit breaker and retry logic protect the system
- **Observability**: All API calls are logged for monitoring

## Cost Optimization Tips

1. **Use prompt caching** - For repeated system prompts
2. **Limit max_tokens** - Set conservative limits per use case
3. **Choose appropriate models** - GPT-3.5 is 10x cheaper than GPT-4
4. **Batch requests** - Combine multiple questions when possible
5. **Monitor usage** - Set up alerts for daily spend thresholds

## Support

For issues or questions, see:

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Architecture Document](/docs/ARCHITECTURE.md)
- Project ticket: GE-071
