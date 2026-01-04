import { NextResponse } from 'next/server';

import { verifyToken } from '@/app/api/lib/auth';
import { studentsStore } from '@/app/api/lib/studentsStore';

/**
 * GET /api/students/:id
 *
 * Get a single student by ID
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   student: Student
 * }
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Get student
    const student = studentsStore.getById(params.id);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/students/:id
 *
 * Update a student by ID
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Request body:
 * {
 *   name?: string;
 *   grade?: string;
 *   class?: string;
 * }
 *
 * Response:
 * {
 *   student: Student
 * }
 */
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { name, grade, class: className } = body;

    // Validate at least one field is provided
    if (!name && !grade && className === undefined) {
      return NextResponse.json(
        { error: 'At least one field (name, grade, or class) must be provided' },
        { status: 400 }
      );
    }

    // Validate field values if provided
    if (name !== undefined && name.trim().length === 0) {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
    }
    if (grade !== undefined && grade.trim().length === 0) {
      return NextResponse.json({ error: 'Grade cannot be empty' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (grade !== undefined) updateData.grade = grade.trim();
    if (className !== undefined) updateData.class = className?.trim();

    // Update student
    const student = studentsStore.update(params.id, updateData);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/students/:id
 *
 * Delete a student by ID
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   success: true
 * }
 */
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Delete student
    const deleted = studentsStore.delete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
