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
    example: 'ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
  public namespace: string;
}

export class RequestorFieldDto {
  @IsString()
  @ApiProperty({
    example: 'name',
    type: String,
  })
  public key: string;

  @IsStringOrNumber()
  @ApiProperty({
    example: 'John Doe',
    type: String,
  })
  public value: string | number;
}

export class RequestRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user.roles.ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
  public role: string;

  @IsArray()
  @ApiProperty({
    type: [RequestorFieldDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => RequestorFieldDto)
  @IsOptional()
  public requestorFields?: RequestorFieldDto[];
}
