import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-proj-PLACEHOLDER',
});

// Configuration from environment
const MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10);
const TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Check if OpenAI API is configured
 */
export function isOpenAIConfigured(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  return !!(apiKey && apiKey !== 'sk-proj-PLACEHOLDER' && apiKey.startsWith('sk-'));
}

/**
 * Call OpenAI Chat Completions API
 */
export async function chat(options: ChatOptions): Promise<ChatResponse> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: options.messages,
      max_tokens: options.maxTokens || MAX_TOKENS,
      temperature: options.temperature || TEMPERATURE,
    });

    const message = completion.choices[0]?.message?.content;

    if (!message) {
      throw new Error('No response from OpenAI');
    }

    // Log token usage for cost tracking
    const usage = completion.usage;
    if (usage) {
      console.log('OpenAI API Call:', {
        model: completion.model,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        estimatedCost: (usage.total_tokens * 0.00001).toFixed(4), // Rough estimate
      });
    }

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
    // Handle OpenAI-specific errors
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.status === 401) {
      throw new Error('Invalid OpenAI API key configuration.');
    } else if (error.status === 500) {
      throw new Error('OpenAI service error. Please try again.');
    }

    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

/**
 * Truncate conversation history to prevent token limit issues
 */
export function truncateConversationHistory(
  messages: ChatMessage[],
  maxMessages: number = 15
): ChatMessage[] {
  // Keep system message + last N messages
  const systemMessages = messages.filter((m) => m.role === 'system');
  const conversationMessages = messages.filter((m) => m.role !== 'system');

  if (conversationMessages.length <= maxMessages) {
    return messages;
  }

  // Keep most recent messages
  const recentMessages = conversationMessages.slice(-maxMessages);
  return [...systemMessages, ...recentMessages];
}
