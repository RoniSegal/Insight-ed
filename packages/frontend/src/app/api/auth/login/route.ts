import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000/api/v1';

/**
 * POST /api/auth/login
 *
 * Proxies authentication request to backend API
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
 *   refreshToken: string;
 *   user: {
 *     id: string;
 *     email: string;
 *     role: string;
 *     firstName: string;
 *     lastName: string;
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

    // Forward request to backend API
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }));
      return NextResponse.json(
        { error: errorData.message || errorData.error || 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
