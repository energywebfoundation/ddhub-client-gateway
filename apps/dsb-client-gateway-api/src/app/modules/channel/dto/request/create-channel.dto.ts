import {
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChannelType } from '../../channel.const';
import { IsDID } from '../../../utils/validator/decorators/IsDid';
import { IsValidChannelName } from '../../../utils/validator/decorators/IsValidChannelName';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TopicDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Topic name',
    example: 'operatorEnvelope',
  })
  topicName: string;

  @IsString()
  @ApiProperty({
    type: String,
    example: 'aemo.edge',
    description: 'Owner name',
  })
  owner: string;
}

export class ChannelConditionsDto {
  @IsOptional()
  @IsDID({
    each: true,
    message: 'Malformed DID',
  })
  @ApiProperty({
    description: 'Array of DIDS',
    type: [String],
    example: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
  })
  dids: string[];

  @IsOptional()
  @IsString({
    each: true,
  })
  @IsValidChannelName({
    each: true,
    message:
      'Malformed role. Role should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @ApiProperty({
    description: 'Array of roles',
    type: [String],
    example: ['marketoperator.roles'],
  })
  roles: string[];

  @ValidateNested({
    each: true,
  })
  @IsOptional()
  @ArrayUnique((o) => `${o.topicName}_${o.owner}`)
  @Type(() => TopicDto)
  @ApiProperty({
    description: 'Array of topics',
    type: () => [TopicDto],
  })
  topics: TopicDto[];

  @ApiProperty({
    example: {
      '622fed6e4258501225095045': [
        {
          topicName: 'operatorEnvelopeAck',
          owner: 'aemo.edge',
          topicId: '622fed6e4258501225095046',
        },
      ],
    },
    description: 'Response topics mapping.',
  })
  responseTopics: Record<
    string,
    { topicName: string; owner: string; topicId: string }[]
  >;
}

export class CreateChannelDto {
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
  fqcn: string;

  @ApiProperty({
    description: 'Use anonymous external channels',
    type: Boolean,
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  useAnonymousExtChannel: boolean;

  @ApiProperty({
    description: 'Create message forms',
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  messageForms: boolean;

  @ApiProperty({
    description: 'Channel encryption',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  payloadEncryption: boolean;

  @IsEnum(ChannelType)
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

  @ValidateNested()
  @IsOptional()
  @Type(() => ChannelConditionsDto)
  @ApiProperty({
    description: 'Channel conditions',
  })
  conditions?: ChannelConditionsDto;
}
