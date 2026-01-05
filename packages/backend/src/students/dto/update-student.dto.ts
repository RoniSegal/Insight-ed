import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

/**
 * DTO for updating a student
 * All fields are optional - at least one must be provided
 */
export class UpdateStudentDto {
  @ApiProperty({
    description: 'Student name (Hebrew or English letters, spaces, hyphens, apostrophes)',
    example: 'שרה כהן',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[\u0590-\u05FFa-zA-Z\s'-]+$/, {
    message: 'השם יכול להכיל רק אותיות בעברית או באנגלית',
  })
  name?: string;

  @ApiProperty({
    description: 'Student grade level',
    example: 'כיתה ג׳',
    required: false,
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({
    description: 'Student class/teacher name',
    example: 'גב׳ לוי',
    required: false,
  })
  @IsOptional()
  @IsString()
  class?: string;
}
