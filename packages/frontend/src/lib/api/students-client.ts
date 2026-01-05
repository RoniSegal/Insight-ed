/**
 * API Client for Students Endpoints
 * Handles communication with NestJS backend for student CRUD operations
 */

import type { Student } from '@growth-engine/shared';

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
 * Students API Client
 */
export const studentsClient = {
  /**
   * Get all students
   */
  async getStudents(): Promise<{ students: Student[] }> {
    return apiRequest<{ students: Student[] }>('/students', {
      method: 'GET',
    });
  },

  /**
   * Get a specific student by ID
   */
  async getStudent(id: string): Promise<{ student: Student }> {
    return apiRequest<{ student: Student }>(`/students/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new student
   */
  async createStudent(data: {
    name: string;
    grade: string;
    class?: string;
  }): Promise<{ student: Student }> {
    return apiRequest<{ student: Student }>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing student
   */
  async updateStudent(
    id: string,
    data: { name?: string; grade?: string; class?: string }
  ): Promise<{ student: Student }> {
    return apiRequest<{ student: Student }>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a student
   */
  async deleteStudent(id: string): Promise<{ success: true }> {
    return apiRequest<{ success: true }>(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};
