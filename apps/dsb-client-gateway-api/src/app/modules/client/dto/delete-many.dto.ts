import { ArrayUnique, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteManyClientsBodyDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    description: 'Clients ids',
    type: [String],
    example: ['test.cursor'],
    uniqueItems: true,
  })
  clientsIds: string[];
}
