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

/* ------------------------------------------------------------------------ */
/* Shared OpenAPI texts (documentation only, no runtime effect)             */
/* ------------------------------------------------------------------------ */

const TOPIC_ID_DESCRIPTION =
  'Topic id assigned by the message broker when the topic was created. All versions of a topic share the same id.';
const TOPIC_ID_EXAMPLE = '62545547fe37f174d7715ff3';

const TOPIC_NAME_DESCRIPTION = 'Topic name, unique within its owner namespace.';
const TOPIC_NAME_PATTERN = '^[a-zA-z0-9.]{1,255}$';
const TOPIC_NAME_EXAMPLE = 'operatorEnvelope';

const SCHEMA_TYPE_DESCRIPTION = [
  'Type of data the topic carries:',
  '- `JSD7`: JSON, for `pub` and `sub` channels. Payloads are checked against the schema.',
  '- `XML`: XML, for `pub` and `sub` channels.',
  '- `XSD6`: XML files, for `upload` and `download` channels.',
  '- `CSV`, `TSV`: comma or tab separated files, for `upload` and `download` channels.',
].join('\n');
const SCHEMA_TYPE_ENUM = [
  SchemaType.JSD7,
  SchemaType.XML,
  SchemaType.XSD6,
  SchemaType.CSV,
  SchemaType.TSV,
];

const SCHEMA_EXAMPLE = JSON.stringify({
  type: 'object',
  properties: {
    data: {
      type: 'number',
    },
  },
});

const VERSION_RULES =
  'Format: `MAJOR.MINOR.PATCH`.';
const VERSION_EXAMPLE = '1.0.9';

const OWNER_DESCRIPTION =
  'Owner of the topic: the namespace of the application (in the Energy Web SSI-Hub) the topic belongs to.';
const OWNER_EXAMPLE = 'ddhub.apps.energyweb.iam.ewc';
const OWNER_RULES =
  'Must be an application namespace, for example `<app>.apps.<org>.iam.ewc`.';

const TAGS_DESCRIPTION =
  'Labels to group and filter topics. Shared by all versions.';
const TAGS_EXAMPLE = ['aggregator'];

const LIMIT_DESCRIPTION =
  'Page size: maximum number of records to return. Defaults to 5 when omitted. Must be a number; send a positive integer.';
const PAGE_DESCRIPTION =
  'Page number, starting at 1. Defaults to 1 when omitted. Must be a positive number (send an integer >= 1).';

/* ------------------------------------------------------------------------ */
/* Topic records                                                            */
/* ------------------------------------------------------------------------ */

export class GetTopicDto {
  constructor(protected readonly configService: ConfigService) { }

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_ID_DESCRIPTION,
    type: String,
    example: TOPIC_ID_EXAMPLE,
  })
  id: string;

  @IsValidTopicName({
    message:
      'Malformed topic name. Name should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_NAME_DESCRIPTION,
    type: String,
    example: TOPIC_NAME_EXAMPLE,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: SCHEMA_TYPE_DESCRIPTION,
    type: String,
    enum: SCHEMA_TYPE_ENUM,
    example: SchemaType.JSD7,
  })
  schemaType: SchemaType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Schema of the version. In lists it is a JSON object, not a string.',
    type: String,
    example: SCHEMA_EXAMPLE,
  })
  schema: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Highest version of the topic (`MAJOR.MINOR.PATCH`).',
    type: String,
    example: VERSION_EXAMPLE,
  })
  version: string;

  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: OWNER_DESCRIPTION,
    type: String,
    example: OWNER_EXAMPLE,
  })
  owner: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    description: TAGS_DESCRIPTION,
    type: [String],
    example: TAGS_EXAMPLE,
  })
  tags: string[];
}

