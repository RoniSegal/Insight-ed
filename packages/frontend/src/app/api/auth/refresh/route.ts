import { NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000/api/v1';

/**
 * POST /api/auth/refresh
 *
 * Refresh access token using refresh token
 *
 * Request body:
 * {
 *   refreshToken: string;
 * }
 *
 * Response:
 * {
 *   accessToken: string;
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validate required fields
    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    // Forward request to backend API
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Token refresh failed' }));
      return NextResponse.json(
        { error: errorData.message || errorData.error || 'Token refresh failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Refresh token API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
