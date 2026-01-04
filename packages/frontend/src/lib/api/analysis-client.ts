/**
 * API Client for Analysis Endpoints
 * Handles communication with NestJS backend for student analysis operations
 */

import {
  Analysis,
  ChatMessageDto,
  ChatResponse,
  CompleteAnalysisDto,
  CompleteAnalysisResponse,
  StartAnalysisDto,
  StartAnalysisResponse,
} from '@/types/analysis';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

/**
 * Get access token from localStorage
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle authentication errors
    if (response.status === 401) {
      // Clear tokens and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login?session=expired';
      }
      throw new Error('Session expired. Please log in again.');
    }

    // Handle rate limiting
    if (response.status === 429) {
      throw new Error('Too many requests. Please slow down and try again.');
    }

    // Handle server errors
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    // Handle validation errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Network error. Please check your connection and ensure the backend is running.'
      );
    }
    throw error;
  }
}

/**
 * Analysis API Client
 */
export const analysisClient = {
  /**
   * Start a new analysis conversation for a student
   */
  async startAnalysis(
    studentId: string,
    studentName?: string
  ): Promise<StartAnalysisResponse> {
    const dto: StartAnalysisDto = { studentId, studentName };
    return apiRequest<StartAnalysisResponse>('/analysis/start', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Send a message in an ongoing analysis conversation
   */
  async sendMessage(
    conversationId: string,
    message: string
  ): Promise<ChatResponse> {
    const dto: ChatMessageDto = { conversationId, message };
    return apiRequest<ChatResponse>('/analysis/chat', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Complete an analysis and generate the final report
   */
  async completeAnalysis(
    conversationId: string
  ): Promise<CompleteAnalysisResponse> {
    const dto: CompleteAnalysisDto = { conversationId };
    return apiRequest<CompleteAnalysisResponse>('/analysis/complete', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Get a specific analysis by ID
   */
  async getAnalysis(analysisId: string): Promise<Analysis> {
    return apiRequest<Analysis>(`/analysis/${analysisId}`, {
      method: 'GET',
    });
  },

  /**
   * Get all analyses for a specific student
   */
  async getStudentAnalyses(studentId: string): Promise<Analysis[]> {
    return apiRequest<Analysis[]>(`/analysis/student/${studentId}`, {
      method: 'GET',
    });
  },

  /**
   * Get the latest analysis for a specific student
   */
  async getLatestAnalysis(studentId: string): Promise<Analysis | null> {
    return apiRequest<Analysis | null>(
      `/analysis/student/${studentId}/latest`,
      {
        method: 'GET',
      }
    );
  },
};