export class PostTopicDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_ID_DESCRIPTION,
    type: String,
    example: TOPIC_ID_EXAMPLE,
  })
  id: string;

  @IsValidTopicName({
    message:
      'Malformed topic name. Name should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_NAME_DESCRIPTION,
    type: String,
    example: TOPIC_NAME_EXAMPLE,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: SCHEMA_TYPE_DESCRIPTION,
    type: String,
    enum: SCHEMA_TYPE_ENUM,
    example: SchemaType.JSD7,
  })
  schemaType: SchemaType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Schema definition of this version as a string (for `JSD7`: the JSON Schema document encoded as JSON text).',
    type: String,
    example: SCHEMA_EXAMPLE,
  })
  schema: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Version of the topic (`MAJOR.MINOR.PATCH`).',
    type: String,
    example: VERSION_EXAMPLE,
  })
  version: string;

  @IsString()
  @IsNotEmpty()
  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @ApiProperty({
    description: OWNER_DESCRIPTION,
    type: String,
    example: OWNER_EXAMPLE,
  })
  owner: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    description: TAGS_DESCRIPTION,
    type: [String],
    example: TAGS_EXAMPLE,
  })
  tags: string[];
}

export class PutTopicDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_ID_DESCRIPTION,
    type: String,
    example: TOPIC_ID_EXAMPLE,
  })
  id: string;

  @IsValidTopicName({
    message:
      'Malformed topic name. Name should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_NAME_DESCRIPTION,
    type: String,
    example: TOPIC_NAME_EXAMPLE,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: SCHEMA_TYPE_DESCRIPTION,
    type: String,
    enum: SCHEMA_TYPE_ENUM,
    example: SchemaType.JSD7,
  })
  schemaType: SchemaType;

  @IsString()
  @IsNotEmpty()
  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @ApiProperty({
    description: OWNER_DESCRIPTION,
    type: String,
    example: OWNER_EXAMPLE,
  })
  owner: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    description: 'The tags of the topic now.',
    type: [String],
    example: TAGS_EXAMPLE,
  })
  tags: string[];
}

export class GetTopicSearchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_ID_DESCRIPTION,
    type: String,
    example: TOPIC_ID_EXAMPLE,
  })
  id: string;

  @IsValidTopicName({
    message:
      'Malformed topic name. Name should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: TOPIC_NAME_DESCRIPTION,
    type: String,
    example: TOPIC_NAME_EXAMPLE,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: SCHEMA_TYPE_DESCRIPTION,
    type: String,
    enum: SCHEMA_TYPE_ENUM,
    example: SchemaType.JSD7,
  })
  schemaType: SchemaType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: OWNER_DESCRIPTION,
    type: String,
    example: OWNER_EXAMPLE,
  })
  owner: string;

  @IsString()
  @ApiProperty({
    description: 'Version of this record (`MAJOR.MINOR.PATCH`).',
    type: String,
    example: VERSION_EXAMPLE,
  })
  @IsValidVersion({
    message: 'malformed version',
  })
  public version: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    description: TAGS_DESCRIPTION,
    type: [String],
    example: TAGS_EXAMPLE,
  })
  tags: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'When this gateway first saw the version (ISO 8601). Not returned when listing versions.',
    type: String,
    format: 'date-time',
    example: '2026-06-08T05:43:15.510Z',
    required: false,
  })
  public createdDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'When this gateway last saw the version change (ISO 8601). Not returned when listing versions.',
    type: String,
    format: 'date-time',
    example: '2026-06-08T05:43:15.510Z',
    required: false,
  })
  public updatedDate?: string;
}

/* ------------------------------------------------------------------------ */
/* Request bodies                                                           */
/* ------------------------------------------------------------------------ */

export class UpdateTopicBodyDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The full new list of tags; replaces the current tags. Send `[]` to remove all.',
    type: [String],
    example: TAGS_EXAMPLE,
  })
  tags: string[];
}

export class UpdateTopicHistoryBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Schema of the version, as a string. For `JSD7`, a JSON Schema as JSON text.',
    type: String,
    example: SCHEMA_EXAMPLE,
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

