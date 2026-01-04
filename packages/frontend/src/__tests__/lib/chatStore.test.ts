import { renderHook, act } from '@testing-library/react';

import { ApiClient } from '@/lib/api-client';
import { useChatStore } from '@/lib/store/chatStore';

jest.mock('@/lib/api-client');

describe('useChatStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useChatStore.setState({
      messages: [],
      loading: false,
      error: null,
      analysisComplete: false,
      analysisResult: null,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useChatStore());

      expect(result.current.messages).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.analysisComplete).toBe(false);
      expect(result.current.analysisResult).toBeNull();
    });
  });

  describe('setInitialMessage', () => {
    it('should set initial message with student name', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setInitialMessage('John Doe');
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe('assistant');
      expect(result.current.messages[0].content).toContain('John Doe');
      expect(result.current.messages[0].id).toBe('0');
    });

    it('should create message with timestamp', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setInitialMessage('Jane Smith');
      });

      expect(result.current.messages[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('sendMessage', () => {
    it('should add user message immediately', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        response: 'AI response',
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage('Hello', 'student-123');
      });

      const userMessage = result.current.messages.find((m) => m.role === 'user');
      expect(userMessage).toBeDefined();
      expect(userMessage?.content).toBe('Hello');
    });

    it('should set loading state to false after sending', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        response: 'AI response',
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage('Hello', 'student-123');
      });

      // Check loading is false after response
      expect(result.current.loading).toBe(false);
    });

    it('should add AI response message', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        response: 'AI response here',
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage('Hello', 'student-123');
      });

      const aiMessage = result.current.messages.find((m) => m.role === 'assistant');
      expect(aiMessage).toBeDefined();
      expect(aiMessage?.content).toBe('AI response here');
    });

    it('should call API with correct parameters', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        response: 'AI response',
      });

      const { result } = renderHook(() => useChatStore());

      // Add some existing messages
      act(() => {
        result.current.setInitialMessage('Student');
      });

      await act(async () => {
        await result.current.sendMessage('My message', 'student-456');
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/chat', {
        studentId: 'student-456',
        message: 'My message',
        conversationHistory: expect.arrayContaining([
          expect.objectContaining({ role: 'assistant' }),
          expect.objectContaining({ role: 'user', content: 'My message' }),
        ]),
      });
    });

    it('should handle API error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (ApiClient.post as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage('Hello', 'student-123');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send message:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should set generic error message when error has no message', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (ApiClient.post as jest.Mock).mockRejectedValue({});

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage('Hello', 'student-123');
      });

      expect(result.current.error).toBe('Failed to send message');

      consoleErrorSpy.mockRestore();
    });

    it('should clear error when sending new message', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        response: 'OK',
      });

      const { result } = renderHook(() => useChatStore());

      // Set initial error
      act(() => {
        useChatStore.setState({ error: 'Previous error' });
      });

      await act(async () => {
        await result.current.sendMessage('Hello', 'student-123');
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('completeAnalysis', () => {
    it('should set loading state to false after analysis', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        analysis: 'Analysis result',
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.completeAnalysis('student-123');
      });

      expect(result.current.loading).toBe(false);
    });

    it('should set analysis result on success', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        analysis: 'Complete analysis here',
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.completeAnalysis('student-123');
      });

      expect(result.current.analysisComplete).toBe(true);
      expect(result.current.analysisResult).toBe('Complete analysis here');
    });

    it('should call API with correct parameters', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        analysis: 'Analysis',
      });

      const { result } = renderHook(() => useChatStore());

      // Add messages first
      act(() => {
        result.current.setInitialMessage('Student');
      });

      await act(async () => {
        await result.current.completeAnalysis('student-789');
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/analysis/complete', {
        studentId: 'student-789',
        conversationHistory: expect.arrayContaining([
          expect.objectContaining({ role: 'assistant' }),
        ]),
      });
    });

    it('should handle API error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (ApiClient.post as jest.Mock).mockRejectedValue(new Error('Analysis failed'));

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.completeAnalysis('student-123');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Analysis failed');
      expect(result.current.analysisComplete).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to complete analysis:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should set generic error message when error has no message', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (ApiClient.post as jest.Mock).mockRejectedValue({});

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.completeAnalysis('student-123');
      });

      expect(result.current.error).toBe('Failed to complete analysis');

      consoleErrorSpy.mockRestore();
    });

    it('should clear error when starting analysis', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({
        analysis: 'Result',
      });

      const { result } = renderHook(() => useChatStore());

      // Set initial error
      act(() => {
        useChatStore.setState({ error: 'Previous error' });
      });

      await act(async () => {
        await result.current.completeAnalysis('student-123');
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('resetChat', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useChatStore());

      // Set some state
      act(() => {
        useChatStore.setState({
          messages: [
            {
              id: '1',
              role: 'user',
              content: 'Test',
              timestamp: new Date(),
            },
          ],
          loading: true,
          error: 'Some error',
          analysisComplete: true,
          analysisResult: 'Result',
        });
      });

      // Reset
      act(() => {
        result.current.resetChat();
      });

      expect(result.current.messages).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.analysisComplete).toBe(false);
      expect(result.current.analysisResult).toBeNull();
    });
  });
});
