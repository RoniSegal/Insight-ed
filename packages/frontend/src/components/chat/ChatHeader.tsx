'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface ChatHeaderProps {
  studentName: string;
  onComplete?: () => void;
  showCompleteButton?: boolean;
  completingAnalysis?: boolean;
}

export function ChatHeader({
  studentName,
  onComplete,
  showCompleteButton = true,
  completingAnalysis = false,
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b border-neutral-200 bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Back button + student name */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => router.back()}
              className="flex-shrink-0 text-neutral-600 hover:text-neutral-900 transition-all p-2 hover:bg-neutral-100 rounded-lg active:scale-95"
              aria-label="חזרה"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-neutral-900 truncate">
                ניתוח למידה: {studentName}
              </h1>
              <p className="text-sm text-neutral-600 hidden sm:block">
                שוחח עם המערכת כדי לנתח את התלמיד
              </p>
            </div>
          </div>

          {/* Complete analysis button */}
          {showCompleteButton && onComplete && (
            <Button
              onClick={onComplete}
              variant="success"
              size="md"
              loading={completingAnalysis}
              disabled={completingAnalysis}
              className="flex-shrink-0"
            >
              {completingAnalysis ? 'משלים ניתוח...' : 'סיים ניתוח'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