/* ------------------------------------------------------------------------ */
/* Query and path parameters                                                */
/* ------------------------------------------------------------------------ */

export class GetTopicsCountQueryDto {
  @IsNotEmpty()
  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
    each: true,
  })
  @ApiProperty({
    description: 'Application namespace, for example `<app>.apps.<org>.iam.ewc`. Repeat it for several (`?owner=a&owner=b`).',
    example: [
      'ddhub.apps.energyweb.iam.ewc',
      'marketoperator.apps.energyweb.iam.ewc',
    ],
    type: [String],
  })
  public owner: string[];
}

export class GetTopicsSearchQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'Text to look for in topic names (matches anywhere in the name). `%` and `_` in the keyword act as wildcards. Required and non-empty.',
    example: 'operator',
    type: String,
  })
  public keyword: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'Only return topics of this owner (exact match on the application namespace). Not format-validated on this endpoint. Omit to search all owners.',
    example: OWNER_EXAMPLE,
    required: false,
    type: String,
  })
  public owner: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: LIMIT_DESCRIPTION,
    example: 10,
    default: 5,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: PAGE_DESCRIPTION,
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  public page: number = 1;
}

export class GetTopicsQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: LIMIT_DESCRIPTION,
    example: 10,
    default: 5,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: PAGE_DESCRIPTION,
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  public page: number = 1;

  @IsOptional()
  @ApiProperty({
    description:
      'Only return the topic with exactly this name (exact, case-sensitive match). Omit to return all topics of the owner.',
    example: TOPIC_NAME_EXAMPLE,
    type: String,
    required: false,
  })
  public name: string;

  @IsValidApplicationNameSpace(new ConfigService(), {
    message: 'Malformed owner name. Please enter correct owner name',
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: `Application namespace whose topics to list (required). ${OWNER_RULES}`,
    example: OWNER_EXAMPLE,
    required: true,
    type: String,
  })
  public owner: string;

  @IsOptional()
  @ApiProperty({
    description: 'Topics with at least one of these tags; a tag matches when it contains the text. Repeat it for several tags.',
    example: TAGS_EXAMPLE,
    required: false,
    type: [String],
  })
  public tags: string[];
}

/* ------------------------------------------------------------------------ */
/* Responses                                                                */
/* ------------------------------------------------------------------------ */

export class PaginatedResponse {
  @IsNumber()
  @ApiProperty({
    description:
      'Total number of topics matching the filters (latest version of each topic counted once), across all pages.',
    type: Number,
    example: 12,
  })
  public count: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Page size used for this response (the `limit` query parameter, default 5).',
    example: 5,
    default: 5,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: 'Page number of this response (the `page` query parameter, default 1).',
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  public page: number = 1;

  @ApiProperty({
    description:
      'A list of topics on this page, each at its highest version, with its schema.',
    type: () => [GetTopicDto],
  })
  @ArrayUnique()
  @IsArray()
  public records: GetTopicDto[];
}

export class PaginatedTopicResponse {
  @IsNumber()
  @ApiProperty({
    description: 'Total number of versions of the topic, across all pages.',
    type: Number,
    example: 3,
  })
  public count: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Page size used for this response (the `limit` query parameter, default 5).',
    example: 5,
    default: 5,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: 'Page number of this response (the `page` query parameter, default 1).',
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  public page: number = 1;

  @ApiProperty({
    description: 'A list of versions on this page, without the schema. Order not guaranteed.',
    type: () => [GetTopicSearchDto],
  })
  @ArrayUnique()
  @IsArray()
  public records: GetTopicSearchDto[];
}

export class TopicCountDto {
  @IsNumber()
  @ApiProperty({
    description: 'Number of topics this owner has on the message broker.',
    type: Number,
    example: 2,
  })
  public count: number;

  @IsString()
  @ApiProperty({
    description: 'Application namespace the count belongs to.',
    type: String,
    example: OWNER_EXAMPLE,
  })
  public owner: string;
}

