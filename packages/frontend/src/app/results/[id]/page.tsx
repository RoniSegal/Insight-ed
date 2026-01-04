'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ResultsContent } from '@/components/results/ResultsContent';
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Spinner';
import { ApiClient } from '@/lib/api-client';

interface AnalysisResult {
  id: string;
  studentId: string;
  analysis: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  createdAt: string;
  createdBy: string;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  class?: string;
}

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsPageContent />
    </ProtectedRoute>
  );
}

function ResultsPageContent() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchResults();
  }, [analysisId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analysis by ID
      const response: { analysis: AnalysisResult } = await ApiClient.get(
        `/analysis/by-id/${analysisId}`
      );

      if (!response.analysis) {
        throw new Error('Analysis not found');
      }

      setAnalysisResult(response.analysis);

      // Fetch student details
      try {
        const studentResponse: { student: Student } = await ApiClient.get(
          `/students/${response.analysis.studentId}`
        );
        setStudent(studentResponse.student);
      } catch (err) {
        // If student not found, continue with just the analysis
        console.error('Failed to fetch student details:', err);
      }
    } catch (err: any) {
      console.error('Failed to load results:', err);
      if (err.message.includes('not found') || err.message.includes('404')) {
        setError('ניתוח לא נמצא. אנא ודא שהניתוח הושלם בהצלחה.');
      } else if (err.message.includes('session expired') || err.message.includes('401')) {
        setError('תקופת ההתחברות פגה. אנא התחבר מחדש.');
      } else {
        setError('שגיאה בטעינת תוצאות הניתוח. אנא נסה שוב.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStudents = () => {
    router.push('/students');
  };

  const handleAnalyzeAgain = () => {
    if (analysisResult?.studentId) {
      router.push(`/students/${analysisResult.studentId}/chat`);
    } else {
      router.push('/students');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading state
  if (loading) {
    return <LoadingPage message="טוען תוצאות..." />;
  }

  // Error state
  if (error || !analysisResult) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <Alert variant="error" className="mb-4">
            {error || 'שגיאה בטעינת תוצאות'}
          </Alert>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleBackToStudents} fullWidth>
              חזרה לרשימת התלמידים
            </Button>
            <Button variant="secondary" onClick={() => fetchResults()} fullWidth>
              נסה שוב
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const studentName = student?.name || 'תלמיד/ה';

  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      {/* Print-friendly header - hidden on screen, visible in print */}
      <div className="hidden print:block p-8 bg-white">
        <h1 className="text-2xl font-bold mb-2">ניתוח למידה - {studentName}</h1>
        <p className="text-neutral-600">
          {new Date(analysisResult.createdAt).toLocaleDateString('he-IL')}
        </p>
      </div>

      {/* Screen header - hidden in print */}
      <nav className="bg-white shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToStudents}
                className="text-primary-600 hover:text-primary-700 flex items-center gap-2 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">חזרה לרשימת התלמידים</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                leftIcon={
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0118 8.653v4.097A2.25 2.25 0 0115.75 15h-.241l.305 1.984A1.75 1.75 0 0114.084 19H5.915a1.75 1.75 0 01-1.73-2.016L4.492 15H4.25A2.25 2.25 0 012 12.75V8.653c0-1.082.775-2.034 1.874-2.198.374-.056.75-.107 1.127-.153L5 6.25v-3.5zm8.5 3.397a41.533 41.533 0 00-7 0V2.75a.25.25 0 01.25-.25h6.5a.25.25 0 01.25.25v3.397zM6.608 12.5a.25.25 0 00-.247.212l-.693 4.5a.25.25 0 00.247.288h8.17a.25.25 0 00.246-.288l-.692-4.5a.25.25 0 00-.247-.212H6.608z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                הדפס
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0">
        {/* Header - hidden in print, shown on screen */}
        <div className="print:hidden">
          <ResultsHeader studentName={studentName} completedAt={analysisResult.createdAt} />
        </div>

        {/* Analysis content */}
        <ResultsContent analysis={analysisResult.analysis} />

        {/* Action buttons - hidden in print */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleBackToStudents}
            leftIcon={
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            חזרה לרשימת התלמידים
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyzeAgain}
            leftIcon={
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            ניתוח נוסף
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrint}
            leftIcon={
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0118 8.653v4.097A2.25 2.25 0 0115.75 15h-.241l.305 1.984A1.75 1.75 0 0114.084 19H5.915a1.75 1.75 0 01-1.73-2.016L4.492 15H4.25A2.25 2.25 0 012 12.75V8.653c0-1.082.775-2.034 1.874-2.198.374-.056.75-.107 1.127-.153L5 6.25v-3.5zm8.5 3.397a41.533 41.533 0 00-7 0V2.75a.25.25 0 01.25-.25h6.5a.25.25 0 01.25.25v3.397zM6.608 12.5a.25.25 0 00-.247.212l-.693 4.5a.25.25 0 00.247.288h8.17a.25.25 0 00.246-.288l-.692-4.5a.25.25 0 00-.247-.212H6.608z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            הדפס תוצאות
          </Button>
        </div>
      </main>
    </div>
  );
}
