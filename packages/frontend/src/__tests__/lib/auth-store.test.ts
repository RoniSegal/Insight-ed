import { UserRole, AuthProvider, type User } from '@growth-engine/shared';
import { renderHook, act, waitFor } from '@testing-library/react';

import { ApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth/auth-store';

jest.mock('@/lib/api-client');

describe('useAuthStore', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    role: UserRole.TEACHER,
    authProvider: AuthProvider.EMAIL,
    firstName: 'Test',
    lastName: 'User',
    schoolId: 'school-1',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    // Reset zustand store state
    useAuthStore.setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      _hasHydrated: false,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current._hasHydrated).toBe(false);
    });
  });

  describe('setHasHydrated', () => {
    it('should set hydration state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setHasHydrated(true);
      });

      expect(result.current._hasHydrated).toBe(true);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      };

      (ApiClient.post as jest.Mock).mockResolvedValue(mockResponse);
      (ApiClient.setAuthTokens as jest.Mock).mockImplementation(() => {});

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password',
      });
      expect(ApiClient.setAuthTokens).toHaveBeenCalledWith('access-token', 'refresh-token');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle login without refresh token', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        user: mockUser,
      };

      (ApiClient.post as jest.Mock).mockResolvedValue(mockResponse);
      (ApiClient.setAuthTokens as jest.Mock).mockImplementation(() => {});

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(ApiClient.setAuthTokens).toHaveBeenCalledWith('access-token', '');
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      (ApiClient.post as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'wrong-password');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      (ApiClient.post as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login('test@example.com', 'password');
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('loginWithGoogle', () => {
    it('should redirect to Google OAuth', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.loginWithGoogle();
      });

      expect(window.location.href).toContain('/auth/google');
    });

    it('should use NEXT_PUBLIC_API_URL if available', () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/api/v1';

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.loginWithGoogle();
      });

      expect(window.location.href).toBe('https://api.example.com/api/v1/auth/google');

      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });

  describe('loginWithMicrosoft', () => {
    it('should redirect to Microsoft OAuth', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.loginWithMicrosoft();
      });

      expect(window.location.href).toContain('/auth/microsoft');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({});
      (ApiClient.logout as jest.Mock).mockImplementation(() => {});

      const { result } = renderHook(() => useAuthStore());

      // Set user first
      act(() => {
        result.current.setUser(mockUser);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/auth/logout', {});
      expect(ApiClient.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(window.location.href).toBe('/login');
    });

    it('should logout even if API call fails', async () => {
      (ApiClient.post as jest.Mock).mockRejectedValue(new Error('Network error'));
      (ApiClient.logout as jest.Mock).mockImplementation(() => {});

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(ApiClient.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useAuthStore());

      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      await act(async () => {
        await result.current.register(registerData);
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result.current.isLoading).toBe(false);
    });

    it('should register with optional fields', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useAuthStore());

      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        phone: '123456789',
        schoolCode: 'SCHOOL123',
      };

      await act(async () => {
        await result.current.register(registerData);
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
    });

    it('should handle registration error', async () => {
      const error = new Error('Email already exists');
      (ApiClient.post as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      await expect(
        act(async () => {
          await result.current.register(registerData);
        })
      ).rejects.toThrow('Email already exists');

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.forgotPassword('test@example.com');
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle forgot password error', async () => {
      const error = new Error('Email not found');
      (ApiClient.post as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.forgotPassword('unknown@example.com');
        })
      ).rejects.toThrow('Email not found');

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      (ApiClient.post as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.resetPassword('reset-token', 'newPassword123');
      });

      expect(ApiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'reset-token',
        newPassword: 'newPassword123',
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle reset password error', async () => {
      const error = new Error('Invalid or expired token');
      (ApiClient.post as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.resetPassword('invalid-token', 'newPassword123');
        })
      ).rejects.toThrow('Invalid or expired token');

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('fetchCurrentUser', () => {
    it('should fetch current user successfully', async () => {
      (ApiClient.get as jest.Mock).mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.fetchCurrentUser();
      });

      expect(ApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle fetch user error', async () => {
      (ApiClient.get as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.fetchCurrentUser();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should set user and authentication state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should clear user and authentication state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('handleOAuthCallback', () => {
    it('should handle OAuth callback successfully', async () => {
      (ApiClient.setAuthTokens as jest.Mock).mockImplementation(() => {});
      (ApiClient.get as jest.Mock).mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.handleOAuthCallback('access-token', 'refresh-token');
      });

      expect(ApiClient.setAuthTokens).toHaveBeenCalledWith('access-token', 'refresh-token');
      expect(ApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle OAuth callback error', async () => {
      (ApiClient.setAuthTokens as jest.Mock).mockImplementation(() => {});
      (ApiClient.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch user'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.handleOAuthCallback('access-token', 'refresh-token');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
