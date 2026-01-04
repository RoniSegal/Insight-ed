import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import {
  OpenAIAuthenticationException,
  OpenAICircuitBreakerException,
  OpenAIConfigurationException,
  OpenAIException,
  OpenAIRateLimitException,
  OpenAIServiceException,
} from './exceptions/openai.exception';
import { ChatMessage, ChatOptions, ChatResponse } from './interfaces/chat.interface';

/**
 * OpenAIService - NestJS service for OpenAI API integration
 *
 * This service handles all interactions with the OpenAI API, including:
 * - Chat completions with GPT models
 * - Configuration management via environment variables
 * - Error handling and retry logic with exponential backoff
 * - Circuit breaker pattern for sustained failures
 * - Token usage logging for cost tracking
 *
 * @example
 * ```typescript
 * const messages = [
 *   { role: 'system', content: 'You are an educational psychologist' },
 *   { role: 'user', content: 'How can I help this student?' }
 * ];
 *
 * const response = await openaiService.chat(messages);
 * console.log(response.message);
 * ```
 */
@Injectable()
export class OpenAIService implements OnModuleInit {
  private readonly logger = new Logger(OpenAIService.name);
  private openaiClient: OpenAI | null = null;

  // Configuration
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly temperature: number;

  // Retry configuration
  private readonly maxRetries = 3;
  private readonly initialRetryDelay = 100; // ms
  private readonly maxRetryDelay = 30000; // ms

  // Circuit breaker configuration
  private circuitBreakerFailures = 0;
  private readonly circuitBreakerThreshold = 10;
  private readonly circuitBreakerResetTime = 60000; // 1 minute
  private circuitBreakerOpenUntil: number | null = null;

  constructor(private readonly configService: ConfigService) {
    // Load configuration from environment variables
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY', '');
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4-turbo-preview');
    this.maxTokens = this.configService.get<number>('OPENAI_MAX_TOKENS', 2000);
    this.temperature = this.configService.get<number>('OPENAI_TEMPERATURE', 0.7);
  }

  /**
   * Initialize the service and validate configuration
   */
  async onModuleInit() {
    this.validateConfiguration();
    this.logger.log('OpenAI Service initialized successfully');
  }

  /**
   * Send a chat completion request to OpenAI API
   *
   * @param messages - Array of chat messages (system, user, assistant)
   * @param options - Optional overrides for model, temperature, maxTokens
   * @returns ChatResponse with generated message and usage statistics
   * @throws OpenAIConfigurationException if API key is not configured
   * @throws OpenAIAuthenticationException if API key is invalid (401)
   * @throws OpenAIRateLimitException if rate limit is exceeded (429)
   * @throws OpenAIServiceException if OpenAI service returns server error (500)
   * @throws OpenAICircuitBreakerException if circuit breaker is open
   * @throws OpenAIException for other OpenAI errors
   *
   * @example
   * ```typescript
   * const response = await openaiService.chat([
   *   { role: 'system', content: 'You are helpful' },
   *   { role: 'user', content: 'Hello!' }
   * ]);
   * ```
   */
  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    // Check circuit breaker
    this.checkCircuitBreaker();

    // Validate configuration before making request
    if (!this.isConfigured()) {
      throw new OpenAIConfigurationException('OpenAI API key not configured');
    }

