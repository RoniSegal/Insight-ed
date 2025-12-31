import { NextResponse } from 'next/server';

import { validateCredentials, generateToken, getTeacherAccount } from '@/app/api/lib/auth';

/**
 * POST /api/auth/login
 *
 * Authenticates user with hardcoded credentials and returns JWT token
 *
 * Request body:
 * {
 *   email: string;
 *   password: string;
 * }
 *
 * Response:
 * {
 *   accessToken: string;
 *   user: {
 *     id: string;
 *     email: string;
 *     role: string;
 *     name: string;
 *   };
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Validate credentials against hardcoded account
    if (!validateCredentials(email, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Get user info and generate token
    const user = getTeacherAccount();
    const accessToken = generateToken(user.id, user.email, user.role);

    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
