import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for starting a new student analysis conversation
 */
export class StartAnalysisDto {
  @ApiProperty({
    description: 'The ID of the student to analyze',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'The name of the student (optional, can be fetched from DB)',
    example: 'Sarah Cohen',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  studentName?: string;
}
