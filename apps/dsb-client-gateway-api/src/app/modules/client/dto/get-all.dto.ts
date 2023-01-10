import { ApiProperty } from '@nestjs/swagger';

export class GetAllClientsResponseDto {
  @ApiProperty({
    type: String,
    example: 'test.cursor',
    description: 'Client id',
  })
  public clientId: string;

  @ApiProperty({
    type: String,
    example: '2022-09-21 08:04:06.020037',
    description: 'Created date',
  })
  createdDate!: Date;

  @ApiProperty({
    type: String,
    example: '2022-09-21 08:04:06.020037',
    description: 'Updated date',
  })
  updatedDate!: Date;
}
