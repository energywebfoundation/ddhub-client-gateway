import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSentMessagesRequestDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Limit per request',
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'channel.name',
    description: 'channel name',
  })
  public fqcn: string;

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
    description: 'Transaction id',
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
    example: '45d5a89f-7c2c-48b0-ae9a-54f4128e818f',
    description: 'Client Gateway Message id',
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

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: 'Current page',
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public page: number = 1;
}
