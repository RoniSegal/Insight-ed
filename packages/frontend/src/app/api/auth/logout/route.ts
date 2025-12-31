import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 *
 * Logout endpoint (client-side token removal)
 * Since we're using JWT tokens, there's no server-side session to invalidate.
 * This endpoint exists for consistency and future expansion (e.g., token blacklist).
 *
 * For 3-day MVP: Returns success, client handles token removal
 *
 * Response:
 * {
 *   success: true;
 *   message: string;
 * }
 */
export async function POST(request: Request) {
  try {
    // For JWT-based auth, logout is primarily client-side (remove token from storage)
    // This endpoint can be extended later with token blacklisting if needed

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
