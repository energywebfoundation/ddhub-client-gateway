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

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
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

export class UpdateTopicBodyDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'tags of the topic',
    type: [String],
    example: `["aggregator"]`,
  })
  tags: string[];
}

export class UpdateTopicHistoryBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'schema of the topic',
    type: String,
    example: JSON.stringify({
      type: 'object',
      properties: {
        data: {
          type: 'number',
        },
      },
    }),
  })
  schema: string;
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

export class GetTopicsSearchQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'keyword',
    type: String,
  })
  public keyword: string;

  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public limit: number;

  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  @IsOptional()
  public page: number;
}

export class GetTopicsQueryDto {
  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public limit: number;

  @IsOptional()
  @ApiProperty({
    example: 'topic name',
    type: String,
    default: '',
    required: false,
  })
  public name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
  public owner: string;

  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  @IsOptional()
  public page: number;

  @IsOptional()
  @ApiProperty({
    example: ['aggregator'],
    required: false,
    default: [],
    type: [String],
  })
  public tags: string[];
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
export class GetTopicsParamsDto {
  @IsString()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
  })
  public id: string;
}

export class TopicsByIdAndVersionParamsDto {
  @IsString()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '2.0.0',
  })
  public versionNumber: string;
}

export class DeleteTopicsVersionParamsDto {
  @IsString()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '2.0.0',
  })
  public version: string;
}

export class DeleteTopic {
  @IsString()
  @ApiProperty({
    description: 'timestamp of the topic updated',
    type: String,
    example: '2022-04-12',
  })
  public timestamp: string;

  @IsString()
  @ApiProperty({
    description: 'returnCode from MB',
    type: String,
    example: '400',
  })
  public returnCode: string;

  @IsString()
  @ApiProperty({
    description: 'returnMessage from MB',
    type: String,
    example: 'Success',
  })
  public returnMessage: string;
}

export class PostTopicBodyDto {
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
    description: 'schema of the topic',
    type: String,
    example: JSON.stringify({
      type: 'object',
      properties: {
        data: {
          type: 'number',
        },
      },
    }),
  })
  schema: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '2.0.0',
  })
  version: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'owner of the topic',
    type: String,
    example: 'Vikas',
  })
  owner: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    description: 'tags of the topic',
    type: [String],
    example: `["aggregator"]`,
  })
  tags: string[];
}
