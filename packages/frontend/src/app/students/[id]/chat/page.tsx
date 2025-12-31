'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage, type Message } from '@/components/chat/ChatMessage';
import { Alert } from '@/components/ui/Alert';
import { LoadingContent } from '@/components/ui/Spinner';
import { ApiClient } from '@/lib/api-client';


export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  );
}

function ChatPageContent() {
  const { id: studentId } = useParams();
  const router = useRouter();

  const [studentName, setStudentName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [completingAnalysis, setCompletingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation on mount
  useEffect(() => {
    initializeChat();
  }, [studentId]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch student info
      const student = await ApiClient.get(`/students/${studentId}`);
      setStudentName(student.name);

      // Start conversation - get first AI message
      const response = await ApiClient.post('/analysis/start', {
        studentId,
      });

      setConversationId(response.conversationId);

      // Add first AI message
      if (response.message) {
        const firstMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        };
        setMessages([firstMessage]);
      }
    } catch (err: any) {
      console.error('Failed to initialize chat:', err);
      setError(err.message || 'Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversationId) {
      setError('No active conversation');
      return;
    }

    // Add user message immediately
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    setError(null);

    try {
      // Send to API
      const response = await ApiClient.post('/analysis/chat', {
        conversationId,
        message: content,
      });

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message. Please try again.');

      // Remove user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const completeAnalysis = async () => {
    if (!conversationId) {
      setError('No active conversation');
      return;
    }

    if (messages.length < 6) {
      const confirmed = confirm(
        'נראה שהשיחה קצרה. האם אתה בטוח שברצונך לסיים את הניתוח?'
      );
      if (!confirmed) return;
    }

    setCompletingAnalysis(true);
    setError(null);

    try {
      const response = await ApiClient.post('/analysis/complete', {
        conversationId,
      });

      // Navigate to results page with analysisId from response
      router.push(`/results/${response.analysisId}`);
    } catch (err: any) {
      console.error('Failed to complete analysis:', err);
      setError(err.message || 'Failed to complete analysis');
      setCompletingAnalysis(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <LoadingContent message="מתחיל שיחה..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-50" dir="rtl">
      {/* Header */}
      <ChatHeader
        studentName={studentName}
        onComplete={completeAnalysis}
        showCompleteButton={messages.length >= 4}
        completingAnalysis={completingAnalysis}
      />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Error alert */}
          {error && (
            <div className="mb-6 animate-fadeIn">
              <Alert
                variant="error"
                dismissible
                onDismiss={() => setError(null)}
                title="אירעה שגיאה"
              >
                {error}
              </Alert>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {sending && (
            <div className="flex justify-start mb-4 animate-fadeIn">
              <div className="bg-neutral-100 rounded-lg px-5 py-4 rounded-bl-none shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s] [animation-duration:1.4s]"></span>
                    <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s] [animation-duration:1.4s]"></span>
                    <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce [animation-duration:1.4s]"></span>
                  </div>
                  <span className="text-sm text-neutral-600 mr-2">מקליד...</span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={sending || completingAnalysis} />
    </div>
  );
}
