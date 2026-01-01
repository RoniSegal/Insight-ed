import { NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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
    console.log('[LOGIN API] Request received');
    console.log('[LOGIN API] BACKEND_URL:', BACKEND_URL);

    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      console.log('[LOGIN API] Validation failed - missing email or password');
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    console.log('[LOGIN API] Forwarding to backend:', `${BACKEND_URL}/auth/login`);

    // Forward request to backend API
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('[LOGIN API] Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }));
      console.log('[LOGIN API] Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.message || errorData.error || 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[LOGIN API] Success - returning user data');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[LOGIN API] Exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
