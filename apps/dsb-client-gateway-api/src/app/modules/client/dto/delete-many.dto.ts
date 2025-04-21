import { ArrayUnique, IsArray, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteManyClientsBodyDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @Matches(/^[^\s&<>\"'\/\r\n]+$/, { each: true, message: 'one or more clientIds contains invalid characters' })
  @ApiProperty({
    description: 'Clients ids',
    type: [String],
    example: ['test.cursor'],
    uniqueItems: true,
  })
  clientsIds: string[];
}
