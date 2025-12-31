import { NextRequest, NextResponse } from 'next/server';

import { analysisStore } from '@/app/api/lib/analysisStore';
import { verifyToken } from '@/app/api/lib/auth';
import { getConversation } from '@/app/api/lib/conversationStore';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Get conversation from shared store
    const conversation = getConversation(conversationId);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if conversation has enough exchanges (optional check)
    // if (!conversation.isComplete && conversation.questionCount < 4) {
    //   return NextResponse.json(
    //     { error: 'Please complete more of the conversation before finishing' },
    //     { status: 400 }
    //   );
    // }

    // Get final analysis message (last assistant message)
    const finalMessage = conversation.messages.filter((m: any) => m.role === 'assistant').pop();

    if (!finalMessage) {
      return NextResponse.json({ error: 'No analysis generated yet' }, { status: 400 });
    }

    // Create analysis result using the analysisStore
    const result = analysisStore.create({
      studentId: conversation.studentId,
      analysis: finalMessage.content,
      conversationHistory: conversation.messages,
      createdBy: user.userId,
    });

    return NextResponse.json({
      analysisId: result.id,
      studentId: result.studentId,
      completedAt: result.createdAt,
    });
  } catch (error: any) {
    console.error('Error completing analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete analysis' },
      { status: 500 }
    );
  }
}
