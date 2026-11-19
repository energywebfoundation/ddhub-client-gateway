import { IsBoolean } from 'class-validator';
import { ChannelType } from '../../channel.const';
import { ApiProperty } from '@nestjs/swagger';
import {
  CHANNEL_TYPE_DESCRIPTION,
  CONDITIONS_DIDS_DESCRIPTION,
  CONDITIONS_ROLES_DESCRIPTION,
  DID_EXAMPLE,
  DID_EXAMPLE_2,
  FQCN_DESCRIPTION,
  FQCN_EXAMPLE,
  MESSAGE_FORMS_DESCRIPTION,
  PAYLOAD_ENCRYPTION_DESCRIPTION,
  QUALIFIED_DIDS_DESCRIPTION,
  ROLE_EXAMPLE,
  TOPIC_ID_EXAMPLE,
  TOPIC_NAME_DESCRIPTION,
  TOPIC_NAME_EXAMPLE,
  TOPIC_OWNER_DESCRIPTION,
  TOPIC_OWNER_EXAMPLE,
  USE_ANONYMOUS_EXT_CHANNEL_DESCRIPTION,
} from '../channel-swagger.docs';

export class ChannelResponseTopic {
  @ApiProperty({
    type: String,
    description: `${TOPIC_NAME_DESCRIPTION} Topic to reply on.`,
    example: TOPIC_NAME_EXAMPLE,
  })
  topicName: string;

  @ApiProperty({
    type: String,
    description: `${TOPIC_OWNER_DESCRIPTION} Owner of the topic to reply on.`,
    example: TOPIC_OWNER_EXAMPLE,
  })
  topicOwner: string;

  @ApiProperty({
    type: String,
    description:
      'Message broker id of the topic to reply on (`topicName` / `topicOwner`), resolved when the channel was saved.',
    example: TOPIC_ID_EXAMPLE,
  })
  topicId: string;

  @ApiProperty({
    type: String,
    description:
      'Message broker id of the topic of incoming messages that should be answered on `topicId`.',
    example: '622fed6e4258501225095046',
  })
  responseTopicId: string;
}

export class ChannelTopic {
  @ApiProperty({
    type: String,
    description: TOPIC_NAME_DESCRIPTION,
    example: TOPIC_NAME_EXAMPLE,
  })
  topicName: string;

  @ApiProperty({
    type: String,
    description: TOPIC_OWNER_DESCRIPTION,
    example: TOPIC_OWNER_EXAMPLE,
  })
  owner: string;

  @ApiProperty({
    type: String,
    description: 'Id of the topic. The same for all its versions.',
    example: TOPIC_ID_EXAMPLE,
  })
  topicId: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Type of the topic: `JSD7` or `XML` (messages), `XSD6`, `CSV` or `TSV` (files). May be absent on old channels.',
    enum: ['JSD7', 'XML', 'XSD6', 'CSV', 'TSV'],
    example: 'JSD7',
  })
  schemaType?: string;
}

export class ChannelConditions {
  @ApiProperty({
    description: CONDITIONS_DIDS_DESCRIPTION,
    type: [String],
    example: [DID_EXAMPLE],
  })
  dids: string[];

  @ApiProperty({
    description: CONDITIONS_ROLES_DESCRIPTION,
    type: [String],
    example: [ROLE_EXAMPLE],
  })
  roles: string[];

  @ApiProperty({
    description: QUALIFIED_DIDS_DESCRIPTION,
    example: [DID_EXAMPLE, DID_EXAMPLE_2],
    type: [String],
  })
  qualifiedDids: string[];

  @ApiProperty({
    description:
      'Topics carried by the channel, with their message broker ids. Topics deleted on the message broker are removed from this list within about a minute.',
    type: () => [ChannelTopic],
  })
  topics: ChannelTopic[];

  @ApiProperty({
    description:
      'Reply mapping: messages received on `responseTopicId` should be answered on `topicId`.',
    type: () => [ChannelResponseTopic],
  })
  responseTopics: ChannelResponseTopic[];
}

export class GetChannelResponseDto {
  @ApiProperty({
    description: FQCN_DESCRIPTION,
    type: String,
    example: FQCN_EXAMPLE,
  })
  fqcn: string;

  @ApiProperty({
    description: MESSAGE_FORMS_DESCRIPTION,
    type: Boolean,
    example: false,
    default: false,
  })
  messageForms: boolean;

  @ApiProperty({
    description: PAYLOAD_ENCRYPTION_DESCRIPTION,
    type: Boolean,
    example: true,
    default: true,
  })
  @IsBoolean()
  payloadEncryption: boolean;

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

  @ApiProperty({
    description: USE_ANONYMOUS_EXT_CHANNEL_DESCRIPTION,
    type: Boolean,
    default: false,
    example: false,
  })
  useAnonymousExtChannel: boolean;

  @ApiProperty({
    description:
      'Channel conditions: allowed DIDs and roles, the resolved `qualifiedDids`, and the topics of the channel.',
    type: () => ChannelConditions,
  })
  conditions: ChannelConditions;

  @ApiProperty({
    description: 'When the channel was created (ISO 8601, UTC).',
    type: String,
    format: 'date-time',
    example: '2026-03-22T14:27:00.027Z',
  })
  createdDate: Date;

  @ApiProperty({
    description:
      'When the channel last changed (ISO 8601, UTC), for example by an update or a change of `qualifiedDids`.',
    type: String,
    format: 'date-time',
    example: '2026-03-22T14:28:00.027Z',
  })
  updatedDate: Date;
}

export class GetChannelQualifiedDidsDto {
  @ApiProperty({
    description: 'FQCN of the channel.',
    example: FQCN_EXAMPLE,
    type: String,
  })
  fqcn: string;

  @ApiProperty({
    description: [
      'DIDs allowed on the channel: the listed DIDs plus the holders of the listed roles.',
      '- For `pub` and `upload`, these are the recipients.',
      '- Updated about once a minute; empty until the gateway identity is set up.',
    ].join('\n'),
    example: [DID_EXAMPLE, DID_EXAMPLE_2],
    type: [String],
  })
  qualifiedDids: string[];

  @ApiProperty({
    description: 'When the channel last changed (ISO 8601).',
    example: '2026-03-22T14:27:00.027Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: string;
}
