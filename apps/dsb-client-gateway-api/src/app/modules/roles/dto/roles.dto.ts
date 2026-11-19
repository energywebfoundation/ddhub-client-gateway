import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsStringOrNumber } from '../../utils/validator/decorators/IsStringOrNumber';

export class SearchApplicationsQueryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(247)
  @ApiProperty({
    description:
      'Search phrase matched by SSI Hub against application and organisation names and namespaces. Between 3 and 247 characters.',
    example: 'ddhub',
    type: String,
    minLength: 3,
    maxLength: 247,
  })
  public searchKey: string;
}

export class GetRolesByNamespaceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Namespace of the application or organisation.',
    example: 'ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
  public namespace: string;
}

export class RequestorFieldDto {
  @IsString()
  @ApiProperty({
    description: 'The `label` of the role field.',
    example: 'Company Name',
    type: String,
  })
  public key: string;

  @IsStringOrNumber()
  @ApiProperty({
    description:
      'Field value: a string or a number, according to the `fieldType` of the matching role field (for `json` fields send the JSON as a string).',
    oneOf: [{ type: 'string' }, { type: 'number' }],
    example: 'Acme Energy Ltd',
  })
  public value: string | number;
}

export class RequestRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full role namespace to request: `<role>.roles.<application namespace>`.',
    example: 'user.roles.ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
  public role: string;

  @IsArray()
  @ApiProperty({
    description:
      'Values for the fields the role definition asks requestors to fill in (`requestorFields`). Omit or send an empty array when the role has none.',
    type: [RequestorFieldDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => RequestorFieldDto)
  @IsOptional()
  public requestorFields?: RequestorFieldDto[];
}
