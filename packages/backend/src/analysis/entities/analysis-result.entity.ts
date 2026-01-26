import { StructuredAnalysis } from './structured-analysis.entity';

/**
 * Represents a saved analysis result
 * Stored in-memory for MVP, will move to database in future
 */
export class AnalysisResult {
  /** Unique analysis ID */
  id: string;

  /** Student ID this analysis is for */
  studentId: string;

  /** The structured analysis output */
  structuredAnalysis: StructuredAnalysis;

  /** Optional brief summary of the analysis */
  briefSummary?: string;

  /** Optional conversation history */
  conversationHistory?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;

  /** Timestamp when the analysis was created */
  createdAt: string;

  /** User ID of the teacher who created this analysis */
  createdBy: string;
}
