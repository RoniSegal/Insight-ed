import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for sending a chat message
 */
export class ChatMessageDto {
  @ApiProperty({
    description: 'The conversation ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({
    description: 'The user message',
    example: 'התלמיד מצטיין במתמטיקה',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

