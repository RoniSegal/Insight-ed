'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface ResultsContentProps {
  analysis: string;
  className?: string;
}

/**
 * Content component for displaying analysis results
 * Renders Hebrew markdown analysis with proper RTL formatting
 */
export const ResultsContent: React.FC<ResultsContentProps> = ({
  analysis,
  className,
}) => {
  return (
    <Card variant="elevated" padding="spacious" className={className}>
      <CardContent>
        <div
          className={cn(
            'prose prose-neutral max-w-none',
            'prose-headings:text-neutral-900 prose-headings:font-bold',
            'prose-h1:text-3xl prose-h1:mb-6',
            'prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4',
            'prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3',
            'prose-p:text-neutral-700 prose-p:leading-relaxed',
            'prose-ul:list-disc prose-ul:pe-6 prose-ul:ps-0',
            'prose-ol:list-decimal prose-ol:pe-6 prose-ol:ps-0',
            'prose-li:text-neutral-700 prose-li:my-1',
            'prose-strong:text-neutral-900 prose-strong:font-semibold',
            'prose-blockquote:border-s-4 prose-blockquote:border-primary-500',
            'prose-blockquote:ps-4 prose-blockquote:pe-0',
            'prose-blockquote:italic prose-blockquote:text-neutral-600'
          )}
          dir="rtl"
        >
          <ReactMarkdown
            components={{
              // Custom heading renderer to preserve emojis
              h1: ({ children, ...props }) => (
                <h1 {...props} className="flex items-center gap-2">
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 {...props} className="flex items-center gap-2">
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 {...props} className="flex items-center gap-2">
                  {children}
                </h3>
              ),
              // Custom list item renderer for better RTL support
              ul: ({ children, ...props }) => (
                <ul {...props} className="list-disc pe-6 ps-0 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol {...props} className="list-decimal pe-6 ps-0 space-y-1">
                  {children}
                </ol>
              ),
            }}
          >
            {analysis}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};
