/**
 * Component tests for Chat Page
 * Tests the integration with the backend analysis API client
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import ChatPage from '@/app/students/[id]/chat/page';
import { analysisClient } from '@/lib/api/analysis-client';
import { ApiClient } from '@/lib/api-client';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/lib/api-client');
jest.mock('@/lib/api/analysis-client');

// Mock ProtectedRoute to render children directly
jest.mock('@/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(7),
  },
});

describe('ChatPage', () => {
  const mockPush = jest.fn();
  const mockStudentId = 'student-123';
  const mockStudentName = 'John Doe';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock useParams
    (useParams as jest.Mock).mockReturnValue({
      id: mockStudentId,
    });

    // Mock ApiClient.get for student info
    (ApiClient.get as jest.Mock).mockResolvedValue({
      name: mockStudentName,
    });

    // Mock analysisClient.startAnalysis
    (analysisClient.startAnalysis as jest.Mock).mockResolvedValue({
      conversationId: 'conv-123',
      message: 'שלום! בואו ננתח את John Doe.',
    });
  });

  describe('Initial Load', () => {
    it('should show loading state initially', () => {
      render(<ChatPage />);
      expect(screen.getByText(/מתחיל שיחה/)).toBeInTheDocument();
    });

    it('should fetch student info and start analysis on mount', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(ApiClient.get).toHaveBeenCalledWith(`/students/${mockStudentId}`);
        expect(analysisClient.startAnalysis).toHaveBeenCalledWith(
          mockStudentId,
          mockStudentName
        );
      });
    });

    it('should display first AI message after initialization', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText(/שלום! בואו ננתח את John Doe/)).toBeInTheDocument();
      });
    });

    it('should display student name in header', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText(/ניתוח למידה:/)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`ניתוח למידה:.*${mockStudentName}`))).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling - Initialization', () => {
    it('should show error when student fetch fails', async () => {
      (ApiClient.get as jest.Mock).mockRejectedValue(
        new Error('Student not found')
      );

      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText(/Student not found/)).toBeInTheDocument();
      });
    });

    it('should show error when analysis start fails', async () => {
      (analysisClient.startAnalysis as jest.Mock).mockRejectedValue(
        new Error('Failed to start conversation')
      );

      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to start conversation/)).toBeInTheDocument();
      });
    });

    it('should show network error message', async () => {
      (analysisClient.startAnalysis as jest.Mock).mockRejectedValue(
        new Error('Network error. Please check your connection')
      );

      render(<ChatPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/Network error. Please check your connection/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Sending Messages', () => {
    beforeEach(async () => {
      (analysisClient.sendMessage as jest.Mock).mockResolvedValue({
        message: 'AI response message',
        isComplete: false,
        metadata: { questionCount: 2, messageCount: 5 },
      });

      render(<ChatPage />);

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByText(/שלום! בואו ננתח/)).toBeInTheDocument();
      });
    });

    it('should send message and display response', async () => {
      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      await userEvent.type(input, 'התלמיד מצטיין במתמטיקה');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(analysisClient.sendMessage).toHaveBeenCalledWith(
          'conv-123',
          'התלמיד מצטיין במתמטיקה'
        );
      });

      await waitFor(() => {
        expect(screen.getByText('AI response message')).toBeInTheDocument();
      });
    });

    it('should show loading indicator while sending', async () => {
      // Mock slow response
      (analysisClient.sendMessage as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          message: 'Response',
          isComplete: false,
          metadata: { questionCount: 2, messageCount: 5 },
        }), 100))
      );

      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      await userEvent.type(input, 'Test message');
      await userEvent.click(sendButton);

      // Should show typing indicator
      await waitFor(() => {
        expect(screen.getByText(/מקליד/)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByText(/מקליד/)).not.toBeInTheDocument();
      });
    });

    it('should disable input while sending', async () => {
      // Mock slow response
      (analysisClient.sendMessage as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          message: 'Response',
          isComplete: false,
          metadata: { questionCount: 2, messageCount: 5 },
        }), 100))
      );

      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      await userEvent.type(input, 'Test');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(input).toBeDisabled();
      });

      await waitFor(() => {
        expect(input).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling - Sending Messages', () => {
    beforeEach(async () => {
      render(<ChatPage />);
      await waitFor(() => {
        expect(screen.getByText(/שלום! בואו ננתח/)).toBeInTheDocument();
      });
    });

    it('should show error when message send fails', async () => {
      (analysisClient.sendMessage as jest.Mock).mockRejectedValue(
        new Error('Failed to send message')
      );

      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      await userEvent.type(input, 'Test message');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to send message/)).toBeInTheDocument();
      });
    });

    it('should remove user message on error', async () => {
      (analysisClient.sendMessage as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      const userMessage = 'This should be removed';
      await userEvent.type(input, userMessage);

      // User message appears when we click send
      await userEvent.click(sendButton);

      // Wait for the error to be handled and message removed
      await waitFor(() => {
        expect(screen.queryByText(userMessage)).not.toBeInTheDocument();
      });

      // Error should be displayed
      await waitFor(() => {
        expect(screen.getByText(/API Error/)).toBeInTheDocument();
      });
    });

    it('should show rate limit error', async () => {
      (analysisClient.sendMessage as jest.Mock).mockRejectedValue(
        new Error('Too many requests. Please slow down and try again.')
      );

      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      await userEvent.type(input, 'Message');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Too many requests. Please slow down/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Completing Analysis', () => {
    beforeEach(async () => {
      (analysisClient.sendMessage as jest.Mock).mockResolvedValue({
        message: 'Response',
        isComplete: false,
        metadata: { questionCount: 3, messageCount: 7 },
      });

      (analysisClient.completeAnalysis as jest.Mock).mockResolvedValue({
        analysisId: 'analysis-42',
        studentId: mockStudentId,
        completedAt: '2026-01-04T19:30:00.000Z',
      });

      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText(/שלום! בואו ננתח/)).toBeInTheDocument();
      });

      // Send enough messages to show complete button (4+ messages)
      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      for (let i = 0; i < 3; i++) {
        await userEvent.type(input, `Message ${i}`);
        await userEvent.click(sendButton);
        await waitFor(() => expect(analysisClient.sendMessage).toHaveBeenCalled());
      }
    });

    it('should show complete button after enough messages', async () => {
      await waitFor(() => {
        expect(screen.getByText(/סיים ניתוח/)).toBeInTheDocument();
      });
    });

    it('should complete analysis and navigate to results', async () => {
      const completeButton = await screen.findByText(/סיים ניתוח/);
      await userEvent.click(completeButton);

      await waitFor(() => {
        expect(analysisClient.completeAnalysis).toHaveBeenCalledWith('conv-123');
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/results/analysis-42');
      });
    });

    it('should show loading state while completing', async () => {
      const completeButton = await screen.findByText(/סיים ניתוח/);
      await userEvent.click(completeButton);

      expect(screen.getByText(/משלים ניתוח/)).toBeInTheDocument();
    });

    it('should disable input while completing analysis', async () => {
      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const completeButton = await screen.findByText(/סיים ניתוח/);

      await userEvent.click(completeButton);

      expect(input).toBeDisabled();
    });
  });

  describe('Error Handling - Complete Analysis', () => {
    beforeEach(async () => {
      render(<ChatPage />);
      await waitFor(() => {
        expect(screen.getByText(/שלום! בואו ננתח/)).toBeInTheDocument();
      });
    });

    it('should show error when complete analysis fails', async () => {
      (analysisClient.completeAnalysis as jest.Mock).mockRejectedValue(
        new Error('Failed to complete analysis')
      );

      // Mock enough messages to show complete button
      const sendMessage = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      (analysisClient.sendMessage as jest.Mock).mockResolvedValue({
        message: 'Response',
        isComplete: false,
        metadata: { questionCount: 3, messageCount: 7 },
      });

      for (let i = 0; i < 3; i++) {
        await userEvent.type(sendMessage, `Message ${i}`);
        await userEvent.click(sendButton);
      }

      const completeButton = await screen.findByText(/סיים ניתוח/);
      await userEvent.click(completeButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to complete analysis/)).toBeInTheDocument();
      });
    });

    it('should show server error on complete', async () => {
      (analysisClient.completeAnalysis as jest.Mock).mockRejectedValue(
        new Error('Server error. Please try again later.')
      );

      // Create enough messages
      (analysisClient.sendMessage as jest.Mock).mockResolvedValue({
        message: 'Response',
        isComplete: false,
        metadata: { questionCount: 3, messageCount: 7 },
      });

      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      const sendButton = screen.getByLabelText(/שלח הודעה/);

      for (let i = 0; i < 3; i++) {
        await userEvent.type(input, `Msg ${i}`);
        await userEvent.click(sendButton);
      }

      const completeButton = await screen.findByText(/סיים ניתוח/);
      await userEvent.click(completeButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Server error. Please try again later/)
        ).toBeInTheDocument();
      });
    });
  });
});
