'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useAuthStore } from '@/lib/auth/auth-store';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="max-w-md w-full space-y-8">
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-green-700">
              קישור לאיפוס סיסמה נשלח לכתובת המייל שלך. בדוק את תיבת הדואר.
            </p>
          </div>
          <Link href="/login" className="block text-center text-blue-600 hover:text-blue-500">
            חזור להתחברות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">שכחת סיסמה?</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            הזן את כתובת המייל שלך ונשלח לך קישור לאיפוס הסיסמה
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <input
            type="email"
            required
            placeholder="כתובת אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'שולח...' : 'שלח קישור לאיפוס'}
          </button>

          <Link
            href="/login"
            className="block text-center text-sm text-blue-600 hover:text-blue-500"
          >
            חזור להתחברות
          </Link>
        </form>
      </div>
    </div>
  );
}
