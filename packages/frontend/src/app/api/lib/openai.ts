import { readFileSync } from 'fs';
import { join } from 'path';

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
 * Load system prompt from file
 */
export function loadSystemPrompt(studentName: string): string {
  try {
    const promptPath = join(process.cwd(), 'context', 'chat-prompt-simple.txt');
    let prompt = readFileSync(promptPath, 'utf-8');

    // Replace student name placeholder if it exists
    prompt = prompt.replace(/\{studentName\}/g, studentName);

    // Add student name to the prompt if not already there
    if (!prompt.includes(studentName)) {
      prompt += `\n\nCURRENT STUDENT: ${studentName}`;
    }

    return prompt;
  } catch (error) {
    console.error('Failed to load system prompt from file, using default:', error);
    // Fallback to default prompt
    return getDefaultSystemPrompt(studentName);
  }
}

/**
 * Default system prompt (fallback)
 */
function getDefaultSystemPrompt(studentName: string): string {
  return `You are an expert educational psychologist for K-12 students. Your role is to help teachers analyze individual student learning profiles.

PROCESS:
1. When given a student name, ask 6 key questions one at a time:
   - Overall academic performance and subject strengths/weaknesses
   - Learning style and class engagement
   - Homework habits and behavior
   - Social interactions and emotional patterns
   - Main learning challenges and recent progress
   - Unique strengths and additional observations

2. After gathering responses, provide a comprehensive Hebrew analysis with:
   - Summary (2-3 sentences)
   - Strengths (academic + behavioral/social)
   - Areas for improvement (academic + behavioral/emotional)
   - Action plan (immediate + long-term recommendations)
   - Classroom adaptations (seating, teaching style, materials)
   - Success metrics and follow-up timeline

FORMAT: Use clear Hebrew headers with emojis (📊 💪 🎯 📈 🎓 💡), bullet points, and specific actionable steps.

TONE: Empathetic, strengths-first, growth-oriented, evidence-based. Focus on what the student CAN do and how to build from there.

OUTPUT LANGUAGE: Hebrew only

CURRENT STUDENT: ${studentName}`;
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
