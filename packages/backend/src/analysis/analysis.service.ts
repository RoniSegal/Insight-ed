import { randomUUID } from 'crypto';

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { OpenAIService } from '../openai/openai.service';
import { PromptsService } from '../prompts/prompts.service';

import { AnalysisResult, ConversationState } from './entities';

/**
 * Service for managing student analysis conversations and results
 *
 * This service handles:
 * - Starting new analysis conversations
 * - Managing conversation state (in-memory for MVP)
 * - Continuing conversations with AI
 * - Generating final analysis reports
 * - Storing and retrieving analysis results
 *
 * @example
 * ```typescript
 * const { conversationId, message } = await analysisService.startConversation('1', 'Sarah Cohen', 'teacher-123');
 * const response = await analysisService.continueConversation(conversationId, 'Student excels in math');
 * const result = await analysisService.completeAnalysis(conversationId, 'teacher-123');
 * ```
 */
@Injectable()
export class AnalysisService implements OnModuleInit {
  private readonly logger = new Logger(AnalysisService.name);

  // In-memory stores (MVP - will move to database)
  private readonly conversationStore = new Map<string, ConversationState>();
  private readonly analysisStore = new Map<string, AnalysisResult>();
  private readonly studentAnalysisIndex = new Map<string, string[]>();
  private nextAnalysisId = 1;

  // TTL for conversations (24 hours)
  private readonly conversationTTL = 24 * 60 * 60 * 1000;

  constructor(
    // OpenAI service will be used for final analysis generation (future implementation)
    private readonly openaiService: OpenAIService,
    private readonly promptsService: PromptsService
  ) {}

  async onModuleInit() {
    this.logger.log('Analysis Service initialized');
    this.logger.log(`OpenAI configured: ${this.openaiService.isConfigured()}`);
    // Start background cleanup task
    this.startCleanupTask();
  }

  /**
   * Start a new analysis conversation for a student
   *
   * @param studentId - The student ID to analyze
   * @param studentName - The student's name
   * @param userId - The teacher's user ID
   * @returns Conversation ID and first AI message
   */
  async startConversation(
    studentId: string,
    studentName: string,
    userId: string
  ): Promise<{ conversationId: string; message: string }> {
    // Generate conversation ID
    const conversationId = randomUUID();

    // Get system prompt and questions from prompts service
    const systemPrompt = this.buildQuestioningSystemPrompt(studentName);
    const questionTemplates = this.promptsService.getQuestionTemplates();

    // Initialize conversation state
    const conversation: ConversationState = {
      id: conversationId,
      studentId,
      studentName,
      systemPrompt,
      messages: [{ role: 'system', content: systemPrompt }],
      questionCount: 0,
      isComplete: false,
      createdAt: new Date(),
      createdBy: userId,
    };

    // Generate first AI message using the first question from questions.txt
    const firstQuestionText = questionTemplates[0] || 'מהם הפרטים האישיים של התלמיד?';
    const firstMessage = `שלום! בואו ננתח את ${studentName}. כדי ליצור ניתוח מקיף, אשאל אותך מספר שאלות על התלמיד/ה.

**שאלה 1 מתוך ${questionTemplates.length}:**
${firstQuestionText}`;

    // Add first message to conversation
    conversation.messages.push({ role: 'assistant', content: firstMessage });
    conversation.questionCount = 1;

    // Store conversation
    this.conversationStore.set(conversationId, conversation);

    this.logger.log(`Started conversation ${conversationId} for student ${studentId}`);

    return {
      conversationId,
      message: firstMessage,
    };
  }

  /**
   * Continue an existing conversation with a user message
   *
   * @param conversationId - The conversation ID
   * @param userMessage - The user's message
   * @returns AI response with completion status
   */
  async continueConversation(
    conversationId: string,
    userMessage: string
  ): Promise<{ message: string; isComplete: boolean; metadata: any }> {
    // Get conversation from store
    const conversation = this.conversationStore.get(conversationId);

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    // Add user message to conversation
    conversation.messages.push({ role: 'user', content: userMessage.trim() });

    // Always use questions directly from questions.txt file
    // Don't use OpenAI for asking questions - only for final analysis
    const aiResponse = this.getTemplateResponse(conversation);

    // Add AI response to conversation
    conversation.messages.push({ role: 'assistant', content: aiResponse });
    conversation.questionCount++;

    // Get question templates to check completion
    const questionTemplates = this.promptsService.getQuestionTemplates();
    
    // Check if conversation is complete (all questions asked)
    if (conversation.questionCount >= questionTemplates.length) {
      conversation.isComplete = true;
    }

    // Update conversation in store
    this.conversationStore.set(conversationId, conversation);

    return {
      message: aiResponse,
      isComplete: conversation.isComplete,
      metadata: {
        questionCount: conversation.questionCount,
        messageCount: conversation.messages.length,
      },
    };
  }

