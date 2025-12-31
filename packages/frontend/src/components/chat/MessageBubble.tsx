import React from 'react';

import type { Message } from '@/lib/store/chatStore';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex',
        isUser ? 'justify-start' : 'justify-end',
        'mb-4'
      )}
      dir="rtl"
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-lg',
          isUser
            ? 'bg-primary-600 text-white rounded-br-sm'
            : 'bg-white text-neutral-800 shadow-sm border border-neutral-200 rounded-bl-sm'
        )}
      >
        <p className="whitespace-pre-wrap text-right leading-relaxed">
          {message.content}
        </p>
        <p
          className={cn(
            'text-xs mt-2 text-left',
            isUser ? 'text-primary-100' : 'text-neutral-500'
          )}
          dir="ltr"
        >
          {new Date(message.timestamp).toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
