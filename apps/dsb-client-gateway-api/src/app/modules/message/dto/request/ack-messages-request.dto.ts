import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class AckMessagesRequestDto {
  @ApiProperty({
    example: ['id1', 'id2'],
    isArray: true,
    type: String,
    description: 'Offline messages IDs to acknowledge',
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  public messagesIds: string[];
}
