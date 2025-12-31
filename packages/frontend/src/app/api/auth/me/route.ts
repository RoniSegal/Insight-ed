import { NextResponse } from 'next/server';

import { verifyToken, getTeacherAccount } from '@/app/api/lib/auth';

/**
 * GET /api/auth/me
 *
 * Returns current authenticated user info
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   id: string;
 *   email: string;
 *   role: string;
 *   name: string;
 * }
 */
export async function GET(request: Request) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Return user info
    const user = getTeacherAccount();
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || '',
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
