import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { IsValidChannelName } from '../../../utils/validator/decorators/IsValidChannelName';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '../../channel.const';
import {
  FQCN_EXAMPLE,
  FQCN_PARAM_DESCRIPTION,
} from '../channel-swagger.docs';

/**
 * Boolean query parameters go through the global ValidationPipe with
 * `enableImplicitConversion`, which converts with `Boolean(value)`. The
 * description below documents that real behaviour.
 */
const TYPE_FILTER_DESCRIPTION = 'Only channels of this type (`pub`, `sub`, `upload`, `download`). Omit for all.';

export class GetChannelParamsDto {
  @IsString()
  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @ApiProperty({
    description: FQCN_PARAM_DESCRIPTION,
    type: String,
    example: FQCN_EXAMPLE,
    pattern: '^[a-z0-9.]{1,255}$',
  })
  fqcn: string;
}

export class GetChannelQualifiedDidsParamsDto {
  @IsString()
  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @ApiProperty({
    description: FQCN_PARAM_DESCRIPTION,
    type: String,
    example: FQCN_EXAMPLE,
    pattern: '^[a-z0-9.]{1,255}$',
  })
  fqcn: string;
}

export class GetChannelByTypeQueryDto {
  @IsEnum(ChannelType)
  @ApiProperty({
    description: TYPE_FILTER_DESCRIPTION,
    enum: [
      ChannelType.SUB,
      ChannelType.PUB,
      ChannelType.DOWNLOAD,
      ChannelType.UPLOAD,
    ],
    example: ChannelType.SUB,
    required: false,
  })
  @IsOptional()
  type: ChannelType;

  @IsBoolean()
  @ApiProperty({
    description: [
      'Only channels with this value.',
      '- Any non-empty value, including `false`, is read as `true`. Send an empty value (`?flag=`) for `false`.',
    ].join('\n'),
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  useAnonymousExtChannel: boolean;

  @IsBoolean()
  @ApiProperty({
    description: [
      'Only channels with this value.',
      '- Any non-empty value, including `false`, is read as `true`. Send an empty value (`?flag=`) for `false`.',
    ].join('\n'),
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  payloadEncryption: boolean;

  @IsBoolean()
  @ApiProperty({
    description: [
      'Only channels with this value.',
      '- Any non-empty value, including `false`, is read as `true`. Send an empty value (`?flag=`) for `false`.',
    ].join('\n'),
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  messageForms: boolean;
}

export class CountChannelMessagesQueryDto {
  @IsEnum(ChannelType)
  @ApiProperty({
    description: 'Only channels of this type. Omit for all.',
    enum: [
      ChannelType.SUB,
      ChannelType.PUB,
      ChannelType.DOWNLOAD,
      ChannelType.UPLOAD,
    ],
    example: ChannelType.SUB,
    required: false,
  })
  @IsOptional()
  type: ChannelType;

  @IsBoolean()
  @ApiProperty({
    description: [
      'Only channels with this value.',
      '- Any non-empty value, including `false`, is read as `true`. Send an empty value (`?flag=`) for `false`.',
    ].join('\n'),
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  useAnonymousExtChannel: boolean;

  @IsBoolean()
  @ApiProperty({
    description: [
      'Only channels with this value.',
      '- Any non-empty value, including `false`, is read as `true`. Send an empty value (`?flag=`) for `false`.',
    ].join('\n'),
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  payloadEncryption: boolean;
}
