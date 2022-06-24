import { ApiProperty } from '@nestjs/swagger';
import { SchemaType } from '../topic.const';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsValidApplicationNameSpace } from '../../utils/validator/decorators/IsValidApplicationNameSpace';
import { IsValidTopicName } from '../../utils/validator/decorators/isValidTopicName';
import { ConfigService } from '@nestjs/config';
import { IsValidVersion } from '../../utils/validator/decorators/isValidVersion';

export class GetTopicDto {
  constructor(protected readonly configService: ConfigService) { }

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
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
    example: 'Topic_JSON_V12',
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
    description: 'version of the topic',
    type: String,
    example: '1.0.9',
  })
  version: string;

  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'owner of the topic',
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
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

export class PostTopicDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
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
    example: 'Topic_JSON_V12',
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
    example: '1.0.9',
  })
  version: string;

  @IsString()
  @IsNotEmpty()
  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @ApiProperty({
    description: 'owner of the topic',
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
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

export class PutTopicDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
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
    example: 'Topic_JSON_V12',
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
  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @ApiProperty({
    description: 'owner of the topic',
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
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

export class GetTopicSearchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
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
    example: 'Topic_JSON_V12',
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
    description: 'owner of the topic',
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
  })
  owner: string;

  @IsString()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '1.0.9',
  })
  @IsValidVersion({
    message: 'malformed version',
  })
  public version: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    description: 'tags of the topic',
    type: [String],
    example: `["aggregator"]`,
  })
  tags: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'timestamp of the topic updated',
    type: String,
    example: '2022-06-08T05:43:15.510Z',
    required: false,
  })
  public createdDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'timestamp of the topic updated',
    type: String,
    example: '2022-06-08T05:43:15.510Z',
    required: false,
  })
  public updatedDate?: string;
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
  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
    each: true,
  })
  @ApiProperty({
    example: [
      'torta.apps.eggplant.vege.iam.ewc',
      'mini.apps.sliced.carrot.vege.iam.ewc',
    ],
    type: [String],
  })
  public owner: string[];
}

export class GetTopicsSearchQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Topic_JSON_V12',
    type: String,
  })
  public keyword: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'ddhub.apps.energyweb.iam.ewc',
    required: false,
    type: String,
  })
  public owner: string;

  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 5,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  @IsOptional()
  public page: number = 1;
}

export class GetTopicsQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public page: number = 1;

  @IsOptional()
  @ApiProperty({
    example: 'topic name',
    type: String,
    default: '',
    required: false,
  })
  public name: string;

  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'ddhub.apps.energyweb.iam.ewc',
    required: true,
    type: String,
  })
  public owner: string;

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
    example: 1,
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
    example: 1,
  })
  @IsNumber()
  public page: number;

  @ApiProperty({
    description: 'Topics records',
    type: () => [GetTopicDto],
  })
  @ArrayUnique()
  @IsArray()
  public records: GetTopicDto[];
}

export class PaginatedTopicResponse {
  @IsNumber()
  @ApiProperty({
    description: 'total number of channels',
    type: Number,
    example: 1,
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
    example: 1,
  })
  @IsNumber()
  public page: number;

  @ApiProperty({
    description: 'Topics records',
    type: () => [GetTopicSearchDto],
  })
  @ArrayUnique()
  @IsArray()
  public records: GetTopicSearchDto[];
}

export class TopicCountDto {
  @IsNumber()
  @ApiProperty({
    description: 'number of topics',
    type: Number,
    example: 2,
  })
  public count: number;

  @IsString()
  @ApiProperty({
    description: 'owner name',
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
  })
  public owner: string;
}

export class GetTopicsParamsDto {
  @IsString()
  @ApiProperty({
    description: 'id of the topic',
    type: String,
    example: '62545547fe37f174d7715ff3',
  })
  public id: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    example: 1,
    default: 0,
    required: false,
    type: Number,
  })
  public page: number = 1;

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
    example: '1.0.9',
  })
  @IsValidVersion({
    message: 'malformed version',
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
    example: '1.0.9',
  })
  @IsValidVersion({
    message: 'malformed version',
  })
  public versionNumber: string;
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
    example: '200',
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
    example: 'Topic_JSON_V12',
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

  @IsValidVersion({
    message: 'malformed version',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'version of the topic',
    type: String,
    example: '1.0.9',
  })
  version: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'owner of the topic',
    type: String,
    example: 'torta.apps.eggplant.vege.iam.ewc',
  })
  owner: string;

  @IsArray()
  @ArrayUnique()
  @ApiProperty({
    description: 'tags of the topic',
    type: [String],
    example: `["aggregator"]`,
  })
  tags: string[];
}
