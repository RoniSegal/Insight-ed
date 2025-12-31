import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/lib/auth';
import { analysisStore } from '@/app/api/lib/analysisStore';

/**
 * POST /api/analysis
 *
 * Create a new analysis result
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Request body:
 * {
 *   studentId: string;
 *   analysis: string; // Hebrew markdown analysis from OpenAI
 *   conversationHistory?: Message[];
 * }
 *
 * Response:
 * {
 *   analysis: AnalysisResult
 * }
 */
export async function POST(request: Request) {
  try {
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

    // Parse request body
    const body = await request.json();
    const { studentId, analysis, conversationHistory } = body;

    // Validate required fields
    if (!studentId || studentId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }
    if (!analysis || analysis.trim().length === 0) {
      return NextResponse.json(
        { error: 'Analysis content is required' },
        { status: 400 }
      );
    }

    // Validate conversationHistory format if provided
    if (conversationHistory !== undefined) {
      if (!Array.isArray(conversationHistory)) {
        return NextResponse.json(
          { error: 'conversationHistory must be an array' },
          { status: 400 }
        );
      }
      // Validate each message has role and content
      for (const msg of conversationHistory) {
        if (!msg.role || !msg.content) {
          return NextResponse.json(
            { error: 'Each message must have role and content' },
            { status: 400 }
          );
        }
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
          return NextResponse.json(
            { error: 'Invalid message role. Must be user, assistant, or system' },
            { status: 400 }
          );
        }
      }
    }

    // Create analysis
    const result = analysisStore.create({
      studentId: studentId.trim(),
      analysis: analysis.trim(),
      conversationHistory,
      createdBy: decoded.userId,
    });

    return NextResponse.json({ analysis: result }, { status: 201 });
  } catch (error) {
    console.error('Create analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analysis
 *
 * List all analyses (optionally filtered by studentId query param)
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Query params:
 * studentId?: string (optional filter)
 *
 * Response:
 * {
 *   analyses: AnalysisResult[]
 * }
 */
export async function GET(request: Request) {
  try {
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

    // Get query params
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    // Get all analyses (with optional filter)
    const analyses = studentId
      ? analysisStore.getAll(studentId)
      : analysisStore.getAll();

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
