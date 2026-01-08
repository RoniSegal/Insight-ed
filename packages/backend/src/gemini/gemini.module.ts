import { Module } from '@nestjs/common';

import { GeminiService } from './gemini.service';

/**
 * GeminiModule - NestJS module for Google Gemini API integration
 *
 * This module provides Gemini chat completion services to the application.
 * It encapsulates all Gemini-related logic including:
 * - API client configuration
 * - Error handling and retry logic
 * - Circuit breaker pattern
 * - Token usage tracking
 *
 * Configuration is loaded from environment variables via NestJS ConfigModule:
 * - GEMINI_API_KEY: Your Google Gemini API key (required)
 * - GEMINI_MODEL: Model to use (default: 'gemini-2.5-flash')
 * - GEMINI_MAX_TOKENS: Maximum tokens per request (default: 2000)
 * - GEMINI_TEMPERATURE: Randomness 0.0-2.0 (default: 0.7)
 *
 * @example
 * ```typescript
 * // Import in your feature module
 * @Module({
 *   imports: [GeminiModule],
 *   controllers: [AnalysisController],
 *   providers: [AnalysisService],
 * })
 * export class AnalysisModule {}
 *
 * // Use in your service
 * @Injectable()
 * export class AnalysisService {
 *   constructor(private readonly geminiService: GeminiService) {}
 *
 *   async generateAnalysis(studentName: string) {
 *     const messages = [
 *       { role: 'system', content: 'You are an expert...' },
 *       { role: 'user', content: `Analyze ${studentName}` }
 *     ];
 *     const response = await this.geminiService.chat(messages);
 *     return response.message;
 *   }
 * }
 * ```
 */
@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
