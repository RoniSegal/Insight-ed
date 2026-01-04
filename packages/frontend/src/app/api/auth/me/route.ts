import { NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000/api/v1';

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
 *   user: {
 *     id: string;
 *     email: string;
 *     role: string;
 *     firstName: string;
 *     lastName: string;
 *   }
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

    // Forward request to backend API
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
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
    console.error('Get current user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
