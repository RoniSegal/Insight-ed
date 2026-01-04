import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for completing an analysis and generating the final report
 */
export class CompleteAnalysisDto {
  @ApiProperty({
    description: 'The ID of the conversation to complete',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
