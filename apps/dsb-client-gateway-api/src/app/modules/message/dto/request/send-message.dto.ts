import {
  ArrayMaxSize,
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsValidChannelName } from '../../../utils/validator/decorators/IsValidChannelName';
import { ApiProperty } from '@nestjs/swagger';

const FQCN_PATTERN = '^[a-z0-9.]{1,255}$';

export class SendMessageDto {
  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: [
      'Name of a `pub` channel (lowercase letters, digits and dots, 1 to 255 characters).',
      '- Its recipients get the message.',
      '- Its `payloadEncryption` decides whether the message is encrypted.',
      '- Its `messageForms` decides whether a copy is kept.',
    ].join('\n'),
    type: String,
    pattern: FQCN_PATTERN,
    maxLength: 255,
    example: 'ddhub.apps.energyweb.channel.operating.envelope',
  })
  fqcn: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'When replying: the `id` of the received message.',
    type: String,
    example: '657a1f0c2b3e4d5f6a7b8c9d',
    required: false,
  })
  initiatingMessageId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'When replying: the `transactionId` of the received message.',
    type: String,
    example: '8ac55aa7-7d6d-438a-98bd-376079903c7b',
    required: false,
  })
  initiatingTransactionId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'getOperatingEnvelope',
    description: 'Topic name. With `topicOwner` and `topicVersion`, it must point to a topic of the channel.',
  })
  topicName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '1.0.0',
    description:
      'Exact topic version (semantic version string) to send with. Recipients receive this version and use its schema.',
  })
  topicVersion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'ddhub.apps.energyweb.iam.ewc',
    description: 'Application namespace that owns the topic.',
  })
  topicOwner: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Optional ID of your choice. Recipients receive it unchanged, so you can use it to link or deduplicate messages.',
  })
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '{"siteId":"NMI-0001","limitKw":49.5,"validFrom":"2024-03-31T10:00:00Z"}',
    description: [
      'Message content, as a string.',
      '- `JSD7` topics: JSON that matches the topic schema; otherwise `422 DDHUB::INVALID_PAYLOAD`.',
      '- Other topic types: not checked.',
      '- The whole request is limited by `REQUEST_BODY_SIZE` (default 50 MB).',
    ].join('\n'),
  })
  payload: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  @ArrayUnique()
  @ArrayMaxSize(25)
  @MaxLength(255, {
    each: true,
  })
  @ApiProperty({
    description: [
      'Association keys of extra, anonymous recipients (mainly for anonymous external channels).',
      '- Up to 25 unique entries, at most 255 characters each.',
      '- Messages to them are never encrypted.',
    ].join('\n'),
    type: [String],
    required: false,
    default: [],
    maxItems: 25,
    uniqueItems: true,
    example: [],
  })
  anonymousRecipient: string[] = [];
}

export class uploadMessageBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: [
      'The CSV file.',
      '- Content type `text/csv`.',
      '- At most `MAX_FILE_SIZE` (default 100 MB).',
      '- The content is not checked against the topic schema.',
    ].join('\n'),
  })
  file: string;

  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: [
      'Name of an `upload` channel (lowercase letters, digits and dots, 1 to 255 characters).',
      '- Its recipients get the file.',
      '- Its `payloadEncryption` decides whether the file is encrypted.',
      '- Its `messageForms` decides whether a copy is kept.',
    ].join('\n'),
    type: String,
    pattern: FQCN_PATTERN,
    maxLength: 255,
    example: 'ddhub.apps.energyweb.channel.meter.reads.upload',
  })
  fqcn: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'meterReadsCsv',
    description:
      'Topic name. Together with `topicOwner` and `topicVersion` it must identify a topic version known to the gateway and bound to the channel.',
  })
  topicName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '1.0.0',
    description: 'Exact topic version (semantic version string).',
  })
  topicVersion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'ddhub.apps.energyweb.iam.ewc',
    description: 'Application namespace that owns the topic.',
  })
  topicOwner: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Optional ID of your choice. Recipients receive it unchanged.',
  })
  transactionId: string;
}
