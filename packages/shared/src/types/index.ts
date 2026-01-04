// User types
export enum UserRole {
  TEACHER = 'TEACHER',
  PRINCIPAL = 'PRINCIPAL',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  MICROSOFT = 'MICROSOFT',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
  firstName: string;
  lastName: string;
  schoolId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Student types
export interface Student {
  id: string;
  name: string;
  grade: string;
  class?: string;
  createdAt: string;
}

// Analysis types
export enum AnalysisStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface AnalysisResults {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  learningStyle?: string;
  confidence?: number;
}

export interface Analysis {
  id: string;
  studentId: string;
  teacherId: string;
  status: AnalysisStatus;
  results?: AnalysisResults;
  teacherEdits?: Partial<AnalysisResults>;
  privateNotes?: string;
  flaggedForReview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string; value?: unknown }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
