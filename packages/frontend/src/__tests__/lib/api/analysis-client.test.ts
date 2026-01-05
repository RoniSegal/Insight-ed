/**
 * Unit tests for Analysis API Client
 */

import { analysisClient } from '@/lib/api/analysis-client';
import type {
  Analysis,
  ChatResponse,
  CompleteAnalysisResponse,
  StartAnalysisResponse,
} from '@/types/analysis';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

describe('analysisClient', () => {
  const mockAccessToken = 'test-access-token';
  const API_BASE_URL = 'http://localhost:4000/api/v1';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(mockAccessToken);
  });

  describe('startAnalysis', () => {
    it('should start analysis successfully', async () => {
      const mockResponse: StartAnalysisResponse = {
        conversationId: 'conv-123',
        message: "Hello! Let's analyze the student.",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await analysisClient.startAnalysis('student-1', 'John Doe');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/analysis/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAccessToken}`,
        },
        body: JSON.stringify({
          studentId: 'student-1',
          studentName: 'John Doe',
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should start analysis without student name', async () => {
      const mockResponse: StartAnalysisResponse = {
        conversationId: 'conv-123',
        message: 'Hello!',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      await analysisClient.startAnalysis('student-1');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/analysis/start`,
        expect.objectContaining({
          body: JSON.stringify({
            studentId: 'student-1',
          }),
        })
      );
    });
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const mockResponse: ChatResponse = {
        message: 'AI response',
        isComplete: false,
        metadata: {
          questionCount: 2,
          messageCount: 5,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await analysisClient.sendMessage('conv-123', 'User message');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/analysis/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAccessToken}`,
        },
        body: JSON.stringify({
          conversationId: 'conv-123',
          message: 'User message',
        }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('completeAnalysis', () => {
    it('should complete analysis successfully', async () => {
      const mockResponse: CompleteAnalysisResponse = {
        analysisId: 'analysis-42',
        studentId: 'student-1',
        completedAt: '2026-01-04T19:30:00.000Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await analysisClient.completeAnalysis('conv-123');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/analysis/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAccessToken}`,
        },
        body: JSON.stringify({
          conversationId: 'conv-123',
        }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAnalysis', () => {
    it('should get analysis by ID successfully', async () => {
      const mockResponse: Analysis = {
        id: 'analysis-42',
        studentId: 'student-1',
        analysis: '# Analysis content',
        createdAt: '2026-01-04T19:30:00.000Z',
        createdBy: 'teacher-1',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await analysisClient.getAnalysis('analysis-42');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/analysis/analysis-42`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAccessToken}`,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getStudentAnalyses', () => {
    it('should get all analyses for a student', async () => {
      const mockResponse: Analysis[] = [
        {
          id: 'analysis-1',
          studentId: 'student-1',
          analysis: 'Analysis 1',
          createdAt: '2026-01-04T19:30:00.000Z',
          createdBy: 'teacher-1',
        },
        {
          id: 'analysis-2',
          studentId: 'student-1',
          analysis: 'Analysis 2',
          createdAt: '2026-01-05T19:30:00.000Z',
          createdBy: 'teacher-1',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await analysisClient.getStudentAnalyses('student-1');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/analysis/student/student-1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAccessToken}`,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLatestAnalysis', () => {
    it('should get latest analysis for a student', async () => {
      const mockResponse: Analysis = {
        id: 'analysis-42',
        studentId: 'student-1',
        analysis: 'Latest analysis',
        createdAt: '2026-01-04T19:30:00.000Z',
        createdBy: 'teacher-1',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await analysisClient.getLatestAnalysis('student-1');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/analysis/student/student-1/latest`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockAccessToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return null when no analysis exists', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => null,
      });

      const result = await analysisClient.getLatestAnalysis('student-1');

      expect(result).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle 401 Unauthorized errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(analysisClient.startAnalysis('student-1')).rejects.toThrow(
        'Session expired. Please log in again.'
      );

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(window.location.href).toBe('/login?session=expired');
    });

    it('should handle 429 Rate Limit errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      await expect(analysisClient.sendMessage('conv-123', 'message')).rejects.toThrow(
        'Too many requests. Please slow down and try again.'
      );
    });

    it('should handle 500 Server errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(analysisClient.completeAnalysis('conv-123')).rejects.toThrow(
        'Server error. Please try again later.'
      );
    });

    it('should handle validation errors with error message', async () => {
      const errorMessage = 'Message is too long';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: errorMessage }),
      });

      await expect(analysisClient.sendMessage('conv-123', 'x'.repeat(10000))).rejects.toThrow(
        errorMessage
      );
    });

    it('should handle validation errors without error message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      await expect(analysisClient.sendMessage('conv-123', 'message')).rejects.toThrow('HTTP 400');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(analysisClient.startAnalysis('student-1')).rejects.toThrow(
        'Network error. Please check your connection and ensure the backend is running.'
      );
    });

    it('should handle generic fetch errors', async () => {
      const error = new Error('Unknown error');
      (global.fetch as jest.Mock).mockRejectedValueOnce(error);

      await expect(analysisClient.startAnalysis('student-1')).rejects.toThrow('Unknown error');
    });
  });

  describe('Authentication', () => {
    it('should send request without token if not logged in', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ conversationId: 'conv-123', message: 'Hello' }),
      });

      await analysisClient.startAnalysis('student-1');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].headers).not.toHaveProperty('Authorization');
    });

    it('should include Authorization header when token exists', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ conversationId: 'conv-123', message: 'Hello' }),
      });

      await analysisClient.startAnalysis('student-1');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe(`Bearer ${mockAccessToken}`);
    });
  });
});
