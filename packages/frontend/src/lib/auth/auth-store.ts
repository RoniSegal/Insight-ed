import type { User } from '@growth-engine/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ApiClient } from '../api-client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithMicrosoft: () => void;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  handleOAuthCallback: (accessToken: string, refreshToken: string) => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  schoolCode?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response: any = await ApiClient.post('/auth/login', {
            email,
            password,
          });

          // For MVP, we only have accessToken, no refreshToken
          ApiClient.setAuthTokens(response.accessToken, response.refreshToken || '');
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        window.location.href = `${apiUrl}/auth/google`;
      },

      loginWithMicrosoft: () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        window.location.href = `${apiUrl}/auth/microsoft`;
      },

      logout: async () => {
        try {
          await ApiClient.post('/auth/logout', {});
        } catch {
          // Ignore errors on logout
        } finally {
          ApiClient.logout();
          set({
            user: null,
            isAuthenticated: false,
          });
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await ApiClient.post('/auth/register', data);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          await ApiClient.post('/auth/forgot-password', { email });
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true });
        try {
          await ApiClient.post('/auth/reset-password', { token, newPassword });
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchCurrentUser: async () => {
        try {
          const response: any = await ApiClient.get('/auth/me');
          set({
            user: response.user,
            isAuthenticated: true,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      handleOAuthCallback: async (accessToken: string, refreshToken: string) => {
        ApiClient.setAuthTokens(accessToken, refreshToken);
        await get().fetchCurrentUser();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
