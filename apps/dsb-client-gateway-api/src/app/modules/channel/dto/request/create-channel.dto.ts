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
import {
  CHANNEL_TYPE_DESCRIPTION,
  CONDITIONS_DESCRIPTION,
  CONDITIONS_DIDS_DESCRIPTION,
  CONDITIONS_RESPONSE_TOPICS_DESCRIPTION,
  CONDITIONS_ROLES_DESCRIPTION,
  CONDITIONS_TOPICS_DESCRIPTION,
  DID_EXAMPLE,
  FQCN_DESCRIPTION,
  FQCN_EXAMPLE,
  MESSAGE_FORMS_DESCRIPTION,
  PAYLOAD_ENCRYPTION_DESCRIPTION,
  RESPONSE_TOPIC_ID_DESCRIPTION,
  ROLE_EXAMPLE,
  TOPIC_ID_EXAMPLE,
  TOPIC_NAME_DESCRIPTION,
  TOPIC_NAME_EXAMPLE,
  TOPIC_OWNER_DESCRIPTION,
  TOPIC_OWNER_EXAMPLE,
  USE_ANONYMOUS_EXT_CHANNEL_DESCRIPTION,
} from '../channel-swagger.docs';

// NOTE: `TopicDto`, `ResponseTopicDto` and `ChannelConditionsDto` are also
// declared in `update-channel.dto.ts`. Both map to the same OpenAPI schema
// names, so their Swagger decorators must stay identical.

export class TopicDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: TOPIC_NAME_DESCRIPTION,
    example: TOPIC_NAME_EXAMPLE,
  })
  topicName: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: TOPIC_OWNER_DESCRIPTION,
    example: TOPIC_OWNER_EXAMPLE,
  })
  owner: string;
}

export class ResponseTopicDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: `${TOPIC_NAME_DESCRIPTION} This is the topic to reply on.`,
    example: TOPIC_NAME_EXAMPLE,
  })
  topicName: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: `${TOPIC_OWNER_DESCRIPTION} Owner of the topic to reply on.`,
    example: TOPIC_OWNER_EXAMPLE,
  })
  owner: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: RESPONSE_TOPIC_ID_DESCRIPTION,
    example: TOPIC_ID_EXAMPLE,
  })
  responseTopicId: string;
}

export class ChannelConditionsDto {
  @IsOptional()
  @IsDID({
    each: true,
    message: 'Malformed DID',
  })
  @ApiProperty({
    description: CONDITIONS_DIDS_DESCRIPTION,
    type: [String],
    example: [DID_EXAMPLE],
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
    description: CONDITIONS_ROLES_DESCRIPTION,
    type: [String],
    example: [ROLE_EXAMPLE],
  })
  roles: string[];

  @ValidateNested({
    each: true,
  })
  @IsOptional()
  @ArrayUnique((o) => `${o.topicName}_${o.owner}`)
  @Type(() => TopicDto)
  @ApiProperty({
    description: CONDITIONS_TOPICS_DESCRIPTION,
    type: () => [TopicDto],
  })
  topics: TopicDto[];

  @ValidateNested({
    each: true,
  })
  @IsOptional()
  @ArrayUnique((o) => `${o.topicName}_${o.owner}`)
  @Type(() => ResponseTopicDto)
  @ApiProperty({
    description: CONDITIONS_RESPONSE_TOPICS_DESCRIPTION,
    type: () => [ResponseTopicDto],
  })
  responseTopics: ResponseTopicDto[];
}

export class CreateChannelDto {
  @IsString()
  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @ApiProperty({
    description: [
      'Unique name of the channel in this gateway.',
      '- Lowercase letters, digits and dots, 1 to 255 characters.',
      '- No upper case, spaces, dashes or underscores.',
    ].join('\n'),
    type: String,
    example: FQCN_EXAMPLE,
    pattern: '^[a-z0-9.]{1,255}$',
    minLength: 1,
    maxLength: 255,
  })
  fqcn: string;

  @ApiProperty({
    description: USE_ANONYMOUS_EXT_CHANNEL_DESCRIPTION,
    type: Boolean,
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  useAnonymousExtChannel: boolean;

  @ApiProperty({
    description: MESSAGE_FORMS_DESCRIPTION,
    type: Boolean,
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  messageForms: boolean;

  @ApiProperty({
    description: PAYLOAD_ENCRYPTION_DESCRIPTION,
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  payloadEncryption: boolean;

  @IsEnum(ChannelType)
  @ApiProperty({
    description: CHANNEL_TYPE_DESCRIPTION,
    enum: [
      ChannelType.SUB,
      ChannelType.PUB,
      ChannelType.DOWNLOAD,
      ChannelType.UPLOAD,
    ],
    example: ChannelType.PUB,
  })
  type: ChannelType;

  @ValidateNested()
  @IsOptional()
  @Type(() => ChannelConditionsDto)
  @ApiProperty({
    description: CONDITIONS_DESCRIPTION,
    type: () => ChannelConditionsDto,
  })
  conditions?: ChannelConditionsDto;
}
