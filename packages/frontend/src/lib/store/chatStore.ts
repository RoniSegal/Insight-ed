import { create } from 'zustand';

import { ApiClient } from '../api-client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  analysisComplete: boolean;
  analysisResult: string | null;

  // Actions
  sendMessage: (content: string, studentId: string) => Promise<void>;
  completeAnalysis: (studentId: string) => Promise<void>;
  resetChat: () => void;
  setInitialMessage: (studentName: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  analysisComplete: false,
  analysisResult: null,

  setInitialMessage: (studentName: string) => {
    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `שלום! אני כאן כדי לעזור לך לנתח את ${studentName}. בוא/י נתחיל עם השאלות הבסיסיות:\n\nמה שמת/ה לב לגבי הביצועים האקדמיים שלו/ה לאחרונה?`,
      timestamp: new Date(),
    };
    set({ messages: [initialMessage] });
  },

  sendMessage: async (content: string, studentId: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      loading: true,
      error: null,
    }));

    try {
      // Call backend API for chat
      const response: any = await ApiClient.post('/chat', {
        studentId,
        message: content,
        conversationHistory: get().messages,
      });

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        loading: false,
      }));
    } catch (error: any) {
      console.error('Failed to send message:', error);
      set({
        loading: false,
        error: error.message || 'Failed to send message',
      });
    }
  },

  completeAnalysis: async (studentId: string) => {
    set({ loading: true, error: null });

    try {
      // Request final analysis
      const response: any = await ApiClient.post('/analysis/complete', {
        studentId,
        conversationHistory: get().messages,
      });

      set({
        analysisComplete: true,
        analysisResult: response.analysis,
        loading: false,
      });
    } catch (error: any) {
      console.error('Failed to complete analysis:', error);
      set({
        loading: false,
        error: error.message || 'Failed to complete analysis',
      });
    }
  },

  resetChat: () => {
    set({
      messages: [],
      loading: false,
      error: null,
      analysisComplete: false,
      analysisResult: null,
    });
  },
}));
