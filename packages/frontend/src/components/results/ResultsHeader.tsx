import React from 'react';

import { cn } from '@/lib/utils';

export interface ResultsHeaderProps {
  studentName: string;
  completedAt: string;
  className?: string;
}

/**
 * Header component for analysis results page
 * Displays student name and analysis completion timestamp
 */
export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  studentName,
  completedAt,
  className,
}) => {
  const formattedDate = new Date(completedAt).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">ניתוח למידה - {studentName}</h1>
          <p className="text-neutral-600 flex items-center gap-2">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
            <span>הושלם ב-{formattedDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
