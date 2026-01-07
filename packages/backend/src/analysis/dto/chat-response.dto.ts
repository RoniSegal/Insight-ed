import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for chat messages
 */
export class ChatResponseDto {
  @ApiProperty({
    description: 'The AI response message',
    example: 'תודה על התשובה. **שאלה 2 מתוך 8:**...',
  })
  message: string;

  @ApiProperty({
    description: 'Whether the conversation is complete',
    example: false,
  })
  isComplete: boolean;

  @ApiProperty({
    description: 'Additional metadata about the conversation',
    example: { questionCount: 2, messageCount: 5 },
  })
  metadata: any;
}

