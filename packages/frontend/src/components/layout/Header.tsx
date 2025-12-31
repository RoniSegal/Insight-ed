import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui';
import { useAuthStore } from '@/lib/auth/auth-store';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GE</span>
              </div>
              <span className="text-xl font-bold text-neutral-800">Growth Engine</span>
            </Link>
          </div>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Link
                href="/dashboard"
                className="text-neutral-600 hover:text-primary-600 font-medium px-3 py-2 rounded transition-colors"
              >
                לוח בקרה
              </Link>
              {user.role === 'TEACHER' && (
                <Link
                  href="/students"
                  className="text-neutral-600 hover:text-primary-600 font-medium px-3 py-2 rounded transition-colors"
                >
                  תלמידים
                </Link>
              )}
              {user.role === 'PRINCIPAL' && (
                <>
                  <Link
                    href="/teachers"
                    className="text-neutral-600 hover:text-primary-600 font-medium px-3 py-2 rounded transition-colors"
                  >
                    מורים
                  </Link>
                  <Link
                    href="/analytics"
                    className="text-neutral-600 hover:text-primary-600 font-medium px-3 py-2 rounded transition-colors"
                  >
                    דוחות
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* User menu */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {user ? (
              <>
                <div className="hidden md:block text-sm text-end">
                  <div className="font-medium text-neutral-800">{user.name}</div>
                  <div className="text-neutral-500">
                    {user.role === 'TEACHER' ? 'מורה' : 'מנהל'}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  יציאה
                </Button>
              </>
            ) : (
              <Button as={Link} href="/login" variant="primary" size="sm">
                התחברות
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
