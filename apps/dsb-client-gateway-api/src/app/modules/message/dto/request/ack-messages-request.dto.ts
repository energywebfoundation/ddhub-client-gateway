import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class AckMessagesRequestDto {
  @ApiProperty({
    example: ['657a1f0c2b3e4d5f6a7b8c9d', '657a1f0c2b3e4d5f6a7b8c9e'],
    isArray: true,
    type: String,
    minItems: 1,
    description: [
      'IDs of received messages to mark as read.',
      '- At least one ID.',
      '- Unknown IDs are accepted.',
    ].join('\n'),
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  public messagesIds: string[];
}
