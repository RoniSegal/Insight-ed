import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * DTO for starting a new analysis conversation
 */
export class StartAnalysisDto {
  @ApiProperty({
    description: 'The student ID to analyze',
    example: '1',
  })
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'The student name (optional)',
    example: 'דוד כהן',
    required: false,
  })
  @IsOptional()
  @IsString()
  studentName?: string;
}
