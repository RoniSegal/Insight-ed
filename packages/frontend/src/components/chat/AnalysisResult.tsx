import React, { useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface AnalysisResultProps {
  analysis: string;
  studentName: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, studentName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([analysis], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ניתוח-${studentName}-${new Date().toLocaleDateString('he-IL')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <Card variant="elevated" padding="spacious">
        <CardHeader
          title="ניתוח מלא - הושלם בהצלחה!"
          description={`ניתוח עבור ${studentName}`}
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? 'הועתק!' : 'העתק'}
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownload}>
                הורד כקובץ
              </Button>
            </div>
          }
        />

        <CardContent>
          {copied && (
            <Alert variant="success" className="mb-4">
              הניתוח הועתק ללוח
            </Alert>
          )}

          <div className="prose prose-neutral max-w-none text-right" style={{ direction: 'rtl' }}>
            <div className="whitespace-pre-wrap font-sans leading-relaxed">{analysis}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
