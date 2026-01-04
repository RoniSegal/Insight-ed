import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import React from 'react';

import { AnalysisResult } from '@/components/chat/AnalysisResult';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { MessageList } from '@/components/chat/MessageList';

jest.mock('next/navigation');

describe('Chat Components', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  describe('ChatHeader', () => {
    it('should render with student name', () => {
      render(<ChatHeader studentName="John Doe" />);
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    it('should call router.back when back button clicked', async () => {
      render(<ChatHeader studentName="John Doe" />);
      const backButton = screen.getByLabelText('חזרה');
      await userEvent.click(backButton);
      expect(mockBack).toHaveBeenCalled();
    });

    it('should show complete button when showCompleteButton is true', () => {
      const mockComplete = jest.fn();
      render(<ChatHeader studentName="John" onComplete={mockComplete} showCompleteButton />);
      expect(screen.getByText(/סיים ניתוח/)).toBeInTheDocument();
    });

    it('should not show complete button when showCompleteButton is false', () => {
      render(<ChatHeader studentName="John" showCompleteButton={false} />);
      expect(screen.queryByText(/סיים ניתוח/)).not.toBeInTheDocument();
    });

    it('should call onComplete when complete button clicked', async () => {
      const mockComplete = jest.fn();
      render(<ChatHeader studentName="John" onComplete={mockComplete} />);
      const completeButton = screen.getByText(/סיים ניתוח/);
      await userEvent.click(completeButton);
      expect(mockComplete).toHaveBeenCalled();
    });

    it('should show loading state when completing', () => {
      render(<ChatHeader studentName="John" onComplete={jest.fn()} completingAnalysis />);
      expect(screen.getByText(/משלים ניתוח/)).toBeInTheDocument();
    });
  });

  describe('ChatMessage', () => {
    const userMessage = {
      id: '1',
      role: 'user' as const,
      content: 'User message',
      timestamp: new Date('2024-01-01T10:00:00'),
    };

    const assistantMessage = {
      id: '2',
      role: 'assistant' as const,
      content: 'Assistant message',
      timestamp: new Date('2024-01-01T10:01:00'),
    };

    it('should render user message', () => {
      render(<ChatMessage message={userMessage} />);
      expect(screen.getByText('User message')).toBeInTheDocument();
    });

    it('should render assistant message', () => {
      render(<ChatMessage message={assistantMessage} />);
      expect(screen.getByText('Assistant message')).toBeInTheDocument();
    });

    it('should format timestamp', () => {
      render(<ChatMessage message={userMessage} />);
      expect(screen.getByText(/10:00/)).toBeInTheDocument();
    });
  });

  describe('MessageBubble', () => {
    const userMessage = {
      id: '1',
      role: 'user' as const,
      content: 'Test message',
      timestamp: new Date(),
    };

    it('should render message content', () => {
      render(<MessageBubble message={userMessage} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  describe('MessageList', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Message 1', timestamp: new Date() },
      { id: '2', role: 'assistant' as const, content: 'Message 2', timestamp: new Date() },
    ];

    it('should render all messages', () => {
      render(<MessageList messages={messages} loading={false} />);
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
    });

    it('should show loading indicator when loading', () => {
      render(<MessageList messages={[]} loading />);
      expect(screen.getByText(/AI חושב/)).toBeInTheDocument();
    });
  });

  describe('ChatInput', () => {
    it('should render input field', () => {
      render(<ChatInput onSend={jest.fn()} disabled={false} />);
      expect(screen.getByPlaceholderText(/הקלד הודעה/)).toBeInTheDocument();
    });

    it('should call onSend when send button clicked', async () => {
      const mockSend = jest.fn();
      render(<ChatInput onSend={mockSend} disabled={false} />);

      const input = screen.getByPlaceholderText(/הקלד הודעה/);
      await userEvent.type(input, 'Test message');

      const sendButton = screen.getByLabelText(/שלח הודעה/);
      await userEvent.click(sendButton);

      expect(mockSend).toHaveBeenCalledWith('Test message');
    });

    it('should disable input when disabled prop is true', () => {
      render(<ChatInput onSend={jest.fn()} disabled />);
      expect(screen.getByPlaceholderText(/הקלד הודעה/)).toBeDisabled();
    });

    it('should clear input after sending', async () => {
      render(<ChatInput onSend={jest.fn()} disabled={false} />);

      const input = screen.getByPlaceholderText(/הקלד הודעה/) as HTMLInputElement;
      await userEvent.type(input, 'Test');
      await userEvent.click(screen.getByLabelText(/שלח הודעה/));

      expect(input.value).toBe('');
    });
  });

  describe('AnalysisResult', () => {
    const mockAnalysis = 'This is the analysis text for the student.';

    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });
    });

    it('should render analysis result', () => {
      render(<AnalysisResult analysis={mockAnalysis} studentName="John" />);
      expect(screen.getByText(/ניתוח מלא/)).toBeInTheDocument();
    });

    it('should display analysis text', () => {
      render(<AnalysisResult analysis={mockAnalysis} studentName="John" />);
      expect(screen.getByText(mockAnalysis)).toBeInTheDocument();
    });

    it('should have copy button', () => {
      render(<AnalysisResult analysis={mockAnalysis} studentName="John" />);
      expect(screen.getByText('העתק')).toBeInTheDocument();
    });

    it('should have download button', () => {
      render(<AnalysisResult analysis={mockAnalysis} studentName="John" />);
      expect(screen.getByText('הורד כקובץ')).toBeInTheDocument();
    });
  });
});
