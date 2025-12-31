'use client';

import { memo } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-slideIn`}>
      <div
        className={`max-w-[80%] rounded-lg px-5 py-3.5 shadow-sm transition-all hover:shadow-md ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-neutral-100 text-neutral-900 rounded-bl-none'
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-primary-100' : 'text-neutral-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
});
