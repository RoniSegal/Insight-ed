import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/lib/auth';
import { analysisStore } from '@/app/api/lib/analysisStore';

/**
 * GET /api/analysis/:studentId
 *
 * Get all analyses for a specific student
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   analyses: AnalysisResult[]
 * }
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ studentId: string }> }
) {
  try {
    // Await params in Next.js 15+
    const params = await context.params;

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get analyses for student
    const analyses = analysisStore.getByStudentId(params.studentId);

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Get student analyses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
