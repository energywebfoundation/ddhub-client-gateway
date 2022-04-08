import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
  clientId: string;
}
