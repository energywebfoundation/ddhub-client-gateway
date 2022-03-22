import { IsString } from 'class-validator';
import { IsValidChannelName } from '../../../utils/validator/decorators/IsValidChannelName';
import { ApiProperty } from '@nestjs/swagger';

export class GetChannelParamsDto {
  @IsString()
  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @ApiProperty({
    description: 'Channel type',
    type: String,
    example: 'channel.name',
  })
  channelName: string;
}
