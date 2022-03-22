import { ChannelType } from '../../channel.const';
import {
  ArrayUnique,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelConditionsDto, TopicDto } from './create-channel.dto';
import { IsValidChannelName } from '../../../utils/validator/decorators/IsValidChannelName';

export class ChannelTopic {
  topicName: string;
  owner: string;
}

export class ChannelConditions {
  dids: string[];
  roles: string[];

  @ValidateNested({
    each: true,
  })
  @IsOptional()
  @ArrayUnique((o) => o.topicName)
  @Type(() => TopicDto)
  @ApiProperty({
    description: 'Array of topics',
    type: () => [TopicDto],
  })
  topics: ChannelTopic[];
}

export class UpdateChannelDto {
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

  @IsEnum(ChannelType)
  @ApiProperty({
    description: 'Channel type',
    enum: [ChannelType.SUB, ChannelType.PUB],
    example: 'sub',
  })
  type: ChannelType;

  @ValidateNested()
  @IsOptional()
  @Type(() => ChannelConditionsDto)
  @ApiProperty({
    description: 'Channel conditions',
  })
  conditions: ChannelConditions;
}
