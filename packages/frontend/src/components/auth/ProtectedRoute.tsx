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

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!_hasHydrated) return;

    // Fetch current user on mount if not already loaded
    if (!user && !isLoading) {
      fetchCurrentUser();
    }
  }, [user, isLoading, fetchCurrentUser, _hasHydrated]);

  useEffect(() => {
    // Wait for hydration before redirecting
    if (!_hasHydrated) return;

    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, _hasHydrated]);

  // Show loading while hydrating or checking auth
  if (!_hasHydrated || isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
