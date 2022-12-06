import { IsBoolean } from 'class-validator';
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
    description: 'List of qualified dids',
    example: [
      'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      'did:ethr:volta:0x3Ce3B60427b4Bf0Ce366d9963BeC5ef3CBD06ad5',
    ],
    type: [String],
  })
  qualifiedDids: string[];

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
  fqcn: string;

  @ApiProperty({
    description: 'Channel encryption',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  payloadEncryption: boolean;

  @ApiProperty({
    description: 'Channel type',
    enum: [
      ChannelType.SUB,
      ChannelType.PUB,
      ChannelType.DOWNLOAD,
      ChannelType.UPLOAD,
    ],
    example: 'sub',
  })
  type: ChannelType;

  @ApiProperty({
    description: 'Use anonymous external channel',
    default: false,
    example: false,
  })
  useAnonymousExtChannel: boolean;

  @ApiProperty({
    description: 'Channel conditions',
  })
  conditions: ChannelConditions;
}

export class GetChannelQualifiedDidsDto {
  @ApiProperty({
    description: 'Channel name / fqcn',
    example: 'channel.name',
    type: String,
  })
  fqcn: string;

  @ApiProperty({
    description: 'List of qualified dids',
    example: [
      'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
      'did:ethr:volta:0x3Ce3B60427b4Bf0Ce366d9963BeC5ef3CBD06ad5',
    ],
    type: [String],
  })
  qualifiedDids: string[];

  @ApiProperty({
    description: 'Last update time',
    example: '2022-03-22T14:27:00.027Z',
    type: String,
  })
  updatedAt: string;
}