export class GetTopicsParamsDto {
  @IsString()
  @ApiProperty({
    description: TOPIC_ID_DESCRIPTION,
    type: String,
    example: TOPIC_ID_EXAMPLE,
  })
  public id: string;
}

export class GetTopicsWithLimitParamsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: LIMIT_DESCRIPTION,
    example: 10,
    default: 5,
    required: false,
    type: Number,
  })
  public limit: number = 5;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: PAGE_DESCRIPTION,
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  public page: number = 1;

}

export class TopicsByIdAndVersionParamsDto {
  @IsString()
  @ApiProperty({
    description: TOPIC_ID_DESCRIPTION,
    type: String,
    example: TOPIC_ID_EXAMPLE,
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: `Topic version. ${VERSION_RULES}`,
    type: String,
    example: VERSION_EXAMPLE,
    pattern: '^(\\d+\\.)(\\d+\\.)(\\d+)$',
  })
  @IsValidVersion({
    message: 'malformed version',
  })
  public versionNumber: string;
}

export class DeleteTopicsVersionParamsDto {
  @IsString()
  @ApiProperty({
    description: TOPIC_ID_DESCRIPTION,
    type: String,
    example: TOPIC_ID_EXAMPLE,
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: `Version to delete. ${VERSION_RULES}`,
    type: String,
    example: VERSION_EXAMPLE,
    pattern: '^(\\d+\\.)(\\d+\\.)(\\d+)$',
  })
  @IsValidVersion({
    message: 'malformed version',
  })
  public versionNumber: string;
}

export class DeleteTopic {
  @IsString()
  @ApiProperty({
    description: 'Time of the deletion as reported by the message broker.',
    type: String,
    example: '2026-04-12T10:15:30.000Z',
  })
  public timestamp: string;

  @IsString()
  @ApiProperty({
    description: 'Return code reported by the message broker.',
    type: String,
    example: '200',
  })
  public returnCode: string;

  @IsString()
  @ApiProperty({
    description: 'Human-readable result reported by the message broker.',
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
    description: [
      'Topic name, unique within `owner`.',
      '- 1 to 255 characters: letters, digits, dots and underscores.',
      '- No spaces or dashes.',
    ].join('\n'),
    type: String,
    example: TOPIC_NAME_EXAMPLE,
    pattern: TOPIC_NAME_PATTERN,
    minLength: 1,
    maxLength: 255,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SchemaType)
  @ApiProperty({
    description: [
      'Type of data the topic carries. Cannot be changed later.',
      '- `JSD7`: JSON, for `pub` and `sub` channels. Payloads are checked against the schema.',
      '- `XML`: XML, for `pub` and `sub` channels.',
      '- `XSD6`: XML files, for `upload` and `download` channels.',
      '- `CSV`, `TSV`: comma or tab separated files, for `upload` and `download` channels.',
    ].join('\n'),
    type: String,
    enum: SCHEMA_TYPE_ENUM,
    example: SchemaType.JSD7,
  })
  schemaType: SchemaType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Schema of the first version, as a string. For `JSD7`, a JSON Schema as JSON text. An invalid schema returns `MB::ERROR`.',
    type: String,
    example: SCHEMA_EXAMPLE,
  })
  schema: string;

  @IsValidVersion({
    message: 'malformed version',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'First version (`MAJOR.MINOR.PATCH`).',
    type: String,
    example: '1.0.0',
    pattern: '^(\\d+\\.)(\\d+\\.)(\\d+)$',
  })
  version: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Application namespace that owns the topic. An invalid owner returns `MB::ERROR`.',
    type: String,
    example: OWNER_EXAMPLE,
  })
  owner: string;

  @IsArray()
  @ArrayUnique()
  @ApiProperty({
    description: 'Labels to group and filter topics, unique. Send `[]` for none.',
    type: [String],
    example: TAGS_EXAMPLE,
  })
  tags: string[];
}
