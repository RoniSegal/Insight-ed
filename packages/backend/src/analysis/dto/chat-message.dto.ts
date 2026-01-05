import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for sending a chat message in an ongoing analysis conversation
 */
export class ChatMessageDto {
  @ApiProperty({
    description: 'The ID of the conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({
    description: 'The message content from the user',
    example: 'התלמיד מצטיין במתמטיקה אבל מתקשה בקריאה',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'Message is too long (max 5000 characters)' })
  message: string;
}
