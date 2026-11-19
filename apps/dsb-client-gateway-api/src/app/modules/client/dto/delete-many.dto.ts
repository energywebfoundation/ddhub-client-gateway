import { ArrayUnique, IsArray, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteManyClientsBodyDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @Matches(/^[^\s&<>"'/\r\n]+$/, { each: true, message: 'one or more clientIds contains invalid characters' })
  @ApiProperty({
    description: [
      'Client ids to delete.',
      '- Unique; no spaces, line breaks or `&` `<` `>` `"` `\'` `/`.',
      '- Unknown ids are ignored.',
    ].join('\n'),
    type: [String],
    example: ['consumer01:channel.name', 'consumer02:channel.name'],
    uniqueItems: true,
  })
  clientsIds: string[];
}
