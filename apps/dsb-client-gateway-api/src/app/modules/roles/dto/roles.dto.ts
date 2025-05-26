import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

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