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

export class SendMessageDto {
  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Channel Name',
    type: String,
    example: 'channel.name',
  })
  fqcn: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Initiating message id',
    type: String,
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  initiatingMessageId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Initiating transaction id',
    type: String,
    example: '8ac55aa7-7d6d-438a-98bd-376079903c7b',
    required: false,
  })
  initiatingTransactionId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Topic name',
  })
  topicName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '1.0.0',
    description: 'Topic Version',
  })
  topicVersion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'aemo.edge',
    description: 'Topic Owner',
  })
  topicOwner: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Transaction Id used to check Idempotency',
  })
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '{ data: 49 }',
    description: 'Payload to be sent to message',
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
    description:
      'List of anonymous keys which will serve as recipients of the message.',
    type: [String],
  })
  anonymousRecipient: string[] = [];
}

export class uploadMessageBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File uploaded',
  })
  file: string;

  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Channel Name',
    type: String,
    example: 'channel.name',
  })
  fqcn: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Topic name',
  })
  topicName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '1.0.0',
    description: 'Topic Version',
  })
  topicVersion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'aemo.edge',
    description: 'Topic Owner',
  })
  topicOwner: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Transaction Id used to check Idempotency',
  })
  transactionId: string;
}
