/**
 * Represents the state of an ongoing analysis conversation
 * Stored in-memory for MVP, will move to database in future
 */
export class ConversationState {
  /** Unique conversation ID (UUID) */
  id: string;

  /** Student ID being analyzed */
  studentId: string;

  /** Student name (for prompt personalization) */
  studentName: string;

  /** System prompt used for this conversation (stored for auditability) */
  systemPrompt: string;

  /** Array of chat messages in the conversation */
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;

  /** Number of questions asked so far */
  questionCount: number;

  /** Whether the conversation is complete (6+ questions) */
  isComplete: boolean;

  /** Timestamp when the conversation was created */
  createdAt: Date;

  /** User ID of the teacher conducting the analysis */
  createdBy: string;
}