  /**
   * Complete an analysis and generate the final report
   *
   * @param conversationId - The conversation ID
   * @param userId - The teacher's user ID
   * @returns Analysis ID and metadata
   */
  async completeAnalysis(
    conversationId: string,
    userId: string
  ): Promise<{ analysisId: string; studentId: string; completedAt: string }> {
    // Get conversation from store
    const conversation = this.conversationStore.get(conversationId);

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    // Verify ownership
    if (conversation.createdBy !== userId) {
      throw new BadRequestException('You can only complete your own conversations');
    }

    // Get final analysis message (last assistant message)
    const finalMessage = conversation.messages.filter((m) => m.role === 'assistant').pop();

    if (!finalMessage) {
      throw new BadRequestException('No analysis generated yet');
    }

    // Create analysis result
    const analysisId = String(this.nextAnalysisId++);
    const analysis: AnalysisResult = {
      id: analysisId,
      studentId: conversation.studentId,
      analysis: finalMessage.content,
      conversationHistory: conversation.messages,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };

    // Store analysis
    this.analysisStore.set(analysisId, analysis);

    // Update student index
    const studentAnalyses = this.studentAnalysisIndex.get(conversation.studentId) || [];
    studentAnalyses.push(analysisId);
    this.studentAnalysisIndex.set(conversation.studentId, studentAnalyses);

    this.logger.log(`Completed analysis ${analysisId} for student ${conversation.studentId}`);

    return {
      analysisId,
      studentId: conversation.studentId,
      completedAt: analysis.createdAt,
    };
  }

  /**
   * Get an analysis by ID
   *
   * @param analysisId - The analysis ID
   * @returns The analysis result
   */
  async getAnalysisById(analysisId: string): Promise<AnalysisResult> {
    const analysis = this.analysisStore.get(analysisId);

    if (!analysis) {
      throw new NotFoundException(`Analysis ${analysisId} not found`);
    }

    return analysis;
  }

  /**
   * Get all analyses for a student
   *
   * @param studentId - The student ID
   * @returns Array of analysis results, sorted by date (newest first)
   */
  async getAnalysesByStudentId(studentId: string): Promise<AnalysisResult[]> {
    const analysisIds = this.studentAnalysisIndex.get(studentId) || [];

    const analyses = analysisIds
      .map((id) => this.analysisStore.get(id))
      .filter((a): a is AnalysisResult => a !== undefined)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return analyses;
  }

  /**
   * Get the latest analysis for a student
   *
   * @param studentId - The student ID
   * @returns The most recent analysis result
   */
  async getLatestAnalysisByStudentId(studentId: string): Promise<AnalysisResult | null> {
    const analyses = await this.getAnalysesByStudentId(studentId);
    return analyses[0] || null;
  }

  /**
   * Build system prompt for the questioning phase
   * Simple prompt since questions are shown directly from questions.txt
   * @private
   */
  private buildQuestioningSystemPrompt(studentName: string): string {
    return `אתה אוסף מידע על התלמיד/ה "${studentName}" באמצעות שאלון מובנה.
השאלות מוצגות ישירות מקובץ התבניות.`;
  }

  /**
   * Get the next question directly from questions.txt file
   * Shows exact text without AI modification
   * @private
   */
  private getTemplateResponse(conversation: ConversationState): string {
    const questionIndex = conversation.questionCount || 0;
    const studentName = conversation.studentName;
    const questionTemplates = this.promptsService.getQuestionTemplates();

    if (questionIndex < questionTemplates.length) {
      // Get the exact question text from the file
      const questionText = questionTemplates[questionIndex];
      const questionNumber = questionIndex + 1;
      
      // Format: acknowledge answer + show next question
      const thankYouMessage = questionIndex > 0 ? 'תודה על התשובה.\n\n' : '';
      
      return `${thankYouMessage}**שאלה ${questionNumber} מתוך ${questionTemplates.length}:**
${questionText}`;
    } else {
      // After all questions, suggest completing the analysis
      return `תודה רבה על כל המידע המפורט! יש לי תמונה ברורה של ${studentName}.

לחץ/י על כפתור "השלם ניתוח" כדי לקבל ניתוח מקיף עם המלצות ספציפיות לתלמיד/ה.`;
    }
  }

  /**
   * Clean up old conversations (background task)
   * Runs every hour to remove conversations older than 24 hours
   * @private
   */
  private startCleanupTask(): void {
    setInterval(
      () => {
        const now = Date.now();
        let cleaned = 0;

        for (const [id, conversation] of this.conversationStore.entries()) {
          if (now - conversation.createdAt.getTime() > this.conversationTTL) {
            this.conversationStore.delete(id);
            cleaned++;
          }
        }

        if (cleaned > 0) {
          this.logger.log(`Cleaned up ${cleaned} old conversations`);
        }
      },
      60 * 60 * 1000
    ); // Run every hour
  }
}
