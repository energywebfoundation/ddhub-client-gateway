import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
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
}

export class uploadMessageBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File uploaded',
  })
  file: 'binary';

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
    description: 'Transaction Id used to check Idempotency',
  })
  transactionId: string;
}
