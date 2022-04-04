import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: ['62453a51ab8d1b108a880af7', '62453a51ab8d1b108a880af6'],
    description: 'Array of Topic Ids',
  })
  topicId: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: ['did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D'],
    description: 'Array of Sender Ids',
  })
  senderId: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'bb2686d2-97be-436b-8869-f4de5b280c9a',
    description: 'client Id',
  })
  clientId: string;

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
    description: 'date from which messages to be fetched',
    example: '2022-03-31T09:48:44.357Z',
  })
  from: string;
}
