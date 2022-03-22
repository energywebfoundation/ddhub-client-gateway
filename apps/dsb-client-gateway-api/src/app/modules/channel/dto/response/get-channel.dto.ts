import { ChannelType } from '../../channel.const';
import { ApiProperty } from '@nestjs/swagger';

export class ChannelTopic {
  @ApiProperty({
    type: String,
    description: 'Topic name',
    example: 'operatorEnvelope',
  })
  topicName: string;

  @ApiProperty({
    type: String,
    example: 'aemo.edge',
    description: 'Owner name',
  })
  owner: string;

  @ApiProperty({
    type: String,
    example: '622fed6e4258501225095045',
    description: 'Topic ID from Message Broker',
  })
  topicId: string;
}

export class ChannelConditions {
  @ApiProperty({
    description: 'Array of DIDS',
    type: [String],
    example: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
  })
  dids: string[];

  @ApiProperty({
    description: 'Array of roles',
    type: [String],
    example: ['marketoperator.roles'],
  })
  roles: string[];

  @ApiProperty({
    description: 'Array of topics',
    type: () => [ChannelTopic],
  })
  topics: ChannelTopic[];
}

export class GetChannelResponseDto {
  @ApiProperty({
    description: 'Channel type',
    type: String,
    example: 'channel.name',
  })
  channelName: string;

  @ApiProperty({
    description: 'Channel type',
    enum: [ChannelType.SUB, ChannelType.PUB],
    example: 'sub',
  })
  type: ChannelType;

  @ApiProperty({
    description: 'Channel conditions',
  })
  conditions: ChannelConditions;
}
