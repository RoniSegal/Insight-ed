'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store/chatStore';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { AnalysisResult } from '@/components/chat/AnalysisResult';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ApiClient } from '@/lib/api-client';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  class: string;
}

export default function AnalyzePage({ params }: { params: { studentId: string } }) {
  return (
    <ProtectedRoute allowedRoles={['TEACHER', 'PRINCIPAL']}>
      <ChatInterface studentId={params.studentId} />
    </ProtectedRoute>
  );
}

function ChatInterface({ studentId }: { studentId: string }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const router = useRouter();

  const {
    messages,
    loading,
    error,
    analysisComplete,
    analysisResult,
    sendMessage,
    completeAnalysis,
    resetChat,
    setInitialMessage,
  } = useChatStore();

  // Fetch student info
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response: any = await ApiClient.get(`/students/${studentId}`);
        setStudent(response);
        setLoadingStudent(false);
      } catch (error) {
        console.error('Failed to fetch student:', error);
        setLoadingStudent(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (student && messages.length === 0) {
      const studentName = `${student.firstName} ${student.lastName}`;
      setInitialMessage(studentName);
    }
  }, [student, messages.length, setInitialMessage]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, studentId);
  };

  const handleCompleteAnalysis = async () => {
    if (messages.length < 6) {
      const confirmed = window.confirm(
        'הניתוח נראה קצר. האם אתה בטוח שברצונך להשלים? (מומלץ לפחות 6 הודעות)'
      );
      if (!confirmed) return;
    }

    await completeAnalysis(studentId);
  };

  const handleBackToStudents = () => {
    router.push('/students');
  };

  const handleNewAnalysis = () => {
    resetChat();
    if (student) {
      const studentName = `${student.firstName} ${student.lastName}`;
      setInitialMessage(studentName);
    }
  };

  if (loadingStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">טוען פרטי תלמיד...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert variant="error" title="שגיאה">
          לא נמצא תלמיד עם מזהה זה.{' '}
          <button
            onClick={handleBackToStudents}
            className="underline font-semibold"
          >
            חזרה לרשימת תלמידים
          </button>
        </Alert>
      </div>
    );
  }

  const studentFullName = `${student.firstName} ${student.lastName}`;

  // Show analysis result if complete
  if (analysisComplete && analysisResult) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <header className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-right" dir="rtl">
                <h1 className="text-2xl font-bold text-neutral-800">
                  ניתוח הושלם בהצלחה!
                </h1>
                <p className="text-neutral-600 mt-1">
                  {studentFullName} - כיתה {student.grade}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleNewAnalysis}>
                  ניתוח חדש
                </Button>
                <Button variant="ghost" onClick={handleBackToStudents}>
                  חזרה לתלמידים
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="py-8">
          <AnalysisResult analysis={analysisResult} studentName={studentFullName} />
        </main>
      </div>
    );
  }

  // Show chat interface
  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-right" dir="rtl">
              <h1 className="text-2xl font-bold text-neutral-800">ניתוח תלמיד</h1>
              <p className="text-neutral-600 mt-1">
                {studentFullName} - כיתה {student.grade} - {student.class}
              </p>
            </div>
            <Button variant="ghost" onClick={handleBackToStudents}>
              ← חזרה לתלמידים
            </Button>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="px-6 pt-4">
          <div className="max-w-4xl mx-auto">
            <Alert variant="error" dismissible onDismiss={() => useChatStore.setState({ error: null })}>
              {error}
            </Alert>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <MessageList messages={messages} loading={loading} />

      {/* Input Area */}
      <div className="border-t border-neutral-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Complete Analysis Button */}
          {messages.length >= 6 && !analysisComplete && (
            <div className="mb-4">
              <Button
                onClick={handleCompleteAnalysis}
                disabled={loading}
                variant="success"
                fullWidth
                size="lg"
              >
                השלם ניתוח וצפה בתוצאות
              </Button>
            </div>
          )}

          {/* Chat Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={loading}
            placeholder="הקלד/י את התצפיות שלך על התלמיד/ה..."
          />

          {/* Helper Text */}
          <div className="mt-3 text-center text-xs text-neutral-500" dir="rtl">
            {messages.length < 6
              ? `עונה על השאלות של ה-AI. ${6 - messages.length} הודעות נוספות עד אפשרות להשלים`
              : 'ניתן להשלים את הניתוח או להמשיך לשוחח'}
          </div>
        </div>
      </div>
    </div>
  );
}
