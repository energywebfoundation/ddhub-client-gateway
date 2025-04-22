import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'channel.name',
    description: 'channel name',
  })
  fqcn: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'date from which messages to be fetched',
    example: '2022-03-31T09:48:44.357Z',
    required: false,
  })
  @IsOptional()
  from: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
    description: 'Latest amount of messages to be fetched',
  })
  @IsOptional()
  amount: number;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'getOperatingEnvelope',
    description: 'topic name',
  })
  @IsOptional()
  topicName: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'torta.apps.eggplant.vege.iam.ewc',
    description: 'application namespace',
  })
  @IsOptional()
  topicOwner: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'test2',
    description: 'cursor for pointing to messages',
  })
  @IsOptional()
  @Matches(/^[^\s&<>"'/\r\n]+$/, {
    message: 'clientId contains invalid characters',
  })
  clientId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '507f191e810c19729de860ea',
    description: 'Initiating message id',
  })
  @IsOptional()
  @IsString()
  initiatingMessageId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Initiating transaction id',
  })
  @IsOptional()
  @IsString()
  initiatingTransactionId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Initiating transaction id',
  })
  @IsOptional()
  @IsString()
  transactionId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '507f191e810c19729de860ea',
    description: 'Message id',
  })
  @IsOptional()
  @IsString()
  messageId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '507f191e810c19729de860ea,507f191e810c19729de9821a',
    description: 'Message id array as comma separated string',
  })
  @IsOptional()
  @IsString()
  messageIds: string;
}
