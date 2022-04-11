import { ApiProperty } from '@nestjs/swagger';
import { SchemaType } from '../topic.const';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  ArrayUnique,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { IsVersion } from '../../utils/validator/decorators/IsVersion';
import { IsValidTopicName } from '../../utils/validator/decorators/isValidTopicName';
export class Topic {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '622ac6325c890a2fd73cd081',
  })
  id: string;

  @IsValidTopicName({
    message:
      'Malformed topic name. Name should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
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
    example: JSON.stringify({ data: 'Vikas' }),
  })
  schema: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: 'schema type of the topic',
    type: String,
    enum: [
      SchemaType.JSD7,
      SchemaType.XML,
      SchemaType.XSD6,
      SchemaType.CSV,
      SchemaType.TSV,
    ],
    example: 'JSD7',
  })
  schemaType: SchemaType;

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
    example: JSON.stringify({ data: 'Vikas' }),
  })
  schema: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: 'schema type of the topic',
    type: String,
    enum: [
      SchemaType.JSD7,
      SchemaType.XML,
      SchemaType.XSD6,
      SchemaType.CSV,
      SchemaType.TSV,
    ],
    example: 'JSD7',
  })
  schemaType: SchemaType;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'tags of the topic',
    type: [String],
    example: `["aggregator"]`,
  })
  tags: string[];

  @IsVersion({
    message: 'Malformed Version',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '2.0.0',
  })
  version: string;
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

export class GetTopicsCountQueryDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @ApiProperty({
    example: [
      'ddhub.apps.energyweb.iam.ewc',
      'torta.apps.eggplant.vege.iam.ewc',
    ],
    type: [String],
  })
  public owner: string[];
}

export class GetTopicsQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
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
}
