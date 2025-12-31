import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/lib/auth';
import { studentsStore } from '@/app/api/lib/studentsStore';

/**
 * GET /api/students
 *
 * List all students
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   students: Student[]
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

    // Get all students
    const students = studentsStore.getAll();
    return NextResponse.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 *
 * Create a new student
 *
 * Headers:
 * Authorization: Bearer <token>
 *
 * Request body:
 * {
 *   name: string;
 *   grade: string;
 *   class?: string;
 * }
 *
 * Response:
 * {
 *   student: Student
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
    const { name, grade, class: className } = body;

    // Unicode-aware whitespace trimming and normalization
    const trimUnicode = (str: string): string => {
      if (!str) return '';
      // Normalize Unicode to NFC (Canonical Composition) to handle Hebrew combining characters
      const normalized = str.normalize('NFC');
      // Trim Unicode whitespace (includes ASCII and Unicode spaces)
      return normalized.replace(/^[\s\u200B-\u200D\uFEFF]+|[\s\u200B-\u200D\uFEFF]+$/g, '');
    };

    // Validate required fields with Unicode-aware validation
    const trimmedName = trimUnicode(name);
    if (!trimmedName || trimmedName.length === 0) {
      return NextResponse.json(
        { error: 'שם הוא שדה חובה' }, // Hebrew: "Name is required"
        { status: 400 }
      );
    }

    // Validate name contains only Hebrew/English letters, spaces, hyphens, and apostrophes
    const namePattern = /^[\u0590-\u05FFa-zA-Z\s'-]+$/;
    if (!namePattern.test(trimmedName)) {
      return NextResponse.json(
        { error: 'השם יכול להכיל רק אותיות בעברית או באנגלית' }, // Hebrew: "Name can only contain Hebrew or English letters"
        { status: 400 }
      );
    }

    const trimmedGrade = trimUnicode(grade);
    if (!trimmedGrade || trimmedGrade.length === 0) {
      return NextResponse.json(
        { error: 'כיתה היא שדה חובה' }, // Hebrew: "Grade is required"
        { status: 400 }
      );
    }

    // Create student
    const student = studentsStore.create({
      name: trimmedName,
      grade: trimmedGrade,
      class: className ? trimUnicode(className) : undefined,
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
