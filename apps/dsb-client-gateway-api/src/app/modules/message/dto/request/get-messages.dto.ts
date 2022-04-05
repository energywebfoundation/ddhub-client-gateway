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
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'date from which messages to be fetched',
    example: '2022-03-31T09:48:44.357Z',
  })
  from: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Latest amount of messages to be fetched',
  })
  amount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'getOperatingEnvelope',
    description: 'topic name',
  })
  topicName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
    description: 'application namespace',
  })
  topicOwner: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'test2',
    description: 'cursor for pointing to messages',
  })
  clientId: string;
}
