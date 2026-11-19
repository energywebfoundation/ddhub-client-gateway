import { ApiProperty } from '@nestjs/swagger';
import { FQCN_EXAMPLE } from '../channel-swagger.docs';

export class GetChannelMessagesCountDto {
  @ApiProperty({
    description: 'Number of messages stored for the channel: sent for `pub`, received for other types.',
    type: Number,
    minimum: 0,
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: 'FQCN of the channel the count belongs to.',
    type: String,
    example: FQCN_EXAMPLE,
  })
  fqcn: string;
}
