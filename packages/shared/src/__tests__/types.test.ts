import {
  UserRole,
  AuthProvider,
  AnalysisStatus,
  type User,
  type Student,
  type Analysis,
  type AnalysisResults,
  type ApiResponse,
  type ApiError,
  type PaginationMeta,
  type PaginationParams,
} from '../types';

describe('Shared Types', () => {
  describe('UserRole enum', () => {
    it('should have TEACHER role', () => {
      expect(UserRole.TEACHER).toBe('TEACHER');
    });

    it('should have PRINCIPAL role', () => {
      expect(UserRole.PRINCIPAL).toBe('PRINCIPAL');
    });

    it('should have ADMIN role', () => {
      expect(UserRole.ADMIN).toBe('ADMIN');
    });

    it('should have exactly 3 roles', () => {
      const roles = Object.values(UserRole);
      expect(roles).toHaveLength(3);
    });
  });

  describe('AuthProvider enum', () => {
    it('should have EMAIL provider', () => {
      expect(AuthProvider.EMAIL).toBe('EMAIL');
    });

    it('should have GOOGLE provider', () => {
      expect(AuthProvider.GOOGLE).toBe('GOOGLE');
    });

    it('should have MICROSOFT provider', () => {
      expect(AuthProvider.MICROSOFT).toBe('MICROSOFT');
    });

    it('should have exactly 3 providers', () => {
      const providers = Object.values(AuthProvider);
      expect(providers).toHaveLength(3);
    });
  });

  describe('AnalysisStatus enum', () => {
    it('should have IN_PROGRESS status', () => {
      expect(AnalysisStatus.IN_PROGRESS).toBe('IN_PROGRESS');
    });

    it('should have COMPLETED status', () => {
      expect(AnalysisStatus.COMPLETED).toBe('COMPLETED');
    });

    it('should have FAILED status', () => {
      expect(AnalysisStatus.FAILED).toBe('FAILED');
    });

    it('should have exactly 3 statuses', () => {
      const statuses = Object.values(AnalysisStatus);
      expect(statuses).toHaveLength(3);
    });
  });

  describe('Type structures (compile-time checks)', () => {
    it('should allow valid User object', () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
        authProvider: AuthProvider.EMAIL,
        firstName: 'John',
        lastName: 'Doe',
        schoolId: 'school-1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(user).toBeDefined();
      expect(user.id).toBe('123');
    });

    it('should allow valid Student object', () => {
      const student: Student = {
        id: '456',
        name: 'Jane Doe',
        grade: '5th',
        class: 'A',
        createdAt: '2024-01-01',
      };
      expect(student).toBeDefined();
      expect(student.name).toBe('Jane Doe');
    });

    it('should allow Student without optional class', () => {
      const student: Student = {
        id: '789',
        name: 'Bob Smith',
        grade: '6th',
        createdAt: '2024-01-01',
      };
      expect(student).toBeDefined();
      expect(student.class).toBeUndefined();
    });

    it('should allow valid AnalysisResults object', () => {
      const results: AnalysisResults = {
        strengths: ['Math', 'Science'],
        weaknesses: ['Writing'],
        recommendations: ['Practice writing daily'],
        learningStyle: 'Visual',
        confidence: 0.85,
      };
      expect(results).toBeDefined();
      expect(results.strengths).toHaveLength(2);
    });

    it('should allow AnalysisResults without optional fields', () => {
      const results: AnalysisResults = {
        strengths: ['Reading'],
        weaknesses: ['Math'],
        recommendations: ['Use flashcards'],
      };
      expect(results).toBeDefined();
      expect(results.learningStyle).toBeUndefined();
      expect(results.confidence).toBeUndefined();
    });

    it('should allow valid Analysis object', () => {
      const analysis: Analysis = {
        id: 'analysis-1',
        studentId: 'student-1',
        teacherId: 'teacher-1',
        status: AnalysisStatus.COMPLETED,
        results: {
          strengths: ['Art'],
          weaknesses: ['PE'],
          recommendations: ['More practice'],
        },
        flaggedForReview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(analysis).toBeDefined();
      expect(analysis.status).toBe(AnalysisStatus.COMPLETED);
    });

    it('should allow valid ApiResponse object', () => {
      const response: ApiResponse<{ name: string }> = {
        success: true,
        data: { name: 'Test' },
      };
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
    });

    it('should allow ApiResponse with error', () => {
      const error: ApiError = {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        details: [{ field: 'id', message: 'Invalid ID' }],
      };
      const response: ApiResponse = {
        success: false,
        error,
      };
      expect(response).toBeDefined();
      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('NOT_FOUND');
    });

    it('should allow ApiResponse with pagination', () => {
      const meta: PaginationMeta = {
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      };
      const response: ApiResponse<string[]> = {
        success: true,
        data: ['item1', 'item2'],
        meta,
      };
      expect(response).toBeDefined();
      expect(response.meta?.totalPages).toBe(5);
    });

    it('should allow valid PaginationParams object', () => {
      const params: PaginationParams = {
        page: 2,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      expect(params).toBeDefined();
      expect(params.sortOrder).toBe('desc');
    });

    it('should allow PaginationParams with only some fields', () => {
      const params: PaginationParams = {
        page: 1,
      };
      expect(params).toBeDefined();
      expect(params.limit).toBeUndefined();
    });
  });
});
