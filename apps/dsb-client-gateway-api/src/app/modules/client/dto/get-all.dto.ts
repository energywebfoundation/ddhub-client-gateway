import { ApiProperty } from '@nestjs/swagger';

export class GetAllClientsResponseDto {
  @ApiProperty({
    type: String,
    example: 'consumer01:channel.name',
    description: [
      'Client id, usually `<clientId>:<fqcn>`.',
      '- Added when messages are fetched, or a WebSocket connects, with a `clientId`.',
      '- Ids the Message Broker already knows are added automatically.',
    ].join('\n'),
  })
  public clientId: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-09-21T08:04:06.020Z',
    description: 'When the client id was first registered in the gateway (ISO 8601).',
  })
  createdDate!: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-10-02T14:31:55.112Z',
    description: 'When the client id was last used (ISO 8601). Deleted automatically after `CLIENT_EXPIRATION_DAYS` days unused (default 30).',
  })
  updatedDate!: Date;
}
