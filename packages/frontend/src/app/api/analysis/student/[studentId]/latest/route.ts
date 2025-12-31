import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/lib/auth';
import { analysisStore } from '@/app/api/lib/analysisStore';

/**
 * GET /api/analysis/:studentId/latest
 *
 * Get the most recent analysis for a specific student
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   analysis: AnalysisResult | null
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

    // Get latest analysis for student
    const analysis = analysisStore.getLatestByStudentId(params.studentId);

    if (!analysis) {
      return NextResponse.json(
        { error: 'No analysis found for this student' },
        { status: 404 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Get latest analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
