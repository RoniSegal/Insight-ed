import { Module } from '@nestjs/common';

import { OpenAIService } from './openai.service';

/**
 * OpenAIModule - NestJS module for OpenAI API integration
 *
 * This module provides OpenAI chat completion services to the application.
 * It encapsulates all OpenAI-related logic including:
 * - API client configuration
 * - Error handling and retry logic
 * - Circuit breaker pattern
 * - Token usage tracking
 *
 * Configuration is loaded from environment variables via NestJS ConfigModule:
 * - OPENAI_API_KEY: Your OpenAI API key (required)
 * - OPENAI_MODEL: Model to use (default: 'gpt-4-turbo-preview')
 * - OPENAI_MAX_TOKENS: Maximum tokens per request (default: 2000)
 * - OPENAI_TEMPERATURE: Randomness 0.0-2.0 (default: 0.7)
 *
 * @example
 * ```typescript
 * // Import in your feature module
 * @Module({
 *   imports: [OpenAIModule],
 *   controllers: [AnalysisController],
 *   providers: [AnalysisService],
 * })
 * export class AnalysisModule {}
 *
 * // Use in your service
 * @Injectable()
 * export class AnalysisService {
 *   constructor(private readonly openaiService: OpenAIService) {}
 *
 *   async generateAnalysis(studentName: string) {
 *     const messages = [
 *       { role: 'system', content: 'You are an expert...' },
 *       { role: 'user', content: `Analyze ${studentName}` }
 *     ];
 *     const response = await this.openaiService.chat(messages);
 *     return response.message;
 *   }
 * }
 * ```
 */
@Module({
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
