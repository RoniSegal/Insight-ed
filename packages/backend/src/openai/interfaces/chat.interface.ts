/**
 * OpenAI Chat Interfaces
 *
 * Type definitions for OpenAI chat completions API integration.
 * These interfaces provide type safety for all chat-related operations.
 */

/**
 * Represents a single message in a chat conversation.
 */
export interface ChatMessage {
  /**
   * The role of the message author
   * - 'system': Instructions to the AI (e.g., "You are an educational psychologist")
   * - 'user': Messages from the end user
   * - 'assistant': AI-generated responses
   */
  role: 'system' | 'user' | 'assistant';

  /**
   * The content of the message
   */
  content: string;
}

/**
 * Options for chat completion requests
 */
export interface ChatOptions {
  /**
   * Maximum number of tokens to generate in the completion.
   * Overrides the default configured max tokens if provided.
   *
   * @example 2000
   */
  maxTokens?: number;

  /**
   * Controls randomness in the response (0.0 to 2.0)
   * - 0.0: Deterministic, focused responses
   * - 1.0: Balanced creativity
   * - 2.0: Maximum creativity/randomness
   *
   * Overrides the default configured temperature if provided.
   *
   * @default 0.7
   */
  temperature?: number;

  /**
   * The OpenAI model to use for this request.
   * Overrides the default configured model if provided.
   *
   * @example 'gpt-4-turbo-preview'
   */
  model?: string;
}

/**
 * Token usage information returned by OpenAI
 */
export interface TokenUsage {
  /**
   * Number of tokens in the input prompt
   */
  promptTokens: number;

  /**
   * Number of tokens in the generated completion
   */
  completionTokens: number;

  /**
   * Total tokens used (prompt + completion)
   */
  totalTokens: number;
}

/**
 * Response from a chat completion request
 */
export interface ChatResponse {
  /**
   * The generated message content from the AI
   */
  message: string;

  /**
   * Token usage information for cost tracking and monitoring.
   * May be undefined if usage data is not available.
   */
  usage?: TokenUsage;
}
