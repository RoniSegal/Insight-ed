import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/lib/auth/auth-store';

jest.mock('next/navigation');
jest.mock('@/lib/auth/auth-store');

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();
  const mockFetchCurrentUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Hydration and Loading States', () => {
    it('should show loading spinner while not hydrated', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: false,
      });

      render(
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    });

    it('should show loading spinner while loading', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    });

    it('should show loading spinner while not authenticated', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Authentication Flow', () => {
    it('should fetch current user on mount if not loaded', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockFetchCurrentUser).toHaveBeenCalledTimes(1);
      });
    });

    it('should not fetch current user if already loaded', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'TEACHER' },
        isAuthenticated: true,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      expect(mockFetchCurrentUser).not.toHaveBeenCalled();
    });

    it('should redirect to login if not authenticated after hydration', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Role-based Access Control', () => {
    it('should render children for authenticated user with allowed role', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'TEACHER' },
        isAuthenticated: true,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute allowedRoles={['TEACHER']}>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected content')).toBeInTheDocument();
    });

    it('should redirect to unauthorized for user with disallowed role', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'TEACHER' },
        isAuthenticated: true,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute allowedRoles={['PRINCIPAL']}>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/unauthorized');
      });
    });

    it('should render null after redirect for disallowed role', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'TEACHER' },
        isAuthenticated: true,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      const { container } = render(
        <ProtectedRoute allowedRoles={['PRINCIPAL']}>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should allow multiple roles', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'PRINCIPAL' },
        isAuthenticated: true,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute allowedRoles={['TEACHER', 'PRINCIPAL']}>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected content')).toBeInTheDocument();
    });
  });

  describe('No Role Restrictions', () => {
    it('should render children for any authenticated user when no roles specified', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'TEACHER' },
        isAuthenticated: true,
        isLoading: false,
        fetchCurrentUser: mockFetchCurrentUser,
        _hasHydrated: true,
      });

      render(
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected content')).toBeInTheDocument();
    });
  });
});
