import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Filters for `GET /messages/sent` (local store of sent messages, only
 * populated for channels with message forms enabled). The thread filters are
 * deliberately "crossed": they look up the counterpart of a received message.
 */
export class GetSentMessagesRequestDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description:
      'Page size: maximum number of sent messages returned. `0` or omitted means `5`.',
    example: 10,
    default: 5,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    example: 'ddhub.apps.energyweb.channel.operating.envelope',
    description: 'Only messages sent on this channel. Ignored with a reply filter.',
  })
  public fqcn: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9d',
    description: 'The original message that a received reply refers to: pass the reply\'s `initiatingMessageId`.',
  })
  @IsOptional()
  @IsString()
  initiatingMessageId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'The original message that a received reply refers to: pass the reply\'s `initiatingTransactionId`.',
  })
  @IsOptional()
  @IsString()
  initiatingTransactionId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Replies this gateway sent to this transaction: pass the `transactionId` of a received message.',
  })
  @IsOptional()
  @IsString()
  transactionId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '657a1f0c2b3e4d5f6a7b8c9d',
    description: 'Replies this gateway sent to this message: pass the `id` of a received message.',
  })
  @IsOptional()
  @IsString()
  messageId: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    required: false,
    example: 'f923afb7-e334-419c-a72c-a60b293184ea',
    description: 'Only this message. Other filters and paging are ignored.',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  clientGatewayMessageId: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'getOperatingEnvelope',
    description: 'Exact match filter on the topic name.',
  })
  @IsOptional()
  topicName: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'ddhub.apps.energyweb.iam.ewc',
    description:
      'Exact match filter on the application namespace that owns the topic.',
  })
  @IsOptional()
  topicOwner: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description:
      'Page number, starting at `1`. Results are ordered by send time, newest first; page `n` skips `(n - 1) * limit` messages.',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
    type: Number,
  })
  public page: number = 1;
}
