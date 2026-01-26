import { randomUUID } from 'crypto';

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { GeminiService } from '../gemini/gemini.service';
import { PromptsService } from '../prompts/prompts.service';

import { ANALYSIS_CONFIG, ANALYSIS_MESSAGES } from './constants/messages.constants';
import { AnalysisResult, ConversationState, StructuredAnalysis } from './entities';

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
    private readonly geminiService: GeminiService,
    private readonly promptsService: PromptsService
  ) {}

  async onModuleInit() {
    this.logger.log('Analysis Service initialized');
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

    // Get system prompt from prompts service
    const systemPrompt = this.promptsService.getSystemPrompt(studentName);

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

    // Generate first AI message with first question from questions file
    const questions = this.promptsService.getQuestionTemplates();

    const greeting = ANALYSIS_MESSAGES.GREETING.replace('{studentName}', studentName);
    const questionHeader = ANALYSIS_MESSAGES.QUESTION_HEADER
      .replace('{current}', '1')
      .replace('{total}', String(questions.length));

    const firstMessage = `${greeting}\n\n${questionHeader}\n${questions[0]}`;

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

    let aiResponse: string;

    // Check if Gemini is configured
    if (this.geminiService.isConfigured()) {
      try {
        // Get next question details
        const questionIndex = conversation.questionCount;
        const questionTemplates = this.promptsService.getQuestionTemplates();
        
        // Truncate history to prevent token limit issues
        const truncatedMessages = this.truncateConversationHistory(
          conversation.messages,
          ANALYSIS_CONFIG.MAX_HISTORY_MESSAGES
        );

        // Add explicit instruction to ask only the next specific question
        const nextQuestionInstruction = this.buildNextQuestionPrompt(
          questionIndex, 
          questionTemplates,
          conversation.studentName
        );
        
        truncatedMessages.push({
          role: 'user',
          content: nextQuestionInstruction,
        });

        // Call Gemini
        const response = await this.geminiService.chat(truncatedMessages);
        aiResponse = response.message;

        this.logger.log(`Gemini response for conversation ${conversationId}`);
      } catch (error: any) {
        this.logger.error(`Gemini error in conversation ${conversationId}: ${error.message}`);

        // Fallback to template responses on error
        aiResponse = this.getTemplateResponse(conversation);
      }
    } else {
      // Use template responses when Gemini is not configured
      this.logger.warn('Gemini not configured, using template responses');
      aiResponse = this.getTemplateResponse(conversation);
    }

    // Add AI response to conversation
    conversation.messages.push({ role: 'assistant', content: aiResponse });
    conversation.questionCount++;

    // Check if conversation is complete
    if (conversation.questionCount >= ANALYSIS_CONFIG.TOTAL_QUESTIONS) {
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

    // Generate the final analysis report
    let structuredAnalysis: StructuredAnalysis;

    if (this.geminiService.isConfigured()) {
      try {
        // Get the analysis prompt
        const analysisPrompt = this.promptsService.getAnalysisPrompt();

        // Build the conversation for analysis generation
        // Include system message + all user/assistant messages + analysis instruction
        const analysisMessages = [
          ...conversation.messages,
          {
            role: 'user' as const,
            content: analysisPrompt,
          },
        ];

        // Call Gemini to generate the final analysis
        const response = await this.geminiService.chat(analysisMessages);
        const rawResponse = response.message;

        // Extract full text and JSON from the response
        // The AI generates both: full pedagogical text followed by JSON
        const { fullText, jsonText } = this.extractFullTextAndJson(rawResponse);

        // Validate completeness
        const validation = this.validateAnalysisCompleteness(jsonText);
        if (!validation.isComplete) {
          this.logger.error(
            `Incomplete analysis for conversation ${conversationId}: ${validation.reason}`,
            { conversationId, validationError: validation.reason }
          );

          // For validation errors (incomplete or invalid JSON), don't fallback in production
          // In tests, we want to throw the error to catch these issues
          throw new BadRequestException(
            `Analysis generation incomplete: ${validation.reason}. ` +
            `Debug info: conversationId=${conversationId}, messageCount=${conversation.messages.length}`
          );
        }

        // Parse JSON
        structuredAnalysis = JSON.parse(jsonText);

        // Add full text to structured analysis
        structuredAnalysis.fullText = fullText;

        this.logger.log(`Generated structured analysis for conversation ${conversationId}`);
      } catch (error: any) {
        // Only use fallback for non-validation errors (e.g., API failures)
        // Validation errors (BadRequestException) should be thrown
        if (error instanceof BadRequestException) {
          throw error;
        }

        this.logger.error(`Failed to generate analysis for conversation ${conversationId}: ${error.message}`);

        // Fallback: create a simple structured analysis from the conversation
        structuredAnalysis = this.generateFallbackStructuredAnalysis(conversation);
      }
    } else {
      // Use fallback analysis when Gemini is not configured
      this.logger.warn('Gemini not configured, using fallback structured analysis');
      structuredAnalysis = this.generateFallbackStructuredAnalysis(conversation);
    }

    // Create analysis result
    const analysisId = String(this.nextAnalysisId++);
    const analysis: AnalysisResult = {
      id: analysisId,
      studentId: conversation.studentId,
      structuredAnalysis,
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
    this.logger.debug(`Analysis createdAt: ${analysis.createdAt}`);

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
   * Generate a brief summary from full analysis text
   * Uses Option A: Simple text extraction (first 1-2 sentences from each section)
   *
   * @param analysisId - The analysis ID to verify ownership
   * @param userId - The teacher's user ID
   * @param fullAnalysisText - The full analysis text structure
   * @returns Brief summary with key points
   */
  async generateSummary(
    analysisId: string,
    userId: string,
    fullAnalysisText: {
      strengths: string;
      barriers: string;
      recommendations: string;
      learningStyle?: string;
    }
  ): Promise<{
    summary: {
      strengths: string[];
      barriers: string[];
      topRecommendation: string;
    };
  }> {
    // Verify analysis exists and belongs to user
    const analysis = this.analysisStore.get(analysisId);

    if (!analysis) {
      throw new NotFoundException(`Analysis ${analysisId} not found`);
    }

    if (analysis.createdBy !== userId) {
      throw new BadRequestException('You can only generate summaries for your own analyses');
    }

    // Validate that fullAnalysisText fields are non-empty
    if (!fullAnalysisText.strengths || fullAnalysisText.strengths.trim().length === 0) {
      throw new BadRequestException('Strengths field cannot be empty');
    }

    if (!fullAnalysisText.barriers || fullAnalysisText.barriers.trim().length === 0) {
      throw new BadRequestException('Barriers field cannot be empty');
    }

    if (!fullAnalysisText.recommendations || fullAnalysisText.recommendations.trim().length === 0) {
      throw new BadRequestException('Recommendations field cannot be empty');
    }

    // Extract first 1-2 sentences from each section
    const strengthsSentences = this.extractSentences(fullAnalysisText.strengths, 2);
    const barriersSentences = this.extractSentences(fullAnalysisText.barriers, 2);
    const topRecommendation = this.extractSentences(fullAnalysisText.recommendations, 1)[0] || '';

    // Generate brief summary text for storage
    const briefSummary = this.generateBriefSummaryText(
      strengthsSentences,
      barriersSentences,
      topRecommendation
    );

    // Update analysis with brief summary
    analysis.briefSummary = briefSummary;
    this.analysisStore.set(analysisId, analysis);

    this.logger.log(`Generated summary for analysis ${analysisId}`);

    return {
      summary: {
        strengths: strengthsSentences,
        barriers: barriersSentences,
        topRecommendation,
      },
    };
  }

  /**
   * Extract first N sentences from a text
   * @private
   */
  private extractSentences(text: string, count: number): string[] {
    if (!text || text.trim().length === 0) {
      return [];
    }

    // Split by periods, question marks, or exclamation marks
    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, count);

    return sentences;
  }

  /**
   * Generate brief summary text for storage (1-2 sentences)
   * @private
   */
  private generateBriefSummaryText(
    strengths: string[],
    barriers: string[],
    topRecommendation: string
  ): string {
    const parts: string[] = [];

    if (strengths.length > 0) {
      parts.push(strengths[0]);
    }

    if (barriers.length > 0) {
      parts.push(barriers[0]);
    }

    if (parts.length === 0 && topRecommendation) {
      parts.push(topRecommendation);
    }

    return parts.join('. ') + '.';
  }

  /**
   * Get template response when OpenAI is not configured
   * Uses question templates from prompts service
   * @private
   */
  private getTemplateResponse(conversation: ConversationState): string {
    const questionIndex = conversation.questionCount || 0;
    const studentName = conversation.studentName;
    const questionTemplates = this.promptsService.getQuestionTemplates();

    if (questionIndex < questionTemplates.length) {
      // Return next question with proper formatting
      const questionNumber = questionIndex + 1;
      const questionText = questionTemplates[questionIndex].replace(/{studentName}/g, studentName);

      const questionHeader = ANALYSIS_MESSAGES.QUESTION_HEADER
        .replace('{current}', String(questionNumber))
        .replace('{total}', String(questionTemplates.length));

      return `${ANALYSIS_MESSAGES.NEXT_QUESTION_PREFIX}\n\n${questionHeader}\n${questionText}`;
    } else {
      // After all questions, suggest completing the analysis
      return ANALYSIS_MESSAGES.COMPLETE_MESSAGE.replace('{studentName}', studentName);
    }
  }

  /**
   * Build explicit prompt for the next question
   * This ensures Gemini asks only ONE specific question
   * @private
   */
  private buildNextQuestionPrompt(
    questionIndex: number,
    questionTemplates: string[],
    studentName: string
  ): string {
    if (questionIndex >= questionTemplates.length) {
      const completeInfo = ANALYSIS_MESSAGES.COMPLETE_INFO.replace('{studentName}', studentName);
      const completeInstruction = ANALYSIS_MESSAGES.COMPLETE_INSTRUCTION.replace('{studentName}', studentName);
      return `${completeInfo} \n${completeInstruction}`;
    }

    const questionNumber = questionIndex + 1;
    const questionText = questionTemplates[questionIndex];
    const questionHeader = ANALYSIS_MESSAGES.QUESTION_HEADER
      .replace('{current}', String(questionNumber))
      .replace('{total}', String(questionTemplates.length));

    return `INSTRUCTION: You MUST ask ONLY the following question. Do NOT ask any other questions. Do NOT list multiple questions.

תגובה שלך חייבת להיות בדיוק בפורמט הזה:
${ANALYSIS_MESSAGES.NEXT_QUESTION_PREFIX}

${questionHeader}
${questionText}

CRITICAL: Ask ONLY this ONE question. STOP after this question. Do NOT continue with more questions.`;
  }

  /**
   * Extract full text and JSON from AI response
   * The AI generates both: full pedagogical text followed by JSON
   * @private
   */
  private extractFullTextAndJson(response: string): {
    fullText: string;
    jsonText: string;
  } {
    // Try to find JSON in response
    // JSON can be wrapped in ```json ... ``` or appear as raw { ... }

    // Pattern 1: Look for ```json ... ``` blocks
    const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      const jsonText = jsonBlockMatch[1].trim();
      const fullText = response.substring(0, jsonBlockMatch.index).trim();
      return { fullText, jsonText };
    }

    // Pattern 2: Look for raw JSON object (starts with {, ends with })
    const jsonStartIndex = response.indexOf('{');
    if (jsonStartIndex !== -1) {
      // Find matching closing brace
      let braceCount = 0;
      let jsonEndIndex = -1;

      for (let i = jsonStartIndex; i < response.length; i++) {
        if (response[i] === '{') braceCount++;
        if (response[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEndIndex = i;
            break;
          }
        }
      }

      if (jsonEndIndex !== -1) {
        const fullText = response.substring(0, jsonStartIndex).trim();
        const jsonText = response.substring(jsonStartIndex, jsonEndIndex + 1).trim();
        return { fullText, jsonText };
      }
    }

    // Fallback: if no JSON found, treat entire response as JSON
    // This handles the old format where AI returns only JSON
    this.logger.warn('Could not extract full text from response, assuming pure JSON');
    return {
      fullText: '',
      jsonText: response.trim(),
    };
  }

  /**
   * Validate that AI response is complete and not truncated
   * @private
   */
  private validateAnalysisCompleteness(response: string): {
    isComplete: boolean;
    reason?: string;
  } {
    try {
      // Parse JSON to validate structure
      const analysis = JSON.parse(response);

      // Check all required sections exist
      const requiredSections = [
        'summary',
        'strengths',
        'barriers',
        'recommendations',
        'learningStyle',
        'goals',
      ];

      for (const section of requiredSections) {
        if (!analysis[section]) {
          return {
            isComplete: false,
            reason: `Missing required section: ${section}`,
          };
        }
      }

      // Check arrays are not empty
      if (
        !analysis.strengths.academic ||
        analysis.strengths.academic.length === 0
      ) {
        return {
          isComplete: false,
          reason: 'Strengths.academic is empty',
        };
      }

      if (
        !analysis.strengths.behavioral ||
        analysis.strengths.behavioral.length === 0
      ) {
        return {
          isComplete: false,
          reason: 'Strengths.behavioral is empty',
        };
      }

      // Validate barriers arrays
      if (
        !analysis.barriers.academic ||
        analysis.barriers.academic.length === 0
      ) {
        return {
          isComplete: false,
          reason: 'Barriers.academic is empty',
        };
      }

      if (
        !analysis.barriers.behavioral ||
        analysis.barriers.behavioral.length === 0
      ) {
        return {
          isComplete: false,
          reason: 'Barriers.behavioral is empty',
        };
      }

      // Validate recommendations arrays
      if (
        !analysis.recommendations.immediate ||
        analysis.recommendations.immediate.length === 0
      ) {
        return {
          isComplete: false,
          reason: 'Recommendations.immediate is empty',
        };
      }

      if (
        !analysis.recommendations.longTerm ||
        analysis.recommendations.longTerm.length === 0
      ) {
        return {
          isComplete: false,
          reason: 'Recommendations.longTerm is empty',
        };
      }

      // Validate goals
      if (
        !analysis.goals.trackingMetrics ||
        analysis.goals.trackingMetrics.length === 0
      ) {
        return {
          isComplete: false,
          reason: 'Goals.trackingMetrics is empty',
        };
      }

      // Check summary is not empty
      if (!analysis.summary || analysis.summary.trim().length < ANALYSIS_CONFIG.MIN_SUMMARY_LENGTH) {
        return {
          isComplete: false,
          reason: 'Summary is too short or empty',
        };
      }

      return { isComplete: true };
    } catch (error: any) {
      return {
        isComplete: false,
        reason: `Invalid JSON structure: ${error.message}`,
      };
    }
  }

  /**
   * Generate a fallback structured analysis when Gemini is not available
   * Creates a basic structured analysis from the conversation
   * @private
   */
  private generateFallbackStructuredAnalysis(conversation: ConversationState): StructuredAnalysis {
    const studentName = conversation.studentName;
    const userMessages = conversation.messages.filter((m) => m.role === 'user');

    const summary = ANALYSIS_MESSAGES.FALLBACK_SUMMARY
      .replace('{count}', String(userMessages.length))
      .replace('{studentName}', studentName);

    return {
      schemaVersion: '1.0',
      summary,
      strengths: {
        academic: [ANALYSIS_MESSAGES.FALLBACK_ACADEMIC_STRENGTH],
        behavioral: [ANALYSIS_MESSAGES.FALLBACK_BEHAVIORAL_STRENGTH],
      },
      barriers: {
        academic: [ANALYSIS_MESSAGES.FALLBACK_ACADEMIC_BARRIER],
        behavioral: [ANALYSIS_MESSAGES.FALLBACK_BEHAVIORAL_BARRIER],
      },
      recommendations: {
        immediate: [ANALYSIS_MESSAGES.FALLBACK_IMMEDIATE_REC],
        longTerm: [ANALYSIS_MESSAGES.FALLBACK_LONGTERM_REC],
      },
      learningStyle: {
        preferences: ANALYSIS_MESSAGES.FALLBACK_LEARNING_STYLE,
      },
      goals: {
        trackingMetrics: [
          ANALYSIS_MESSAGES.FALLBACK_TRACKING_METRIC_1,
          ANALYSIS_MESSAGES.FALLBACK_TRACKING_METRIC_2,
        ],
      },
      fullText: `# ניתוח למידה - ${studentName}

## סיכום השיחה

במהלך השיחה נאספו ${userMessages.length} תגובות מהמורה על התלמיד/ה.

## תובנות מרכזיות

${userMessages.map((msg, idx) => `**תשובה ${idx + 1}:**\n${msg.content}\n`).join('\n')}

## המלצות

ניתוח מפורט זמין רק כאשר המערכת מחוברת לשירות הבינה המלאכותית.
אנא צור קשר עם מנהל המערכת להפעלת השירות המלא.

---
*ניתוח זה נוצר במצב fallback ללא Gemini AI*`,
    };
  }

  /**
   * Truncate conversation history to prevent token limit issues
   * Keeps system message + last N messages
   * @private
   */
  private truncateConversationHistory(
    messages: ConversationState['messages'],
    maxMessages: number
  ): ConversationState['messages'] {
    if (messages.length <= maxMessages + 1) {
      return [...messages];
    }

    // Keep system message (first) + last maxMessages
    const systemMessage = messages[0];
    const recentMessages = messages.slice(-maxMessages);

    return [systemMessage, ...recentMessages];
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
