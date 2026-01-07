import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for starting a new analysis conversation
 */
export class StartAnalysisResponseDto {
  @ApiProperty({
    description: 'The conversation ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  conversationId: string;

  @ApiProperty({
    description: 'The first AI message',
    example: 'שלום! בואו ננתח את דוד. כדי ליצור ניתוח מקיף...',
  })
  message: string;
}