    // Execute request with retry logic
    return this.executeWithRetry(() => this.executeChatRequest(messages, options));
  }

  /**
   * Execute chat request with actual OpenAI API call
   * @private
   */
  private async executeChatRequest(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    try {
      const client = this.getClient();

      const completion = await client.chat.completions.create({
        model: options?.model || this.model,
        messages: messages,
        max_tokens: options?.maxTokens || this.maxTokens,
        temperature: options?.temperature ?? this.temperature,
      });

      const message = completion.choices[0]?.message?.content;

      if (!message) {
        throw new OpenAIException('No response from OpenAI');
      }

      // Log token usage for cost tracking
      const usage = completion.usage;
      if (usage) {
        this.logTokenUsage(completion.model, usage.prompt_tokens, usage.completion_tokens);
      }

      // Reset circuit breaker on success
      this.resetCircuitBreaker();

      return {
        message,
        usage: usage
          ? {
              promptTokens: usage.prompt_tokens,
              completionTokens: usage.completion_tokens,
              totalTokens: usage.total_tokens,
            }
          : undefined,
      };
    } catch (error: any) {
      // Record failure for circuit breaker
      this.recordFailure();

      // Handle OpenAI-specific errors
      this.handleOpenAIError(error);

      // This line should never be reached due to handleOpenAIError always throwing
      throw new OpenAIException(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Execute a function with exponential backoff retry logic
   * @private
   */
  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Don't retry on authentication errors, configuration errors, or circuit breaker
        if (
          error instanceof OpenAIAuthenticationException ||
          error instanceof OpenAIConfigurationException ||
          error instanceof OpenAICircuitBreakerException
        ) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === this.maxRetries) {
          break;
        }

        // Calculate exponential backoff delay
        const delay = Math.min(
          this.initialRetryDelay * Math.pow(2, attempt),
          this.maxRetryDelay
        );

        this.logger.warn(
          `OpenAI request failed (attempt ${attempt + 1}/${this.maxRetries + 1}). Retrying in ${delay}ms...`
        );

        // Wait before retrying
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    throw lastError;
  }

  /**
   * Handle OpenAI-specific errors and throw appropriate exceptions
   * @private
   */
  private handleOpenAIError(error: any): never {
    const status = error.status || error.response?.status;
    const message = error.message || 'Unknown OpenAI error';

    if (status === 401) {
      throw new OpenAIAuthenticationException('Invalid OpenAI API key configuration');
    } else if (status === 429) {
      throw new OpenAIRateLimitException('Rate limit exceeded. Please try again in a moment.');
    } else if (status === 500 || status === 502 || status === 503) {
      throw new OpenAIServiceException('OpenAI service error. Please try again.');
    }

    throw new OpenAIException(`OpenAI API error: ${message}`);
  }

  /**
   * Check if OpenAI API is configured with a valid API key
   */
  isConfigured(): boolean {
    // Check if API key exists and starts with 'sk-'
    if (!this.apiKey || !this.apiKey.startsWith('sk-')) {
      return false;
    }

    // Exclude placeholder keys
    const placeholderPatterns = /placeholder|replace|here|your-|example|test-key/i;
    if (placeholderPatterns.test(this.apiKey)) {
      return false;
    }

    // Check if key has reasonable length (real OpenAI keys are ~50+ characters)
    if (this.apiKey.length < 40) {
      return false;
    }

    return true;
  }

  /**
   * Validate configuration on service initialization
   * @private
   */
  private validateConfiguration(): void {
    if (!this.isConfigured()) {
      this.logger.warn(
        'OpenAI API key is not configured or is a placeholder. ' +
          'Please set OPENAI_API_KEY environment variable with a valid API key.'
      );
    } else {
      this.logger.log(
        `OpenAI configured with model: ${this.model}, max_tokens: ${this.maxTokens}, temperature: ${this.temperature}`
      );
    }
  }

  /**
   * Get or create OpenAI client instance (lazy initialization)
   * @private
   */
  private getClient(): OpenAI {
    if (!this.openaiClient) {
      this.openaiClient = new OpenAI({
        apiKey: this.apiKey,
      });
    }
    return this.openaiClient;
  }

  /**
   * Log token usage for cost tracking and monitoring
   * @private
   */
  private logTokenUsage(model: string, promptTokens: number, completionTokens: number): void {
    const totalTokens = promptTokens + completionTokens;

    // Rough cost estimate (rates as of 2024, subject to change)
    // GPT-4 Turbo: $0.01/1K prompt tokens, $0.03/1K completion tokens
    const estimatedCost = (promptTokens * 0.00001 + completionTokens * 0.00003).toFixed(4);

    this.logger.log(
      `OpenAI API Call - Model: ${model}, Prompt: ${promptTokens} tokens, ` +
        `Completion: ${completionTokens} tokens, Total: ${totalTokens} tokens, ` +
        `Estimated Cost: $${estimatedCost}`
    );
  }

  /**
   * Check circuit breaker state and throw exception if open
   * @private
   */
  private checkCircuitBreaker(): void {
    if (this.circuitBreakerOpenUntil !== null) {
      const now = Date.now();

      if (now < this.circuitBreakerOpenUntil) {
        // Circuit breaker is still open
        const remainingTime = Math.ceil((this.circuitBreakerOpenUntil - now) / 1000);
        throw new OpenAICircuitBreakerException(
          `OpenAI service is temporarily unavailable due to repeated failures. ` +
            `Please try again in ${remainingTime} seconds.`
        );
      } else {
        // Circuit breaker timeout expired, reset it
        this.logger.log('Circuit breaker timeout expired, resetting...');
        this.circuitBreakerOpenUntil = null;
        this.circuitBreakerFailures = 0;
      }
    }
  }

  /**
   * Record a failure and potentially open the circuit breaker
   * @private
   */
  private recordFailure(): void {
    this.circuitBreakerFailures++;

    if (this.circuitBreakerFailures >= this.circuitBreakerThreshold) {
      this.circuitBreakerOpenUntil = Date.now() + this.circuitBreakerResetTime;
      this.logger.error(
        `Circuit breaker opened after ${this.circuitBreakerFailures} consecutive failures. ` +
          `Will reset in ${this.circuitBreakerResetTime / 1000} seconds.`
      );
    }
  }

  /**
   * Reset circuit breaker on successful request
   * @private
   */
  private resetCircuitBreaker(): void {
    if (this.circuitBreakerFailures > 0) {
      this.logger.log(`OpenAI request succeeded, resetting circuit breaker failure count`);
      this.circuitBreakerFailures = 0;
    }
  }

  /**
   * Sleep utility for retry delays
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
