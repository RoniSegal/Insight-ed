import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

/**
 * DTO for creating a new student
 */
export class CreateStudentDto {
  @ApiProperty({
    description: 'Student name (Hebrew or English letters, spaces, hyphens, apostrophes)',
    example: 'שרה כהן',
  })
  @IsNotEmpty({ message: 'שם הוא שדה חובה' })
  @IsString()
  @Matches(/^[\u0590-\u05FFa-zA-Z\s'-]+$/, {
    message: 'השם יכול להכיל רק אותיות בעברית או באנגלית',
  })
  name: string;

  @ApiProperty({
    description: 'Student grade level',
    example: 'כיתה ג׳',
  })
  @IsNotEmpty({ message: 'כיתה היא שדה חובה' })
  @IsString()
  grade: string;

  @ApiProperty({
    description: 'Student class/teacher name',
    example: 'גב׳ לוי',
    required: false,
  })
  @IsOptional()
  @IsString()
  class?: string;
}
