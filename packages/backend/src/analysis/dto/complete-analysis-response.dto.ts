import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for completing an analysis
 */
export class CompleteAnalysisResponseDto {
  @ApiProperty({
    description: 'The unique ID of the saved analysis',
    example: '42',
  })
  analysisId: string;

  @ApiProperty({
    description: 'The student ID this analysis is for',
    example: '1',
  })
  studentId: string;

  @ApiProperty({
    description: 'Timestamp when the analysis was completed',
    example: '2026-01-04T19:30:00.000Z',
  })
  completedAt: string;
}
