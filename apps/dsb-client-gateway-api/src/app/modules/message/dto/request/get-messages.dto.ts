import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Query parameters shared by `GET /messages` (live pull from the message
 * broker) and `GET /messages/received` (local message store). Each field
 * documents how it is used by both endpoints, because some fields are only
 * honoured by one of them.
 */
export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'ddhub.apps.energyweb.channel.operating.envelope',
    description: [
      'Name of the channel. Required.',
      '- Fetching new messages: the channel to read.',
      '- Listing stored messages: only this channel, unless a reply filter is given.',
    ].join('\n'),
  })
  fqcn: string;

  @IsString()
  @ApiProperty({
    type: String,
    format: 'date-time',
    description: [
      'Fetching new messages only.',
      '- Start time (ISO 8601). Without it, reading continues where the last call stopped.',
      '- Keep the same value between calls, otherwise messages are returned again.',
    ].join('\n'),
    example: '2024-03-31T09:48:44.357Z',
    required: false,
  })
  @IsOptional()
  from: string;

  @ApiProperty({
    type: Number,
    example: 10,
    required: false,
    description: [
      'Maximum number of messages.',
      '- Listing stored messages: default 3.',
    ].join('\n'),
  })
  @IsOptional()
  amount: number;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'getOperatingEnvelope',
    description: 'Topic name; send it together with `topicOwner`.',
  })
  @IsOptional()
  topicName: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'ddhub.apps.energyweb.iam.ewc',
    description:
      'Application namespace that owns the topic. Must be sent together with `topicName` (same rules as `topicName`).',
  })
  @IsOptional()
  topicOwner: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'billingSystem1',
    maxLength: 247,
    pattern: '^[a-zA-Z0-9]+$',
    description: [
      'Fetching new messages only.',
      '- Name of your integration: letters and digits, at most 247 characters.',
      '- Each `clientId` gets every message; callers that share one split the messages.',
      '- The Message Broker limits how many a gateway can have (`MESSAGING:MAXIMUM_NUMBER_OF_CLIENTS_REACHED`).',
    ].join('\n'),
  })
  @IsOptional()
  @MaxLength(247)
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'clientId contains invalid characters',
  })
  clientId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9d',
    description: 'Listing stored messages only: the message that started a conversation (pass a reply\'s `initiatingMessageId`).',
  })
  @IsOptional()
  @IsString()
  initiatingMessageId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Listing stored messages only: the message that started a conversation (pass a reply\'s `initiatingTransactionId`).',
  })
  @IsOptional()
  @IsString()
  initiatingTransactionId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Listing stored messages only: replies to this transaction.',
  })
  @IsOptional()
  @IsString()
  transactionId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9d',
    description: 'Listing stored messages only: the message with this ID.',
  })
  @IsOptional()
  @IsString()
  messageId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9d,657a1f0c2b3e4d5f6a7b8c9e',
    description: 'Listing stored messages only: replies to these message IDs (comma separated, no spaces).',
  })
  @IsOptional()
  @IsString()
  messageIds: string;
}
