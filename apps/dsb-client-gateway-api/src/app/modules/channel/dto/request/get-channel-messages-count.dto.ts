import { ApiProperty } from '@nestjs/swagger';

export class GetChannelMessagesCountDto {
  @ApiProperty({
    description: 'Count of total messages',
    type: Number,
    example: 5,
  })
  count: number;
}

export class GetChannelsMessagesCountDto {
  @ApiProperty({
    description: 'Count of total messages',
    type: Number,
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: 'Channel name',
    type: Number,
    example: 'szostak.pub',
  })
  fqcn: string;
}
