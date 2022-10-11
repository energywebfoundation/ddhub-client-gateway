import { ApiProperty } from '@nestjs/swagger';

export class GetAllClientsResponseDto {
  @ApiProperty({
    type: String,
    example: 'd682d25f-24b0-4b9f-afcc-08a40f8855d2',
    description: 'Unique client ID',
  })
  public id: string;

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
