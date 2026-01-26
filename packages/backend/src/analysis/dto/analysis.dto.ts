import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO representing the structured analysis output
 */
export class StructuredAnalysisDto {
  @ApiProperty({ description: 'Schema version', example: '1.0' })
  schemaVersion: string;

  @ApiProperty({ description: 'Overall summary of the analysis' })
  summary: string;

  @ApiProperty({
    description: 'Student strengths',
    type: 'object',
    properties: {
      academic: { type: 'array', items: { type: 'string' } },
      behavioral: { type: 'array', items: { type: 'string' } },
    },
  })
  strengths: {
    academic: string[];
    behavioral: string[];
  };

  @ApiProperty({
    description: 'Student barriers/challenges',
    type: 'object',
    properties: {
      academic: { type: 'array', items: { type: 'string' } },
      behavioral: { type: 'array', items: { type: 'string' } },
    },
  })
  barriers: {
    academic: string[];
    behavioral: string[];
  };

  @ApiProperty({
    description: 'Recommendations for the student',
    type: 'object',
    properties: {
      immediate: { type: 'array', items: { type: 'string' } },
      longTerm: { type: 'array', items: { type: 'string' } },
    },
  })
  recommendations: {
    immediate: string[];
    longTerm: string[];
  };

  @ApiProperty({
    description: 'Learning style preferences',
    type: 'object',
    properties: {
      preferences: { type: 'string' },
    },
  })
  learningStyle: {
    preferences: string;
  };

  @ApiProperty({
    description: 'Goals and tracking metrics',
    type: 'object',
    properties: {
      trackingMetrics: { type: 'array', items: { type: 'string' } },
    },
  })
  goals: {
    trackingMetrics: string[];
  };

  @ApiProperty({
    description: 'Full text narrative of the analysis',
    required: false,
  })
  fullText?: string;
}

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
    description: 'The structured analysis output',
    type: StructuredAnalysisDto,
  })
  structuredAnalysis: StructuredAnalysisDto;

  @ApiProperty({
    description: 'Brief summary of the analysis',
    required: false,
  })
  briefSummary?: string;

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
