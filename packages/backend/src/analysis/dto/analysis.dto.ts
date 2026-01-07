import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO representing a saved analysis result
 */
export class AnalysisDto {
  @ApiProperty({
    description: 'The unique analysis ID',
    example: '42',
  })
  id: string;

  @ApiProperty({
    description: 'The student ID this analysis is for',
    example: '1',
  })
  studentId: string;

  @ApiProperty({
    description: 'The full analysis content in Hebrew (markdown format)',
    example: '# ניתוח תלמיד: שרה כהן\n\n## נקודות חוזק...',
  })
  analysis: string;

  @ApiProperty({
    description: 'Timestamp when the analysis was created',
    example: '2026-01-04T19:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'User ID of the teacher who created this analysis',
    example: '1',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Optional conversation history',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['user', 'assistant', 'system'] },
        content: { type: 'string' },
      },
    },
  })
  conversationHistory?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

