import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for starting a new analysis conversation
 */
export class StartAnalysisResponseDto {
  @ApiProperty({
    description: 'The unique conversation ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  conversationId: string;

  @ApiProperty({
    description: 'The first message from the AI assistant',
    example: 'שלום! בואו ננתח את שרה כהן. כדי ליצור ניתוח מקיף, אשאל אותך מספר שאלות על התלמיד/ה.',
  })
  message: string;
}
