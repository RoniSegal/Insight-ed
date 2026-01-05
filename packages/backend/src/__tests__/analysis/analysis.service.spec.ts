import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AnalysisService } from '../../analysis/analysis.service';
import { OpenAIService } from '../../openai/openai.service';
import { PromptsService } from '../../prompts/prompts.service';

describe('AnalysisService', () => {
  let service: AnalysisService;

  const mockOpenAIService = {
    chat: jest.fn(),
    isConfigured: jest.fn().mockReturnValue(true),
  };

  const mockPromptsService = {
    getSystemPrompt: jest.fn().mockReturnValue('You are an educational psychologist...'),
    getQuestionTemplates: jest
      .fn()
      .mockReturnValue(['שאלה 1', 'שאלה 2', 'שאלה 3', 'שאלה 4', 'שאלה 5', 'שאלה 6']),
    getAnalysisPrompt: jest.fn().mockReturnValue('בהתבסס על כל המידע...'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: OpenAIService,
          useValue: mockOpenAIService,
        },
        {
          provide: PromptsService,
          useValue: mockPromptsService,
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);

    // Initialize the service
    await service.onModuleInit();

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize successfully', async () => {
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });
  });

  describe('startConversation', () => {
    it('should start a new conversation successfully', async () => {
      const result = await service.startConversation('student-1', 'Sarah Cohen', 'teacher-1');

      expect(result).toBeDefined();
      expect(result.conversationId).toBeDefined();
      expect(result.message).toContain('Sarah Cohen');
      expect(result.message).toContain('שאלה 1');
      expect(mockPromptsService.getSystemPrompt).toHaveBeenCalledWith('Sarah Cohen');
    });

    it('should generate unique conversation IDs', async () => {
      const result1 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      const result2 = await service.startConversation('student-2', 'Michael', 'teacher-1');

      expect(result1.conversationId).not.toEqual(result2.conversationId);
    });

    it('should include student name in first message', async () => {
      const result = await service.startConversation('student-1', 'David Levi', 'teacher-1');

      expect(result.message).toContain('David Levi');
    });
  });

  describe('continueConversation', () => {
    let conversationId: string;

    beforeEach(async () => {
      const result = await service.startConversation('student-1', 'Sarah Cohen', 'teacher-1');
      conversationId = result.conversationId;
    });

    it('should continue conversation with OpenAI response', async () => {
      mockOpenAIService.chat.mockResolvedValueOnce({
        message: 'תודה על המידע. ספר לי עוד...',
      });

      const result = await service.continueConversation(conversationId, 'התלמידה מצטיינת במתמטיקה');

      expect(result).toBeDefined();
      expect(result.message).toBe('תודה על המידע. ספר לי עוד...');
      expect(result.isComplete).toBe(false);
      expect(result.metadata.questionCount).toBe(2);
      expect(mockOpenAIService.chat).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid conversation ID', async () => {
      await expect(service.continueConversation('invalid-id', 'some message')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should mark conversation as complete after 6 questions', async () => {
      mockOpenAIService.chat.mockResolvedValue({ message: 'AI response' });

      // Send 5 more messages (already have 1 from start)
      for (let i = 0; i < 5; i++) {
        await service.continueConversation(conversationId, `Message ${i + 1}`);
      }

      const result = await service.continueConversation(conversationId, 'Final message');
      expect(result.isComplete).toBe(true);
    });

    it('should use template responses when OpenAI is not configured', async () => {
      mockOpenAIService.isConfigured.mockReturnValueOnce(false);

      const result = await service.continueConversation(conversationId, 'Test message');

      expect(result.message).toBeDefined();
      expect(mockOpenAIService.chat).not.toHaveBeenCalled();
      expect(mockPromptsService.getQuestionTemplates).toHaveBeenCalled();
    });

    it('should fall back to template responses on OpenAI error', async () => {
      mockOpenAIService.chat.mockRejectedValueOnce(new Error('OpenAI API error'));

      const result = await service.continueConversation(conversationId, 'Test message');

      expect(result.message).toBeDefined();
      expect(mockPromptsService.getQuestionTemplates).toHaveBeenCalled();
    });

    it('should increment question count correctly', async () => {
      mockOpenAIService.chat.mockResolvedValue({ message: 'AI response' });

      const result1 = await service.continueConversation(conversationId, 'Message 1');
      expect(result1.metadata.questionCount).toBe(2);

      const result2 = await service.continueConversation(conversationId, 'Message 2');
      expect(result2.metadata.questionCount).toBe(3);
    });

    it('should track message count correctly', async () => {
      mockOpenAIService.chat.mockResolvedValue({ message: 'AI response' });

      const result = await service.continueConversation(conversationId, 'Test message');

      // system + assistant (first) + user + assistant = 4
      expect(result.metadata.messageCount).toBe(4);
    });
  });

  describe('completeAnalysis', () => {
    let conversationId: string;

    beforeEach(async () => {
      const result = await service.startConversation('student-1', 'Sarah Cohen', 'teacher-1');
      conversationId = result.conversationId;

      // Add some messages
      mockOpenAIService.chat.mockResolvedValue({ message: 'AI response' });
      await service.continueConversation(conversationId, 'Message 1');
    });

    it('should complete analysis successfully', async () => {
      const result = await service.completeAnalysis(conversationId, 'teacher-1');

      expect(result).toBeDefined();
      expect(result.analysisId).toBeDefined();
      expect(result.studentId).toBe('student-1');
      expect(result.completedAt).toBeDefined();
    });

    it('should throw NotFoundException for invalid conversation ID', async () => {
      await expect(service.completeAnalysis('invalid-id', 'teacher-1')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if user does not own conversation', async () => {
      await expect(service.completeAnalysis(conversationId, 'different-teacher')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should store analysis result', async () => {
      const result = await service.completeAnalysis(conversationId, 'teacher-1');

      const analysis = await service.getAnalysisById(result.analysisId);
      expect(analysis).toBeDefined();
      expect(analysis.id).toBe(result.analysisId);
      expect(analysis.studentId).toBe('student-1');
    });

    it('should include conversation history in analysis', async () => {
      const result = await service.completeAnalysis(conversationId, 'teacher-1');

      const analysis = await service.getAnalysisById(result.analysisId);
      expect(analysis.conversationHistory).toBeDefined();
      expect(analysis.conversationHistory.length).toBeGreaterThan(0);
    });

    it('should generate unique analysis IDs', async () => {
      const result1 = await service.completeAnalysis(conversationId, 'teacher-1');

      // Start new conversation
      const newConv = await service.startConversation('student-2', 'Michael', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'AI response' });
      await service.continueConversation(newConv.conversationId, 'Message');

      const result2 = await service.completeAnalysis(newConv.conversationId, 'teacher-1');

      expect(result1.analysisId).not.toEqual(result2.analysisId);
    });
  });

  describe('getAnalysisById', () => {
    it('should retrieve analysis by ID', async () => {
      // Create analysis
      const conv = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Final analysis' });
      await service.continueConversation(conv.conversationId, 'Message');
      const completed = await service.completeAnalysis(conv.conversationId, 'teacher-1');

      // Retrieve it
      const analysis = await service.getAnalysisById(completed.analysisId);

      expect(analysis).toBeDefined();
      expect(analysis.id).toBe(completed.analysisId);
      expect(analysis.studentId).toBe('student-1');
    });

    it('should throw NotFoundException for invalid analysis ID', async () => {
      await expect(service.getAnalysisById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAnalysesByStudentId', () => {
    it('should return empty array for student with no analyses', async () => {
      const analyses = await service.getAnalysesByStudentId('student-999');

      expect(analyses).toEqual([]);
    });

    it('should return all analyses for a student', async () => {
      // Create 2 analyses for same student
      const conv1 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Analysis 1' });
      await service.continueConversation(conv1.conversationId, 'Message 1');
      await service.completeAnalysis(conv1.conversationId, 'teacher-1');

      const conv2 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Analysis 2' });
      await service.continueConversation(conv2.conversationId, 'Message 2');
      await service.completeAnalysis(conv2.conversationId, 'teacher-1');

      const analyses = await service.getAnalysesByStudentId('student-1');

      expect(analyses).toHaveLength(2);
      expect(analyses[0].studentId).toBe('student-1');
      expect(analyses[1].studentId).toBe('student-1');
    });

    it('should return analyses sorted by date (newest first)', async () => {
      // Create 2 analyses
      const conv1 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Analysis 1' });
      await service.continueConversation(conv1.conversationId, 'Message 1');
      const result1 = await service.completeAnalysis(conv1.conversationId, 'teacher-1');

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const conv2 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Analysis 2' });
      await service.continueConversation(conv2.conversationId, 'Message 2');
      const result2 = await service.completeAnalysis(conv2.conversationId, 'teacher-1');

      const analyses = await service.getAnalysesByStudentId('student-1');

      // Newest should be first
      expect(analyses[0].id).toBe(result2.analysisId);
      expect(analyses[1].id).toBe(result1.analysisId);
    });

    it('should only return analyses for specified student', async () => {
      // Create analyses for different students
      const conv1 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Analysis' });
      await service.continueConversation(conv1.conversationId, 'Message');
      await service.completeAnalysis(conv1.conversationId, 'teacher-1');

      const conv2 = await service.startConversation('student-2', 'Michael', 'teacher-1');
      await service.continueConversation(conv2.conversationId, 'Message');
      await service.completeAnalysis(conv2.conversationId, 'teacher-1');

      const analysesForStudent1 = await service.getAnalysesByStudentId('student-1');
      expect(analysesForStudent1).toHaveLength(1);
      expect(analysesForStudent1[0].studentId).toBe('student-1');
    });
  });

  describe('getLatestAnalysisByStudentId', () => {
    it('should return null for student with no analyses', async () => {
      const latest = await service.getLatestAnalysisByStudentId('student-999');

      expect(latest).toBeNull();
    });

    it('should return the most recent analysis', async () => {
      // Create 2 analyses
      const conv1 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Analysis 1' });
      await service.continueConversation(conv1.conversationId, 'Message 1');
      await service.completeAnalysis(conv1.conversationId, 'teacher-1');

      await new Promise((resolve) => setTimeout(resolve, 10));

      const conv2 = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Analysis 2' });
      await service.continueConversation(conv2.conversationId, 'Message 2');
      const result2 = await service.completeAnalysis(conv2.conversationId, 'teacher-1');

      const latest = await service.getLatestAnalysisByStudentId('student-1');

      expect(latest).not.toBeNull();
      expect(latest.id).toBe(result2.analysisId);
    });
  });

  describe('Template Responses', () => {
    let conversationId: string;

    beforeEach(async () => {
      const result = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      conversationId = result.conversationId;
      mockOpenAIService.isConfigured.mockReturnValue(false);
    });

    it('should return question templates in order', async () => {
      // First 5 questions should contain question text
      for (let i = 0; i < 5; i++) {
        const result = await service.continueConversation(conversationId, `Message ${i + 1}`);
        expect(result.message).toBeDefined();
        expect(result.message.length).toBeGreaterThan(0);
      }
    });

    it('should return completion message after 6 questions', async () => {
      // Send 6 messages
      for (let i = 0; i < 6; i++) {
        await service.continueConversation(conversationId, `Message ${i + 1}`);
      }

      const result = await service.continueConversation(conversationId, 'Extra message');
      expect(result.message).toContain('תודה רבה');
      expect(result.message).toContain('השלם ניתוח');
    });
  });

  describe('Conversation State Management', () => {
    it('should maintain conversation state across multiple messages', async () => {
      const conv = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.chat.mockResolvedValue({ message: 'Response' });

      await service.continueConversation(conv.conversationId, 'Message 1');
      const result = await service.continueConversation(conv.conversationId, 'Message 2');

      expect(result.metadata.questionCount).toBe(3);
      expect(result.metadata.messageCount).toBeGreaterThan(4);
    });

    it('should store system prompt in conversation', async () => {
      await service.startConversation('student-1', 'Sarah Cohen', 'teacher-1');

      expect(mockPromptsService.getSystemPrompt).toHaveBeenCalledWith('Sarah Cohen');
    });

    it('should trim user messages', async () => {
      const conv = await service.startConversation('student-1', 'Sarah', 'teacher-1');
      mockOpenAIService.isConfigured.mockReturnValue(true);
      mockOpenAIService.chat.mockResolvedValue({ message: 'Response' });

      await service.continueConversation(conv.conversationId, '  Message with spaces  ');

      expect(mockOpenAIService.chat).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ content: 'Message with spaces' })])
      );
    });
  });
});
