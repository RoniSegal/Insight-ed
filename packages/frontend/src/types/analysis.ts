/**
 * TypeScript types for Analysis API
 * Matches backend DTOs from packages/backend/src/analysis/dto/
 */

/**
 * Request to start a new student analysis conversation
 */
export interface StartAnalysisDto {
  studentId: string;
  studentName?: string;
}

/**
 * Response when starting a new analysis
 */
export interface StartAnalysisResponse {
  conversationId: string;
  message: string;
}

/**
 * Request to send a chat message
 */
export interface ChatMessageDto {
  conversationId: string;
  message: string;
}

/**
 * Response from sending a chat message
 */
export interface ChatResponse {
  message: string;
  isComplete: boolean;
  metadata: {
    questionCount: number;
    messageCount: number;
  };
}

/**
 * Request to complete an analysis
 */
export interface CompleteAnalysisDto {
  conversationId: string;
}

/**
 * Response from completing an analysis
 */
export interface CompleteAnalysisResponse {
  analysisId: string;
  studentId: string;
  completedAt: string;
}

/**
 * Saved analysis result
 */
export interface Analysis {
  id: string;
  studentId: string;
  analysis: string;
  createdAt: string;
  createdBy: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}
