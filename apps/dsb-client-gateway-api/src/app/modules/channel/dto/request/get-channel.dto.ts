import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { IsValidChannelName } from '../../../utils/validator/decorators/IsValidChannelName';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '../../channel.const';

export class GetChannelParamsDto {
  @IsString()
  @IsValidChannelName({
    message:
      '$value is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255',
  })
  @ApiProperty({
    description: 'Channel type',
    type: String,
    example: 'channel.name',
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
    description: 'Channel type',
    type: String,
    example: 'channel.name',
  })
  fqcn: string;
}

export class GetChannelByTypeQueryDto {
  @IsEnum(ChannelType)
  @ApiProperty({
    description: 'Channel type',
    enum: [
      ChannelType.SUB,
      ChannelType.PUB,
      ChannelType.DOWNLOAD,
      ChannelType.UPLOAD,
    ],
    example: 'sub',
    required: false,
  })
  @IsOptional()
  type: ChannelType;

  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  useAnonymousExtChannel: boolean;

  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  payloadEncryption: boolean;

  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  messageForms: boolean;
}

export class CountChannelMessagesQueryDto {
  @IsEnum(ChannelType)
  @ApiProperty({
    description: 'Channel type',
    enum: [ChannelType.SUB, ChannelType.PUB],
    example: ChannelType.SUB,
    required: false,
  })
  @IsOptional()
  type: ChannelType;

  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  useAnonymousExtChannel: boolean;

  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  payloadEncryption: boolean;
}
