'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/lib/auth/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('TEACHER' | 'PRINCIPAL' | 'ADMIN')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchCurrentUser, _hasHydrated } = useAuthStore();

  console.log('[PROTECTED ROUTE] Render - hasHydrated:', _hasHydrated, 'isAuth:', isAuthenticated, 'isLoading:', isLoading, 'user:', !!user);

  useEffect(() => {
    console.log('[PROTECTED ROUTE] Effect 1 - hasHydrated:', _hasHydrated, 'user:', !!user, 'isLoading:', isLoading);
    // Wait for hydration before checking auth
    if (!_hasHydrated) return;

    // Fetch current user on mount if not already loaded
    if (!user && !isLoading) {
      console.log('[PROTECTED ROUTE] Fetching current user...');
      fetchCurrentUser();
    }
  }, [user, isLoading, fetchCurrentUser, _hasHydrated]);

  useEffect(() => {
    console.log('[PROTECTED ROUTE] Effect 2 - hasHydrated:', _hasHydrated, 'isLoading:', isLoading, 'isAuth:', isAuthenticated);
    // Wait for hydration before redirecting
    if (!_hasHydrated) return;

    if (!isLoading && !isAuthenticated) {
      console.log('[PROTECTED ROUTE] Not authenticated, redirecting to /login');
      router.push('/login');
    } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      console.log('[PROTECTED ROUTE] Unauthorized role, redirecting to /unauthorized');
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, _hasHydrated]);

  // Show loading while hydrating or checking auth
  if (!_hasHydrated || isLoading || !isAuthenticated) {
    console.log('[PROTECTED ROUTE] Showing loading - hasHydrated:', _hasHydrated, 'isLoading:', isLoading, 'isAuth:', isAuthenticated);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log('[PROTECTED ROUTE] Role check failed, returning null');
    return null;
  }

  console.log('[PROTECTED ROUTE] Rendering children');
  return <>{children}</>;
}
