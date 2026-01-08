import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for completing an analysis
 */
export class CompleteAnalysisResponseDto {
  @ApiProperty({
    description: 'The analysis ID',
    example: '1',
  })
  analysisId: string;

  @ApiProperty({
    description: 'The student ID',
    example: '1',
  })
  studentId: string;

  @ApiProperty({
    description: 'Timestamp when the analysis was completed',
    example: '2026-01-07T19:30:00.000Z',
  })
  completedAt: string;
}
