import { NextRequest, NextResponse } from 'next/server';

import { verifyToken } from '@/app/api/lib/auth';
import { getConversation, setConversation } from '@/app/api/lib/conversationStore';
import { chat, isOpenAIConfigured, truncateConversationHistory } from '@/app/api/lib/openai';
import { getQuestionTemplates } from '@/app/api/lib/prompts';

// Rate limiting (simple in-memory implementation for MVP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
  userId: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * Get template response when OpenAI is not configured
 * This provides a fallback for demo purposes using question templates from prompts service
 */
function getTemplateResponse(conversation: any): string {
  const questionIndex = conversation.questionCount || 0;
  const studentName = conversation.studentName || 'התלמיד/ה';
  const questionTemplates = getQuestionTemplates();

  if (questionIndex < questionTemplates.length) {
    // Return next question
    return questionTemplates[questionIndex].replace(/{studentName}/g, studentName);
  } else {
    // After 6 questions, suggest completing the analysis
    return `תודה רבה על כל המידע המפורט! יש לי תמונה ברורה של ${studentName}.

לחץ/י על כפתור "השלם ניתוח" כדי לקבל ניתוח מקיף עם המלצות ספציפיות לתלמיד/ה.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit
    if (!checkRateLimit(user.userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before sending more messages.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { conversationId, message } = body;

    // Validate input
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Get conversation from store
    const conversation = getConversation(conversationId);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Add user message to conversation
    conversation.messages.push({ role: 'user', content: message.trim() });

    let aiResponse: string;

    // Determine if we should use OpenAI or template responses
    if (isOpenAIConfigured()) {
      // Call OpenAI API
      try {
        // Truncate history to prevent token limit issues
        const truncatedMessages = truncateConversationHistory(conversation.messages, 15);

        const response = await chat({
          messages: truncatedMessages,
        });

        aiResponse = response.message;

        // Log additional info for debugging
        console.log('Chat API success:', {
          conversationId,
          messageCount: conversation.messages.length,
          usage: response.usage,
        });
      } catch (error: any) {
        console.error('OpenAI API error:', error);

        // Check for specific error types
        if (error.message.includes('Rate limit')) {
          return NextResponse.json(
            { error: 'Too many requests to AI service. Please wait a moment and try again.' },
            { status: 429 }
          );
        } else if (error.message.includes('API key')) {
          // Fallback to template for configuration issues
          console.warn('OpenAI API key issue, falling back to template responses');
          aiResponse = getTemplateResponse(conversation);
        } else {
          throw error;
        }
      }
    } else {
      // Use template responses (for demo without API key)
      console.log('OpenAI not configured, using template responses');
      aiResponse = getTemplateResponse(conversation);
    }

    // Add AI response to conversation
    conversation.messages.push({ role: 'assistant', content: aiResponse });
    conversation.questionCount++;

    // Check if conversation is complete (6+ questions asked)
    if (conversation.questionCount >= 6) {
      conversation.isComplete = true;
    }

    // Save updated conversation
    setConversation(conversationId, conversation);

    return NextResponse.json({
      message: aiResponse,
      isComplete: conversation.isComplete,
      metadata: {
        questionCount: conversation.questionCount,
        messageCount: conversation.messages.length,
      },
    });
  } catch (error: any) {
    console.error('Error in chat:', error);

    // Return user-friendly error messages
    return NextResponse.json(
      { error: error.message || 'Failed to process message. Please try again.' },
      { status: 500 }
    );
  }
}
