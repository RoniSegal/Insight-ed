import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/lib/auth';
import { setConversation, type ConversationState } from '@/app/api/lib/conversationStore';
import { loadSystemPrompt } from '@/app/api/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // Get student name from students API
    // Forward the Authorization header to authenticate the internal API call
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized - Missing authorization header' }, { status: 401 });
    }

    const studentsResponse = await fetch(`${request.nextUrl.origin}/api/students/${studentId}`, {
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!studentsResponse.ok) {
      const errorData = await studentsResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to fetch student:', errorData);
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { student } = await studentsResponse.json();
    const studentName = student.name;

    // Create conversation ID
    const conversationId = crypto.randomUUID();

    // Load system prompt from file
    const systemPrompt = loadSystemPrompt(studentName);

    // Initialize conversation
    const conversation: ConversationState = {
      id: conversationId,
      studentId,
      studentName,
      messages: [{ role: 'system', content: systemPrompt }],
      questionCount: 0,
      isComplete: false,
      createdAt: new Date(),
    };

    setConversation(conversationId, conversation);

    // Generate first AI message
    const firstMessage = `שלום! בואו ננתח את ${studentName}. כדי ליצור ניתוח מקיף, אשאל אותך מספר שאלות על התלמיד/ה.

**שאלה 1 מתוך 6:**
כיצד היית מתאר/ת את הביצועים האקדמיים הכוללים של ${studentName} במקצועות השונים? באילו מקצועות הוא/היא מצטיין/ת, ובאילו מקצועות יש קשיים?`;

    conversation.messages.push({ role: 'assistant', content: firstMessage });
    conversation.questionCount = 1;

    return NextResponse.json({
      conversationId,
      message: firstMessage,
    });
  } catch (error: any) {
    console.error('Error starting conversation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start conversation' },
      { status: 500 }
    );
  }
}
