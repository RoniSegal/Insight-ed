import { ApiProperty } from '@nestjs/swagger';

/**
 * Student response DTO
 * Simplified representation matching frontend API
 */
export class StudentDto {
  @ApiProperty({
    description: 'Student ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Student name',
    example: 'שרה כהן',
  })
  name: string;

  @ApiProperty({
    description: 'Student grade level',
    example: 'כיתה ג׳',
  })
  grade: string;

  @ApiProperty({
    description: 'Student class/teacher name',
    example: 'גב׳ לוי',
    required: false,
  })
  class?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-05T10:30:00Z',
  })
  createdAt: string;
}
