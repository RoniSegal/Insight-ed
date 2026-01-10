import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  GeminiAuthenticationException,
  GeminiCircuitBreakerException,
  GeminiConfigurationException,
  GeminiException,
  GeminiRateLimitException,
  GeminiServiceException,
} from './exceptions/gemini.exception';
import { ChatMessage, ChatOptions, ChatResponse } from './interfaces/chat.interface';

/**
 * GeminiService - NestJS service for Google Gemini API integration
 *
 * This service handles all interactions with the Google Gemini API, including:
 * - Chat completions with Gemini models
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
 * const response = await geminiService.chat(messages);
 * console.log(response.message);
 * ```
 */
@Injectable()
export class GeminiService implements OnModuleInit {
  private readonly logger = new Logger(GeminiService.name);
  private geminiClient: GoogleGenAI | null = null;

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
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY', '');
    this.model = this.configService.get<string>('GEMINI_MODEL', 'gemini-2.5-flash');
    this.maxTokens = this.configService.get<number>('GEMINI_MAX_TOKENS', 2000);
    this.temperature = this.configService.get<number>('GEMINI_TEMPERATURE', 0.7);
  }

  /**
   * Initialize the service and validate configuration
   */
  onModuleInit() {
    this.validateConfiguration();
    this.logger.log('Gemini Service initialized successfully');
  }

  /**
   * Send a chat completion request to Gemini API
   *
   * @param messages - Array of chat messages (system, user, assistant)
   * @param options - Optional overrides for model, temperature, maxTokens
   * @returns ChatResponse with generated message and usage statistics
   * @throws GeminiConfigurationException if API key is not configured
   * @throws GeminiAuthenticationException if API key is invalid (401)
   * @throws GeminiRateLimitException if rate limit is exceeded (429)
   * @throws GeminiServiceException if Gemini service returns server error (500)
   * @throws GeminiCircuitBreakerException if circuit breaker is open
   * @throws GeminiException for other Gemini errors
   *
   * @example
   * ```typescript
   * const response = await geminiService.chat([
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
      throw new GeminiConfigurationException('Gemini API key not configured');
    }

    // Execute request with retry logic
    return this.executeWithRetry(() => this.executeChatRequest(messages, options));
  }

  /**
   * Execute chat request with actual Gemini API call
   * @private
   */
  private async executeChatRequest(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    try {
      const client = this.getClient();
      const modelName = options?.model || this.model;

      // Extract system instruction from messages
      const systemMessage = messages.find((m) => m.role === 'system');
      const conversationMessages = messages.filter((m) => m.role !== 'system');

      // Convert messages to Gemini format
      const geminiContents = conversationMessages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Build the request
      const response = await client.models.generateContent({
        model: modelName,
        contents: geminiContents,
        config: {
          maxOutputTokens: options?.maxTokens || this.maxTokens,
          temperature: options?.temperature ?? this.temperature,
          systemInstruction: systemMessage?.content,
        },
      });

      const message = response.text;

      if (!message) {
        throw new GeminiException('No response from Gemini');
      }

      // Log token usage for cost tracking
      const usageMetadata = response.usageMetadata;
      if (usageMetadata) {
        this.logTokenUsage(
          modelName,
          usageMetadata.promptTokenCount || 0,
          usageMetadata.candidatesTokenCount || 0
        );
      }

      // Reset circuit breaker on success
      this.resetCircuitBreaker();

      return {
        message,
        usage: usageMetadata
          ? {
              promptTokens: usageMetadata.promptTokenCount || 0,
              completionTokens: usageMetadata.candidatesTokenCount || 0,
              totalTokens: usageMetadata.totalTokenCount || 0,
            }
          : undefined,
      };
    } catch (error: unknown) {
      // Record failure for circuit breaker
      this.recordFailure();

      // Handle Gemini-specific errors
      this.handleGeminiError(error);
    }
  }

  /**
   * Execute a function with exponential backoff retry logic
   * @private
   */
  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: unknown) {
        lastError = error;

        // Don't retry on authentication errors, configuration errors, or circuit breaker
        if (
          error instanceof GeminiAuthenticationException ||
          error instanceof GeminiConfigurationException ||
          error instanceof GeminiCircuitBreakerException
        ) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === this.maxRetries) {
          break;
        }

        // Calculate exponential backoff delay
        const delay = Math.min(this.initialRetryDelay * Math.pow(2, attempt), this.maxRetryDelay);

        this.logger.warn(
          `Gemini request failed (attempt ${attempt + 1}/${this.maxRetries + 1}). Retrying in ${delay}ms...`
        );

        // Wait before retrying
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    throw lastError;
  }

  /**
   * Handle Gemini-specific errors and throw appropriate exceptions
   * @private
   */
  private handleGeminiError(error: unknown): never {
    const status =
      (error as { status?: number }).status ||
      (error as { response?: { status?: number } }).response?.status ||
      (error as { httpStatusCode?: number }).httpStatusCode;
    const message = error instanceof Error ? error.message : 'Unknown Gemini error';
    const errorMessage = message.toLowerCase();

    // Check for authentication errors
    if (
      status === 401 ||
      status === 403 ||
      errorMessage.includes('api key') ||
      errorMessage.includes('authentication') ||
      errorMessage.includes('permission')
    ) {
      throw new GeminiAuthenticationException('Invalid Gemini API key configuration');
    }

    // Check for rate limit errors
    if (
      status === 429 ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('resource exhausted')
    ) {
      throw new GeminiRateLimitException('Rate limit exceeded. Please try again in a moment.');
    }

    // Check for server errors
    if (status === 500 || status === 502 || status === 503) {
      throw new GeminiServiceException('Gemini service error. Please try again.');
    }

    throw new GeminiException(`Gemini API error: ${message}`);
  }

  /**
   * Check if Gemini API is configured with a valid API key
   */
  isConfigured(): boolean {
    // Check if API key exists
    if (!this.apiKey) {
      return false;
    }

    // Exclude placeholder keys
    const placeholderPatterns = /placeholder|replace|here|your-|example|test-key/i;
    if (placeholderPatterns.test(this.apiKey)) {
      return false;
    }

    // Check if key has reasonable length (Gemini API keys are typically 39+ characters)
    if (this.apiKey.length < 20) {
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
        'Gemini API key is not configured or is a placeholder. ' +
          'Please set GEMINI_API_KEY environment variable with a valid API key.'
      );
    } else {
      this.logger.log(
        `Gemini configured with model: ${this.model}, max_tokens: ${this.maxTokens}, temperature: ${this.temperature}`
      );
    }
  }

  /**
   * Get or create Gemini client instance (lazy initialization)
   * @private
   */
  private getClient(): GoogleGenAI {
    if (!this.geminiClient) {
      this.geminiClient = new GoogleGenAI({
        apiKey: this.apiKey,
      });
    }
    return this.geminiClient;
  }

  /**
   * Log token usage for cost tracking and monitoring
   * @private
   */
  private logTokenUsage(model: string, promptTokens: number, completionTokens: number): void {
    const totalTokens = promptTokens + completionTokens;

    // Rough cost estimate for Gemini (rates vary by model and region)
    // Gemini 2.5 Flash: ~$0.00001/1K prompt, ~$0.00004/1K completion
    const estimatedCost = (promptTokens * 0.00001 + completionTokens * 0.00004).toFixed(6);

    this.logger.log(
      `Gemini API Call - Model: ${model}, Prompt: ${promptTokens} tokens, ` +
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
        throw new GeminiCircuitBreakerException(
          `Gemini service is temporarily unavailable due to repeated failures. ` +
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
      this.logger.log(`Gemini request succeeded, resetting circuit breaker failure count`);
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
