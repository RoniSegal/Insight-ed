/**
 * Analysis domain entities
 */

export interface ConversationState {
  id: string;
  studentId: string;
  studentName: string;
  systemPrompt: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  questionCount: number;
  isComplete: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface AnalysisResult {
  id: string;
  studentId: string;
  analysis: string;
  conversationHistory: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  createdAt: string;
  createdBy: string;
}
