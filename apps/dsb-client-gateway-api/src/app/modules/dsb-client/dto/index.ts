import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  ArrayUnique,
  IsNumber,
  IsObject,
  isArray,
} from 'class-validator';

export class Topic {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '622ac6325c890a2fd73cd081',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name of the topic',
    type: String,
    example: 'topic16',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'owner of the topic',
    type: String,
    example: 'Vikas',
  })
  owner: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'schema of the topic',
    type: String,
    example: '{\n        "data": "Vikas"\n    }',
  })
  schema: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'schema type of the topic',
    type: String,
    example: 'JSD7',
  })
  schemaType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'tags of the topic',
    type: [String],
    example: `["aggregator"]`,
  })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '2.0.0',
  })
  version: string;
}

export class SendTopicBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name of the topic',
    type: String,
    example: 'topic16',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'owner of the topic',
    type: String,
    example: 'Vikas',
  })
  owner: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'schema of the topic',
    type: String,
    example: '{\n        "data": "Vikas"\n    }',
  })
  schema: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'schema type of the topic',
    type: String,
    example: 'JSD7',
  })
  schemaType: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'tags of the topic',
    type: [String],
    example: `["aggregator"]`,
  })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '2.0.0',
  })
  version: string;
}

export class FileUploadBodyDto {
  @IsString()
  @IsNotEmpty()
  public fqcn: string;

  @IsString()
  @IsNotEmpty()
  public topicId: string;

  @IsString()
  @IsNotEmpty()
  public fileName: string;
}

export class SendMessageBodyDto {
  @IsString()
  @IsNotEmpty()
  public fqcn: string;

  @IsString()
  @IsNotEmpty()
  public topic: string;

  @IsNotEmpty()
  public payload: object;
}

export class GetMessagesQueryDto {
  @IsNotEmpty()
  @IsString()
  public fqcn: string;

  @IsPositive()
  @IsOptional()
  public amount?: number;

  @IsDateString()
  @IsOptional()
  public from?: string;

  @IsString()
  @IsOptional()
  public clientId?: string;
}

export class GetApplicationsQueryDto {
  @IsNotEmpty()
  @IsString()
  public roleName: string;
}

export class GetTopicsCountQueryDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  public owner: string[];
}

export class GetTopicsQueryDto {
  @IsNotEmpty()
  @IsString()
  public owner: string;
}
export class PaginatedResponse {
  @IsNumber()
  @ApiProperty({
    description: 'total number of channels',
    type: Number,
    example: 2,
  })
  public count: number;

  @ApiProperty({
    description: 'limit of channels',
    type: Number,
    example: 1,
  })
  @IsNumber()
  public limit: number;
  @ApiProperty({
    description: 'page number out of total pages',
    type: Number,
    example: 2,
  })
  @IsNumber()
  public page: number;

  @ApiProperty({
    description: 'Topics records',
    type: () => [Topic],
  })
  @ArrayUnique()
  @IsArray()
  public records: Topic[];
}

export class TopicsCountResponse {
  @IsNumber()
  @ApiProperty({
    description: 'owner name',
    type: Number,
    example: 2,
  })
  public owner: number;

  @ApiProperty({
    description: 'owner name',
    type: Number,
    example: 3,
  })
  public owner1: number;
}
