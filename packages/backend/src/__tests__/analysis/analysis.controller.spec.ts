import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AnalysisController } from '../../analysis/analysis.controller';
import { AnalysisService } from '../../analysis/analysis.service';

describe('AnalysisController', () => {
  let controller: AnalysisController;

  const mockAnalysisService = {
    startConversation: jest.fn(),
    continueConversation: jest.fn(),
    completeAnalysis: jest.fn(),
    getAnalysisById: jest.fn(),
    getAnalysesByStudentId: jest.fn(),
    getLatestAnalysisByStudentId: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 'teacher-1',
      email: 'teacher@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        {
          provide: AnalysisService,
          useValue: mockAnalysisService,
        },
      ],
    }).compile();

    controller = module.get<AnalysisController>(AnalysisController);

    jest.clearAllMocks();
  });

  describe('Controller Initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('POST /start - startAnalysis', () => {
    it('should start a new analysis conversation', async () => {
      const dto = {
        studentId: 'student-1',
        studentName: 'Sarah Cohen',
      };

      const expectedResult = {
        conversationId: 'conv-123',
        message: 'שלום! בואו ננתח את Sarah Cohen...',
      };

      mockAnalysisService.startConversation.mockResolvedValueOnce(expectedResult);

      const result = await controller.startAnalysis(dto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(mockAnalysisService.startConversation).toHaveBeenCalledWith(
        'student-1',
        'Sarah Cohen',
        'teacher-1'
      );
    });

    it('should use default student name if not provided', async () => {
      const dto = {
        studentId: 'student-1',
      };

      const expectedResult = {
        conversationId: 'conv-123',
        message: 'שלום!...',
      };

      mockAnalysisService.startConversation.mockResolvedValueOnce(expectedResult);

      await controller.startAnalysis(dto, mockRequest);

      expect(mockAnalysisService.startConversation).toHaveBeenCalledWith(
        'student-1',
        'Student student-1',
        'teacher-1'
      );
    });

    it('should extract userId from request', async () => {
      const dto = {
        studentId: 'student-1',
        studentName: 'Sarah Cohen',
      };

      mockAnalysisService.startConversation.mockResolvedValueOnce({
        conversationId: 'conv-123',
        message: 'שלום!',
      });

      await controller.startAnalysis(dto, mockRequest);

      expect(mockAnalysisService.startConversation).toHaveBeenCalledWith(
        'student-1',
        'Sarah Cohen',
        'teacher-1'
      );
    });
  });

  describe('POST /chat - chat', () => {
    it('should send a chat message and return AI response', async () => {
      const dto = {
        conversationId: 'conv-123',
        message: 'התלמידה מצטיינת במתמטיקה',
      };

      const expectedResult = {
        message: 'תודה על המידע...',
        isComplete: false,
        metadata: {
          questionCount: 2,
          messageCount: 5,
        },
      };

      mockAnalysisService.continueConversation.mockResolvedValueOnce(expectedResult);

      const result = await controller.chat(dto);

      expect(result).toEqual(expectedResult);
      expect(mockAnalysisService.continueConversation).toHaveBeenCalledWith(
        'conv-123',
        dto.message
      );
    });

    it('should handle conversation completion', async () => {
      const dto = {
        conversationId: 'conv-123',
        message: 'Final message',
      };

      const expectedResult = {
        message: 'תודה רבה על כל המידע...',
        isComplete: true,
        metadata: {
          questionCount: 6,
          messageCount: 15,
        },
      };

      mockAnalysisService.continueConversation.mockResolvedValueOnce(expectedResult);

      const result = await controller.chat(dto);

      expect(result.isComplete).toBe(true);
      expect(result.metadata.questionCount).toBe(6);
    });

    it('should throw NotFoundException for invalid conversation ID', async () => {
      const dto = {
        conversationId: 'invalid-id',
        message: 'Test message',
      };

      mockAnalysisService.continueConversation.mockRejectedValueOnce(
        new NotFoundException('Conversation invalid-id not found')
      );

      await expect(controller.chat(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST /complete - completeAnalysis', () => {
    it('should complete an analysis successfully', async () => {
      const dto = {
        conversationId: 'conv-123',
      };

      const expectedResult = {
        analysisId: '42',
        studentId: 'student-1',
        completedAt: '2026-01-04T19:30:00.000Z',
      };

      mockAnalysisService.completeAnalysis.mockResolvedValueOnce(expectedResult);

      const result = await controller.completeAnalysis(dto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(mockAnalysisService.completeAnalysis).toHaveBeenCalledWith('conv-123', 'teacher-1');
    });

    it('should throw NotFoundException for invalid conversation ID', async () => {
      const dto = {
        conversationId: 'invalid-id',
      };

      mockAnalysisService.completeAnalysis.mockRejectedValueOnce(
        new NotFoundException('Conversation invalid-id not found')
      );

      await expect(controller.completeAnalysis(dto, mockRequest)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should pass userId from request', async () => {
      const dto = {
        conversationId: 'conv-123',
      };

      mockAnalysisService.completeAnalysis.mockResolvedValueOnce({
        analysisId: '42',
        studentId: 'student-1',
        completedAt: '2026-01-04T19:30:00.000Z',
      });

      await controller.completeAnalysis(dto, mockRequest);

      expect(mockAnalysisService.completeAnalysis).toHaveBeenCalledWith('conv-123', 'teacher-1');
    });
  });

  describe('GET /:id - getAnalysisById', () => {
    it('should retrieve analysis by ID', async () => {
      const analysisId = '42';
      const expectedAnalysis = {
        id: '42',
        studentId: 'student-1',
        analysis: '# ניתוח תלמידה: שרה כהן...',
        createdAt: '2026-01-04T19:30:00.000Z',
        createdBy: 'teacher-1',
      };

      mockAnalysisService.getAnalysisById.mockResolvedValueOnce(expectedAnalysis);

      const result = await controller.getAnalysisById(analysisId);

      expect(result).toEqual({ analysis: expectedAnalysis });
      expect(mockAnalysisService.getAnalysisById).toHaveBeenCalledWith('42');
    });

    it('should throw NotFoundException for invalid analysis ID', async () => {
      mockAnalysisService.getAnalysisById.mockRejectedValueOnce(
        new NotFoundException('Analysis invalid-id not found')
      );

      await expect(controller.getAnalysisById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /student/:studentId - getAnalysesByStudent', () => {
    it('should retrieve all analyses for a student', async () => {
      const studentId = 'student-1';
      const expectedAnalyses = [
        {
          id: '42',
          studentId: 'student-1',
          analysis: 'Analysis 1',
          createdAt: '2026-01-04T19:30:00.000Z',
          createdBy: 'teacher-1',
        },
        {
          id: '41',
          studentId: 'student-1',
          analysis: 'Analysis 2',
          createdAt: '2026-01-03T19:30:00.000Z',
          createdBy: 'teacher-1',
        },
      ];

      mockAnalysisService.getAnalysesByStudentId.mockResolvedValueOnce(expectedAnalyses);

      const result = await controller.getAnalysesByStudent(studentId);

      expect(result).toEqual({ analyses: expectedAnalyses });
      expect(result.analyses).toHaveLength(2);
      expect(mockAnalysisService.getAnalysesByStudentId).toHaveBeenCalledWith('student-1');
    });

    it('should return empty array for student with no analyses', async () => {
      mockAnalysisService.getAnalysesByStudentId.mockResolvedValueOnce([]);

      const result = await controller.getAnalysesByStudent('student-999');

      expect(result).toEqual({ analyses: [] });
    });

    it('should return analyses sorted by date (newest first)', async () => {
      const expectedAnalyses = [
        {
          id: '42',
          studentId: 'student-1',
          analysis: 'Latest',
          createdAt: '2026-01-04T19:30:00.000Z',
          createdBy: 'teacher-1',
        },
        {
          id: '41',
          studentId: 'student-1',
          analysis: 'Older',
          createdAt: '2026-01-03T19:30:00.000Z',
          createdBy: 'teacher-1',
        },
      ];

      mockAnalysisService.getAnalysesByStudentId.mockResolvedValueOnce(expectedAnalyses);

      const result = await controller.getAnalysesByStudent('student-1');

      expect(result.analyses[0].createdAt > result.analyses[1].createdAt).toBe(true);
    });
  });

  describe('GET /student/:studentId/latest - getLatestAnalysisByStudent', () => {
    it('should retrieve the latest analysis for a student', async () => {
      const studentId = 'student-1';
      const expectedAnalysis = {
        id: '42',
        studentId: 'student-1',
        analysis: '# ניתוח תלמידה: שרה כהן...',
        createdAt: '2026-01-04T19:30:00.000Z',
        createdBy: 'teacher-1',
      };

      mockAnalysisService.getLatestAnalysisByStudentId.mockResolvedValueOnce(expectedAnalysis);

      const result = await controller.getLatestAnalysisByStudent(studentId);

      expect(result).toEqual({ analysis: expectedAnalysis });
      expect(mockAnalysisService.getLatestAnalysisByStudentId).toHaveBeenCalledWith('student-1');
    });

    it('should throw NotFoundException when no analyses exist', async () => {
      mockAnalysisService.getLatestAnalysisByStudentId.mockResolvedValueOnce(null);

      await expect(controller.getLatestAnalysisByStudent('student-999')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException with student ID in message', async () => {
      mockAnalysisService.getLatestAnalysisByStudentId.mockResolvedValueOnce(null);

      await expect(controller.getLatestAnalysisByStudent('student-999')).rejects.toThrow(
        'No analyses found for student student-999'
      );
    });
  });

  describe('Integration with Service', () => {
    it('should properly delegate to service methods', async () => {
      const startDto = { studentId: 'student-1', studentName: 'Sarah' };
      mockAnalysisService.startConversation.mockResolvedValueOnce({
        conversationId: 'conv-123',
        message: 'שלום',
      });

      await controller.startAnalysis(startDto, mockRequest);

      expect(mockAnalysisService.startConversation).toHaveBeenCalledTimes(1);
    });

    it('should propagate service errors to caller', async () => {
      const dto = { conversationId: 'conv-123', message: 'Test' };
      const serviceError = new Error('Service error');

      mockAnalysisService.continueConversation.mockRejectedValueOnce(serviceError);

      await expect(controller.chat(dto)).rejects.toThrow('Service error');
    });
  });

  describe('Request User Context', () => {
    it('should extract userId from authenticated request', async () => {
      const customRequest = {
        user: {
          userId: 'custom-teacher-id',
          email: 'custom@example.com',
        },
      };

      const dto = { studentId: 'student-1', studentName: 'Sarah' };
      mockAnalysisService.startConversation.mockResolvedValueOnce({
        conversationId: 'conv-123',
        message: 'שלום',
      });

      await controller.startAnalysis(dto, customRequest);

      expect(mockAnalysisService.startConversation).toHaveBeenCalledWith(
        'student-1',
        'Sarah',
        'custom-teacher-id'
      );
    });
  });
});
