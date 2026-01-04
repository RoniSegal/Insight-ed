import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for chat messages in an analysis conversation
 */
export class ChatResponseDto {
  @ApiProperty({
    description: 'The AI assistant response message',
    example: 'תודה על המידע. ספר לי יותר על התנהגות התלמיד בכיתה.',
  })
  message: string;

  @ApiProperty({
    description: 'Whether the conversation is complete (6+ questions)',
    example: false,
  })
  isComplete: boolean;

  @ApiProperty({
    description: 'Additional metadata about the conversation',
    example: { questionCount: 3, messageCount: 7 },
  })
  metadata: {
    questionCount: number;
    messageCount: number;
  };
}
